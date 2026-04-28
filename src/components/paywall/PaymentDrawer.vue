<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { loadStripe } from "@stripe/stripe-js";
import { loadScript } from "@paypal/paypal-js";
import { createAnonymousAccount } from "@/config/firebase.js";
import {
  createCheckoutPaypalSession,
  createCheckoutSessionEmbedded,
  synchPaypalSubscription,
} from "@/api/system/index.js";
import webConfig from "@/config/index.js";
import {
  clearPaymentFlowState,
  getPaymentFlowState,
  setPaymentGateway,
  startPaymentFlow,
  updatePaymentFlowState,
} from "@/tool/payment.js";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  discount: {
    type: Boolean,
    default: false,
  },
  productInfo: {
    type: Object,
    default: null,
  },
  eventTracker: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const route = useRoute();
const router = useRouter();
const pageText = window.languageData[route.name];

const paymentError = ref("");
const isPreparingPaypal = ref(false);
const isCreatingStripeCheckout = ref(false);
const activePopup = ref("");
const checkout = ref(null);
const checkoutMounted = ref(false);
const paypalSubscriptionId = ref("");
const activeSession = ref(getPaymentFlowState());

let stripeInstancePromise = null;
let paypalInstancePromise = null;

const productTitle = computed(() => props.productInfo?.name || "");
const stripeText = computed(() => pageText?.stripeText || "");
const productPrice = computed(() => formatDisplayPrice(props.productInfo));
const privacyText1 = computed(() => pageText?.privacyText1 || "");
const privacyText2 = computed(() => pageText?.privacyText2 || "");
const stripeSuccessTracked = ref(false);

function buildHashUrl(path) {
  return `${window.location.origin}${window.location.pathname}#${path}`;
}

// 统一构建后端创建支付会话所需参数：
// 金额由后端按 product + discountEnum 决定，前端只传商品标识和跳转地址。
function getCheckoutParams({ withCancelUrl = false } = {}) {
  const params = {
    discountEnum: props.discount ? "DISCOUNT" : "NORMAL",
    product: props.productInfo.id,
    return_url: buildHashUrl("/register"),
    visitor: 0,
  };

  if (withCancelUrl) {
    params.cancel_url = buildHashUrl("/superwall");
  }

  return params;
}

async function ensureUid() {
  const existingUid = window.sessionStorage.getItem("uid");
  if (existingUid) {
    return existingUid;
  }

  try {
    return await createAnonymousAccount();
  } catch (error) {
    console.error("Falling back to session uid:", error);
    const fallbackUid = `web_guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    window.sessionStorage.setItem("uid", fallbackUid);
    return fallbackUid;
  }
}

// 仅用于前端展示价格，不参与后端真实扣款金额计算。
function formatDisplayPrice(product) {
  if (!product || !product.priceCurrency) {
    return pageText.summary.pricePending;
  }

  const amount = props.discount ? product.priceDiscountUnitAmount : product.priceUnitAmount;
  if (!amount) {
    return pageText.summary.pricePending;
  }

  return `${(amount / 100).toFixed(2)} ${product.priceCurrency.toUpperCase()}`;
}

// 统一清理支付相关资源，避免 SDK 容器残留导致的重复挂载问题。
function resetPaymentArtifacts({ clearState = false, clearPaypal = true } = {}) {
  unmountCheckout();
  destroyCheckout();
  if (clearPaypal) {
    clearPaypalButtons();
  }
  paymentError.value = "";

  if (clearState) {
    clearPaymentFlowState();
    activeSession.value = null;
  }
}

async function createStripeCheckout() {
  if (!props.productInfo || isCreatingStripeCheckout.value || activePopup.value !== "stripe") {
    return;
  }

  paymentError.value = "";
  isCreatingStripeCheckout.value = true;

  try {
    const uid = await ensureUid();
    clearPaymentFlowState();

    // 写入支付流程上下文，供后续支付状态回读与校验。
    activeSession.value = await startPaymentFlow({
      uid,
      productId: props.productInfo.id,
      routePath: route.path,
    });

    // 先向后端创建 Stripe 会话，再用 clientSecret 挂载 embedded checkout。
    const { data } = await createCheckoutSessionEmbedded(uid, getCheckoutParams());
    if (!data?.clientSecret || !data?.sessionId) {
      throw new Error("Missing clientSecret or sessionId in API response");
    }

    activeSession.value = updatePaymentFlowState({
      paymentGateway: "stripe",
      sessionId: data.sessionId,
      status: "checkout_ready",
    });

    stripeInstancePromise ||= loadStripe(webConfig.stripeConfig.stripeKey);
    const stripe = await stripeInstancePromise;
    if (!stripe) {
      throw new Error("Stripe initialization failed");
    }

    checkout.value = await stripe.createEmbeddedCheckoutPage({
      clientSecret: data.clientSecret,
    });

    if (activePopup.value === "stripe") {
      await mountCheckout();
    }
  } catch (error) {
    console.error("createStripeCheckout failed:", error);
    paymentError.value = pageText?.errors?.createCheckout || "Failed to create Stripe checkout";
    destroyCheckout();
    activeSession.value = updatePaymentFlowState({
      paymentGateway: "stripe",
      status: "failed",
      result: "failed",
    });
  } finally {
    isCreatingStripeCheckout.value = false;
  }
}

async function createPaypalCheckout() {
  if (!props.productInfo || isPreparingPaypal.value) {
    return;
  }

  paymentError.value = "";
  isPreparingPaypal.value = true;

  try {
    const uid = await ensureUid();
    clearPaymentFlowState();

    activeSession.value = await startPaymentFlow({
      uid,
      productId: props.productInfo.id,
      routePath: route.path,
    });

    // 后端返回 token/subscriptionId 后，前端再渲染 PayPal Buttons。
    const { data } = await createCheckoutPaypalSession(uid, getCheckoutParams({ withCancelUrl: true }));
    if (!data?.token || !data?.subscriptionId) {
      throw new Error("Missing PayPal token or subscriptionId");
    }

    paypalSubscriptionId.value = data.subscriptionId;
    activeSession.value = updatePaymentFlowState({
      paymentGateway: "paypal",
      subscriptionId: data.subscriptionId,
      status: "paypal_ready",
    });

    await initPayPalPayment(data.token, uid);
  } catch (error) {
    console.error("createPaypalCheckout failed:", error);
    paymentError.value = pageText?.errors?.createPaypal || "Failed to create PayPal checkout";
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
    return;
  }

  paypalContainer.innerHTML = "";
  await paypal
    .Buttons({
      style: {
        shape: "rect",
        color: "gold",
        layout: "horizontal",
        label: "buynow",
        height: 55,
      },
      onClick: () => {
        props.eventTracker?.clickPay?.();
      },
      createBillingAgreement: () => baToken,
      onApprove: async () => {
        try {
          // PayPal 扣款确认后，先同步后端订阅状态，再写本地网关标识与埋点。
          await synchPaypalSubscription(uid, paypalSubscriptionId.value);
          activeSession.value = updatePaymentFlowState({
            paymentGateway: "paypal",
            subscriptionId: paypalSubscriptionId.value,
            status: "paid",
            result: "success",
          });
          setPaymentGateway("paypal");
          props.eventTracker?.paySuccess?.();
          await router.replace("/register");
        } catch (error) {
          console.error("synchPaypalSubscription failed:", error);
          paymentError.value = pageText?.errors?.createPaypal || "Failed to create PayPal checkout";
        }
      },
      onError: (error) => {
        console.error("PayPal payment error:", error);
        paymentError.value = pageText?.errors?.createPaypal || "Failed to create PayPal checkout";
      },
      onCancel: () => {
        activeSession.value = updatePaymentFlowState({
          paymentGateway: "paypal",
          subscriptionId: paypalSubscriptionId.value,
          status: "cancelled",
          result: "cancelled",
        });
      },
    })
    .render("#payment-inline-paypal");
}

async function openPaymentPopup(method) {
  if (method !== "stripe" || !props.productInfo || isCreatingStripeCheckout.value) {
    return;
  }

  // 点击 Stripe 入口即视为发起支付行为，先打 clickPay 埋点。
  props.eventTracker?.clickPay?.();
  resetPaymentArtifacts({ clearState: true, clearPaypal: false });
  activePopup.value = method;

  await nextTick();
  await createStripeCheckout();
}

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
  resetPaymentArtifacts({ clearState: true, clearPaypal: false });
  activePopup.value = "";
}

function closeDrawer() {
  activePopup.value = "";
  resetPaymentArtifacts({ clearState: true });
  emit("update:modelValue", false);
}

onMounted(() => {
  paymentError.value = "";
  nextTick(() => {
    createPaypalCheckout();
  });
});

watch(
  () => route.path,
  (newPath) => {
    const isStripeSession =
      activeSession.value?.paymentGateway === "stripe" && !!activeSession.value?.sessionId;
    if (newPath !== "/register" || !isStripeSession || stripeSuccessTracked.value) {
      return;
    }

    // Stripe 完成后会回跳到 /register，这里用路由变化判定成功并打成功埋点。
    stripeSuccessTracked.value = true;
    setPaymentGateway("stripe");
    props.eventTracker?.paySuccess?.();
  },
);

onUnmounted(() => {
  const isStripeSuccessRoute =
    route.path === "/register" &&
    activeSession.value?.paymentGateway === "stripe" &&
    !!activeSession.value?.sessionId;
  if (!stripeSuccessTracked.value && isStripeSuccessRoute) {
    stripeSuccessTracked.value = true;
    setPaymentGateway("stripe");
    props.eventTracker?.paySuccess?.();
  }
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
                {{ pageText?.paymentModal?.paypalLoading || "Loading PayPal..." }}
              </div>
              <div id="payment-inline-paypal" class="paypal-inline-container"></div>
            </div>

            <button
              class="payment-entry wallet-entry"
              :disabled="!productInfo || isCreatingStripeCheckout"
              @click="openPaymentPopup('stripe')"
            >
              <span class="wallet-brand apple-brand">{{ stripeText }}</span>
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
  color: #ffffff;
  font-family: Poppins, sans-serif;
  font-size: 18px;
  font-weight: 700;
}

.apple-brand {
  letter-spacing: -0.01em;
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

.payment-popup-body {
  margin-top: 0;
  padding: 18px;
  border-radius: 22px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.panel-message {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: #6b7280;
}

.popup-error {
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

.pay-description {
  font-family: Poppins;
  margin-top: 18px;
  color: #969696;
  font-size: 14px;
  line-height: 1.6;
  text-align: left;
}

.des-underline {
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
