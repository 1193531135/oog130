<script setup>
// 导入必要的 Vue 组合式 API
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
// 导入支付相关 SDK
import { loadStripe } from "@stripe/stripe-js";
import { loadScript } from "@paypal/paypal-js";
// 导入 Firebase 匿名账户创建功能
import { createAnonymousAccount } from "@/config/firebase.js";
// 导入支付相关 API
import {
  createCheckoutPaypalSession,
  createCheckoutSessionEmbedded,
  synchPaypalSubscription,
} from "@/api/system/index.js";
// 导入配置文件
import webConfig from "@/config/index.js";
// 导入支付流程状态管理工具
import {
  clearPaymentFlowState,
  getPaymentFlowState,
  startPaymentFlow,
  updatePaymentFlowState,
} from "@/tool/payment.js";

// 定义组件 props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  productInfo: {
    type: Object,
    default: null,
  },
});

// 定义组件事件
const emit = defineEmits(["update:modelValue"]);

// 路由和语言数据
const route = useRoute();
const pageText = window.languageData[route.name];

// 状态变量
const paymentError = ref(""); // 支付错误信息
const isPreparingPaypal = ref(false); // PayPal 准备状态
const isCreatingStripeCheckout = ref(false); // Stripe 结账创建状态
const activePopup = ref(""); // 当前激活的弹窗
const checkout = ref(null); // Stripe 结账对象
const checkoutMounted = ref(false); // Stripe 结账是否已挂载
const paypalButtonsRendered = ref(false); // PayPal 按钮是否已渲染
const paypalToken = ref(""); // PayPal 令牌
const paypalSubscriptionId = ref(""); // PayPal 订阅 ID
const activeSession = ref(getPaymentFlowState()); // 当前支付流程状态

// 支付 SDK 实例
let stripeInstancePromise = null; // Stripe SDK 实例
let paypalInstancePromise = null; // PayPal SDK 实例

// 计算属性
const productTitle = computed(() => props.productInfo?.name || "",); // 产品标题
const stripeText = computed(() => pageText?.stripeText || "",); // 产品标题
const productPrice = computed(() => formatDisplayPrice(props.productInfo)); // 产品价格
const privacyText1 = computed(() => pageText?.privacyText1 || "",); 
const privacyText2 = computed(() => pageText?.privacyText2 || "",); 

// 获取 UID
async function ensureUid() {
  // 首先尝试从 sessionStorage 中获取 uid
  const existingUid = window.sessionStorage.getItem("uid");
  if (existingUid) {
    return existingUid;
  }

  try {
    // 尝试创建匿名账户
    return await createAnonymousAccount();
  } catch (error) {
    console.error("Falling back to session uid:", error);
    // 如果创建失败，生成一个备用 uid
    const fallbackUid = `web_guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    window.sessionStorage.setItem("uid", fallbackUid);
    return fallbackUid;
  }
}
//待确认：折扣判断
function formatDisplayPrice(product) {
  if (!product || !product.priceUnitAmount || !product.priceCurrency) {
    return pageText.summary.pricePending;
  }
  let price = props.discount ? (product.priceDiscountUnitAmount / 100).toFixed(2) : (product.priceUnitAmount / 100).toFixed(2);  
  return `${price} ${product.priceCurrency.toUpperCase()}`;
}

function resetPaymentArtifacts({ clearState = false } = {}) {
  unmountCheckout();
  destroyCheckout();
  clearPaypalButtons();
  paymentError.value = "";

  if (clearState) {
    clearPaymentFlowState();
    activeSession.value = null;
  }
}

function resetStripeArtifacts({ clearState = false } = {}) {
  unmountCheckout();
  destroyCheckout();
  paymentError.value = "";

  if (clearState) {
    clearPaymentFlowState();
    activeSession.value = null;
  }
}

// 支付Stripe函数
async function createStripeCheckout() {
  if (!props.productInfo || isCreatingStripeCheckout.value || activePopup.value !== "stripe") {
    return;
  }

  paymentError.value = "";
  isCreatingStripeCheckout.value = true;

  try {
    const uid = await ensureUid();    
    clearPaymentFlowState();
    activeSession.value = await startPaymentFlow({
      uid,
      productId: props.productInfo.id,
      productName: productTitle.value,
      priceDisplay: productPrice.value,
      routePath: route.path,
    });

    let params = {
      discountEnum: props.discount ? "DISCOUNT" : "NORMAL",
      product: props.productInfo.id,
      return_url: window.location.origin + "/register",
      cancel_url: window.location.origin + "/superwall",
      visitor: 0,
    };
    const { data } = await createCheckoutSessionEmbedded(uid, params);

    if (!data?.clientSecret || !data?.sessionId) {
      throw new Error("Missing clientSecret or sessionId");
    }

    activeSession.value = updatePaymentFlowState({
      paymentMethod: "stripe",
      provider: "stripe",
      sessionId: data.sessionId,
      clientSecret: data.clientSecret,
      status: "checkout_ready",
      priceDisplay: productPrice.value,
    });

    stripeInstancePromise ||= loadStripe(webConfig.stripeConfig.stripeKey);
    const stripe = await stripeInstancePromise;
    if (!stripe) {
      throw new Error("Stripe initialization failed");
    }

    checkout.value = await stripe.createEmbeddedCheckoutPage({
      clientSecret: data.clientSecret,
    });

    if (activePopup.value !== "stripe") {
      return;
    }

    await mountCheckout();
  } catch (error) {
    paymentError.value = pageText?.errors?.createCheckout || 'Failed to create Stripe checkout';
    destroyCheckout();
    activeSession.value = updatePaymentFlowState({
      paymentMethod: "stripe",
      provider: "stripe",
      status: "failed",
      result: "failed",
    });
  } finally {
    isCreatingStripeCheckout.value = false;
  }
}

// 支付Paypal函数
async function createPaypalCheckout() {
  if (!props.productInfo || isPreparingPaypal.value) {
    return;
  }
  const uid = await ensureUid();
  clearPaymentFlowState();
  activeSession.value = await startPaymentFlow({
      uid,
      productId: props.productInfo.id,
      productName: productTitle.value,
      priceDisplay: productPrice.value,
      routePath: route.path,
    });

  paymentError.value = "";
  isPreparingPaypal.value = true;
  try {
    const uid = await ensureUid();
    clearPaymentFlowState();
    let params = {
      discountEnum: props.discount ? "DISCOUNT" : "NORMAL",
      product: props.productInfo.id,
      return_url: window.location.origin + "/register",
      cancel_url: window.location.origin + "/superwall",
      visitor: 0,
    };
    const { data } = await createCheckoutPaypalSession(uid, params);

    if (!data?.token || !data?.subscriptionId) {
      throw new Error("Missing PayPal token or subscriptionId");
    }

    paypalToken.value = data.token;
    paypalSubscriptionId.value = data.subscriptionId;
    activeSession.value = updatePaymentFlowState({
      paymentMethod: "paypal",
      provider: "paypal",
      subscriptionId: data.subscriptionId,
      status: "paypal_ready",
      priceDisplay: productPrice.value,
    });
    await initPayPalPayment(paypalToken.value, uid);
    paypalButtonsRendered.value = true;
  } catch (error) {
    console.error("Failed to start PayPal checkout:", error);
    paymentError.value = pageText?.errors?.createPaypal || 'Failed to create PayPal checkout';
    clearPaypalButtons();
  } finally {
    isPreparingPaypal.value = false;
  }
}

async function initPayPalPayment(baToken, uid) {
  paypalInstancePromise ||= loadScript({
    clientId: webConfig.paypalConfig.clientId,
    vault: true,
    intent: "tokenize",
  });

  const paypal = await paypalInstancePromise;
  if (!paypal) {
    throw new Error("PayPal initialization failed");
  }

  await nextTick();
  const paypalContainer = document.getElementById("payment-inline-paypal");
  if (!paypalContainer) {
    console.error("initPayPalPayment: PayPal container not found");
    return;
  }

  paypalContainer.innerHTML = "";

  try {
    const buttons = paypal.Buttons({
      style: {
        shape: "rect",
        color: "gold",
        layout: "horizontal",
        label: "buynow",
        height: 55,
        text: {
          color: "#FFFFFF"
        }
      },
      createBillingAgreement: () => {
        return baToken;
      },
      onApprove: async () => {
        try {
          await synchPaypalSubscription(uid, paypalSubscriptionId.value);
          activeSession.value = updatePaymentFlowState({
            paymentMethod: "paypal",
            provider: "paypal",
            subscriptionId: paypalSubscriptionId.value,
            status: "paid",
            result: "success",
          });
          //待确认：跳转到支付成功的界面
          window.location.hash = "";
        } catch (error) {
          console.error("initPayPalPayment: synchPaypalSubscription failed:", error);
          paymentError.value = pageText?.errors?.createPaypal || 'Failed to create PayPal checkout';
        }
      },
      onError: (error) => {
        console.error("PayPal payment error:", error);
        paymentError.value = pageText?.errors?.createPaypal || 'Failed to create PayPal checkout';
      },
      onCancel: () => {
        console.log("PayPal payment cancelled");
      },
    });
    
    await buttons.render("#payment-inline-paypal");
  } catch (error) {
    console.error("initPayPalPayment: error rendering PayPal buttons:", error);
    throw error;
  }
}

async function openPaymentPopup(method) {
  if (method !== "stripe" || !props.productInfo || isCreatingStripeCheckout.value) {
    return;
  }
  unmountCheckout();
  destroyCheckout();
  paymentError.value = "";
  clearPaymentFlowState();
  activeSession.value = null;
  activePopup.value = method;

  await nextTick();
  await createStripeCheckout();
}

// 挂载 Stripe 结账
async function mountCheckout() {
  if (!checkout.value || checkoutMounted.value || activePopup.value !== "stripe") {
    return;
  }

  await nextTick();
  const checkoutContainer = document.getElementById("payment-popup-checkout");
  if (!checkoutContainer || activePopup.value !== "stripe") {
    return;
  }

  checkout.value.mount("#payment-popup-checkout");
  checkoutMounted.value = true;
}

function unmountCheckout() {
  if (!checkout.value || !checkoutMounted.value) {
    return;
  }

  checkout.value.unmount();
  checkoutMounted.value = false;
}

function clearPaypalButtons() {
  const paypalContainer = document.getElementById("payment-inline-paypal");
  if (paypalContainer) {
    paypalContainer.innerHTML = "";
  }
  paypalButtonsRendered.value = false;
  paypalToken.value = "";
  paypalSubscriptionId.value = "";
}

function destroyCheckout() {
  if (checkout.value) {
    checkout.value.destroy();
    checkout.value = null;
  }
  checkoutMounted.value = false;
}

function closePaymentPopup() {
  resetStripeArtifacts({ clearState: true });
  activePopup.value = "";
}

function closeDrawer() {
  activePopup.value = "";
  resetPaymentArtifacts({ clearState: true });
  emit("update:modelValue", false);
}

// 组件挂载时调用 createPaypalCheckout
onMounted(() => {
  paymentError.value = "";
  nextTick(() => {
    createPaypalCheckout();
  });
  console.log("pageText", pageText);
});

onUnmounted(() => {
  resetPaymentArtifacts({ clearState: true });  
});
</script>

<template>
  <transition name="drawer-fade">
    <div v-if="modelValue" class="drawer-root">
      <div class="drawer-card">
        <button class="drawer-close" @click="closeDrawer" aria-label="Close payment drawer">
          ×
        </button>

        <div class="drawer-content">
          <div class="product-block">
            <div class="product-title">{{ productTitle }}</div>
            <div class="product-price">{{ productPrice }}</div>
          </div>

          <div class="action-section">
            <div class="paypal-entry" :class="{ 'paypal-entry--loading': isPreparingPaypal }">
              <div v-if="isPreparingPaypal" class="panel-message inline-message">
                {{ pageText?.paymentModal?.paypalLoading || 'Loading PayPal...' }}
              </div>
              <div
                id="payment-inline-paypal"
                class="paypal-inline-container"
              ></div>
            </div>

            <button
              class="payment-entry wallet-entry"
              :disabled="!productInfo || isCreatingStripeCheckout"
              @click="openPaymentPopup('stripe')"
            >
              <span class="wallet-brand apple-brand">
                <span>{{ stripeText }}</span>
              </span>
            </button>
          </div>

          <div class="card-toggle">
            <span>Pay by credit card</span>
            <span class="card-toggle-icon" aria-hidden="true">⌃</span>
          </div>

          <div class="card-form-shell" @click="openPaymentPopup('stripe')">
            <div class="card-form-title">Credit or Debit Card Number</div>
            <div class="card-form-field">
              <span class="card-form-icon" aria-hidden="true">▭</span>
              <span class="card-form-placeholder">XXXX XXXX XXXX XXXX</span>
            </div>

            <div class="card-form-row-title">
              <span>Expiry Date</span>
              <span>CVV/CVC</span>
            </div>
            <div class="card-form-row">
              <div class="card-form-field card-form-field--half">
                <span class="card-form-placeholder">MM/YY</span>
              </div>
              <div class="card-form-field card-form-field--half">
                <span class="card-form-placeholder">CVV</span>
                <span class="card-form-info" aria-hidden="true">!</span>
              </div>
            </div>

            <button
              type="button"
              class="card-pay-button"
              :disabled="!productInfo || isCreatingStripeCheckout"
              @click.stop="openPaymentPopup('stripe')"
            >
              <span class="card-pay-lock" aria-hidden="true">▣</span>
              <span>Pay</span>
            </button>
          </div>

          <div v-if="paymentError && !activePopup" class="panel-error">
            {{ paymentError }}
          </div>

          <div class="pay-description">
            {{ privacyText1 }}
            <span class="des-underline">{{ privacyText2 }}</span>.
          </div>
        </div>
      </div>

      <transition name="popup-fade">
        <div v-if="activePopup" class="payment-popup-root">
          <div class="payment-popup-backdrop" @click="closePaymentPopup"></div>
          <div class="payment-popup-card">
            <button class="payment-popup-close" @click="closePaymentPopup" aria-label="Close payment window">
              ×
            </button>

            <div v-if="activePopup === 'stripe'">
              <div v-if="paymentError" class="panel-error popup-error">
                {{ paymentError }}
              </div>

              <div class="payment-popup-body">
                <div v-if="isCreatingStripeCheckout" class="panel-message">
                  {{ pageText.processing }}
                </div>
                <div id="payment-popup-checkout"></div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped lang="less">
.drawer-root {
  position: relative;
  width: 100%;
  z-index: 1;
}

.drawer-card {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 16px 16px 18px;
  border-radius: 12px;
  border: 1px solid #e9edf2;
  background: #f8f8f8;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.drawer-close,
.payment-popup-close {
  width: 42px;
  height: 42px;
  color: #30343b;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
}

.drawer-close {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 1001;
  border: 1px solid #eeeeee;
  border-radius: 999px;
  color: #323233;
  background: #ffffff;
}

.drawer-content {
  display: flex;
  flex-direction: column;
}

.product-block {
  padding: 24px 0 18px;
  text-align: center;
}

.product-title {
  font-family: Poppins;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.16;
  color: #3f3f46;
  text-transform: uppercase;
}

.product-price {
  font-family: Poppins;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #b1b1b6;
}

.action-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-entry {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  padding: 16px 20px;
  border-radius: 8px;
  border: 0;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.paypal-entry,
.wallet-entry {
  background: #5b7fdb;
}

.payment-entry:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.paypal-entry {
  height: 55px;
  border-radius: 8px;
  background: #f7c04b;
  overflow: hidden;
  position: relative;
}

.paypal-entry--loading {
  pointer-events: none;
}

.inline-message {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 55px;
  margin: 0;
  color: #7d5b0f;
  font-size: 14px;
  font-weight: 600;
  background: #f7c04b;
}

.paypal-inline-container {
  width: 100%;
  min-height: 55px;
}

:deep(.paypal-inline-container iframe) {
  width: 100% !important;
  min-height: 55px !important;
}

.wallet-brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #ffffff;
  font-family: Poppins, sans-serif;
  font-size: 18px;
  font-weight: 700;
}

.apple-brand {
  letter-spacing: -0.01em;
}

.card-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
  padding: 0 0 14px;
  color: #a4a4aa;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
}

.card-toggle-icon {
  font-size: 16px;
  line-height: 1;
}

.card-form-shell {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #e8ebf0;
  background: #ffffff;
  cursor: pointer;
}

.card-form-title,
.card-form-row-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #30343b;
  font-family: Poppins, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
}

.card-form-row-title {
  margin-top: 14px;
  padding-right: 10px;
}

.card-form-field {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  margin-top: 10px;
  padding: 0 12px;
  border-radius: 10px;
  background: #f6f7fa;
}

.card-form-field--half {
  flex: 1;
  justify-content: space-between;
}

.card-form-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.card-form-icon {
  color: #b9bec6;
  font-size: 18px;
  line-height: 1;
}

.card-form-placeholder {
  color: #c8ccd3;
  font-family: Poppins, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
}

.card-form-info {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #cfd4db;
  border-radius: 999px;
  color: #c3c8cf;
  font-size: 11px;
  font-weight: 700;
}

.card-pay-button {
  width: 100%;
  height: 50px;
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-radius: 8px;
  background: #ff4a4a;
  color: #ffffff;
  font-family: Poppins, sans-serif;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
}

.card-pay-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.card-pay-lock {
  font-size: 16px;
  line-height: 1;
}

.panel-error {
  margin-top: 18px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #fff0f0;
  color: #b42318;
  font-size: 14px;
  line-height: 1.6;
}

.payment-popup-root {
  position: fixed;
  inset: 0;
  z-index: 1002;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 76px 18px 20px;
  box-sizing: border-box;
}

.payment-popup-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(4px);
}

.payment-popup-card {
  position: relative;
  width: min(100%, 560px);
  max-height: 100%;
  overflow-y: auto;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.26);
}

.payment-popup-close {
  position: absolute;
  top: 20px;
  right: 20px;
  border: none;
  background-color: white;
}

.payment-popup-label {
  padding-right: 52px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.payment-popup-plan {
  margin-top: 12px;
  font-family: Laien, sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.12;
  color: #0f172a;
}

.payment-popup-price {
  margin-top: 8px;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.payment-popup-note,
.placeholder-text,
.panel-message {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: #6b7280;
}

.payment-popup-body {
  margin-top: 0px;
  padding: 18px;
  border-radius: 22px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.popup-summary {
  margin-top: 18px;
  padding: 16px 18px;
  border-radius: 20px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.popup-summary-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.popup-summary-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-top: 12px;
}

.popup-summary-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.popup-summary-value {
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}

.popup-error {
  margin-top: 16px;
}

.paypal-buttons {
  margin-top: 16px;
}

.drawer-fade-enter-active,
.drawer-fade-leave-active,
.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.22s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to,
.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}

.pay-description{
  font-family: Poppins;
  margin-top: 18px;
  color: #969696;
  font-size: 14px;
  line-height: 1.6;
  text-align: left;
}

.des-underline{
  text-decoration: underline;
}

@media (max-width: 767px) {
  .drawer-card {
    padding: 16px 14px 18px;
  }

  .drawer-close {
    width: 38px;
    height: 38px;
    top: 12px;
    right: 12px;
  }

  .card-form-row-title {
    font-size: 13px;
  }

  .card-form-row {
    flex-direction: column;
  }

  .product-title {
    font-size: 22px;
  }

  .payment-entry {
    min-height: 56px;
    padding: 14px 18px;
  }

  .payment-popup-root {
    padding: 68px 12px 14px;
  }

  .payment-popup-card {
    width: 100%;
    border-radius: 24px;
  }
}
</style>
