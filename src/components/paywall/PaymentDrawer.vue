<script setup>
import { computed, nextTick, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { loadStripe } from "@stripe/stripe-js";
import { loadScript } from "@paypal/paypal-js";
import { createAnonymousAccount } from "@/utils/firebase.js";
import {
  createCheckoutPaypalSession,
  createCheckoutSessionEmbedded,
  synchPaypalSubscription,
} from "@/api/system/index.js";
import webConfig from "@/config/index.js";
import {
  clearPaymentFlowState,
  getPaymentFlowState,
  startPaymentFlow,
  updatePaymentFlowState,
} from "@/tool/payment.js";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  productInfo: {
    type: Object,
    default: null,
  },
  customerName: {
    type: String,
    default: "",
  },
  customerEmail: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const route = useRoute();
const pageText = window.languageData[route.name];

const paymentError = ref("");
const isPreparingPaypal = ref(false);
const isCreatingStripeCheckout = ref(false);
const activePopup = ref("");
const checkout = ref(null);
const checkoutMounted = ref(false);
const paypalButtonsRendered = ref(false);
const paypalToken = ref("");
const paypalSubscriptionId = ref("");
const activeSession = ref(getPaymentFlowState());
let stripeInstancePromise = null;
let paypalInstancePromise = null;

const isOpen = computed(() => props.modelValue);
const productTitle = computed(
  () => props.productInfo?.title || props.productInfo?.name || pageText.summary.planPending,
);
const productPrice = computed(() => formatDisplayPrice(props.productInfo));
const popupOrderRows = computed(() => [
  {
    label: pageText.summary.planLabel,
    value: productTitle.value,
  },
  {
    label: pageText.summary.priceLabel,
    value: productPrice.value,
  },
  {
    label: pageText.summary.customerLabel,
    value: props.customerName || pageText.summary.notProvided,
  },
  {
    label: pageText.summary.emailLabel,
    value: props.customerEmail || pageText.summary.notProvided,
  },
]);
const drawerText = computed(() => ({
  applePay: pageText.paymentModal?.applePay || "Stripe Pay",
  popupNote:
    pageText.paymentModal?.popupNote || "Complete this checkout in the secure payment window below.",
  popupSummaryTitle: pageText.paymentModal?.popupSummaryTitle || "Order details",
}));
const popupTitle = computed(() => {
  if (activePopup.value === "paypal") {
    return pageText.paymentModal.paypal;
  }

  if (activePopup.value === "stripe") {
    return pageText.paymentModal.stripe;
  }

  return "";
});

function getFallbackUid() {
  const cachedUid = window.sessionStorage.getItem("uid");
  if (cachedUid) {
    return cachedUid;
  }

  const fallbackUid = `web_guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  window.sessionStorage.setItem("uid", fallbackUid);
  return fallbackUid;
}

function formatDisplayPrice(product) {
  if (!product || !product.priceUnitAmount || !product.priceCurrency) {
    return pageText.summary.pricePending;
  }

  return `${(product.priceUnitAmount / 100).toFixed(2)} ${product.priceCurrency.toUpperCase()}`;
}

function getCheckoutReturnUrl() {
  return `${window.location.origin}${window.location.pathname}#/paymentResult?paymentSuccess=true`;
}

function getPaymentResultUrl(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return `${window.location.origin}${window.location.pathname}#/paymentResult${queryString ? `?${queryString}` : ""}`;
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
    return getFallbackUid();
  }
}

function getPaymentPayload() {
  return {
    discountEnum: "NORMAL",
    product: props.productInfo.id,
    return_url: getCheckoutReturnUrl(),
    visitor: 1,
  };
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

async function createStripeCheckout() {
  if (!props.productInfo || isCreatingStripeCheckout.value || !isOpen.value || activePopup.value !== "stripe") {
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
      customerName: props.customerName,
      customerEmail: props.customerEmail,
    });

    const { data } = await createCheckoutSessionEmbedded(uid, getPaymentPayload());

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

    if (!isOpen.value || activePopup.value !== "stripe") {
      return;
    }

    await mountCheckout();
  } catch (error) {
    console.error("Failed to start Stripe checkout:", error);
    paymentError.value = pageText.errors.createCheckout;
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

async function createPaypalCheckout() {
  if (!props.productInfo || isPreparingPaypal.value || !isOpen.value) {
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
      productName: productTitle.value,
      priceDisplay: productPrice.value,
      routePath: route.path,
      customerName: props.customerName,
      customerEmail: props.customerEmail,
    });

    const { data } = await createCheckoutPaypalSession(uid, {
      ...getPaymentPayload(),
      cancel_url: getPaymentResultUrl({
        paymentCancelled: "true",
        paymentMethod: "paypal",
      }),
    });

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

    const paypalButton = paypal.Buttons({
        fundingSource: paypal.FUNDING.PAYPAL,
        style: {
          shape: "rect",
          color: "gold",
          layout: "vertical",
          label: "paypal",
          height: 55,
        },
        createBillingAgreement: () => paypalToken.value,
        onApprove: async () => {
          await synchPaypalSubscription(uid, paypalSubscriptionId.value);
          updatePaymentFlowState({
            paymentMethod: "paypal",
            provider: "paypal",
            subscriptionId: paypalSubscriptionId.value,
            status: "paid",
            result: "success",
          });
          window.location.hash = "#/paymentResult?paymentSuccess=true&paymentMethod=paypal";
        },
        onError: (error) => {
          console.error("PayPal payment error:", error);
          paymentError.value = pageText.errors.createPaypal;
        },
        onCancel: () => {
          updatePaymentFlowState({
            paymentMethod: "paypal",
            provider: "paypal",
            subscriptionId: paypalSubscriptionId.value,
            status: "cancelled",
            result: "cancelled",
          });
        },
      });

    if (!paypalButton.isEligible()) {
      throw new Error("PayPal funding source is not eligible for this buyer");
    }

    await paypalButton.render("#payment-inline-paypal");

    paypalButtonsRendered.value = true;
  } catch (error) {
    console.error("Failed to start PayPal checkout:", error);
    paymentError.value = pageText.errors.createPaypal;
    clearPaypalButtons();
    activeSession.value = updatePaymentFlowState({
      paymentMethod: "paypal",
      provider: "paypal",
      status: "failed",
      result: "failed",
    });
  } finally {
    isPreparingPaypal.value = false;
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

async function mountCheckout() {
  if (!checkout.value || checkoutMounted.value || !isOpen.value || activePopup.value !== "stripe") {
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
  document.body.style.overflow = "";
  emit("update:modelValue", false);
}

watch(isOpen, (open) => {
  if (open) {
    document.body.style.overflow = "hidden";
    paymentError.value = "";
    nextTick(() => {
      createPaypalCheckout();
    });
    return;
  }

  document.body.style.overflow = "";
  activePopup.value = "";
  resetPaymentArtifacts({ clearState: true });
});

onUnmounted(() => {
  document.body.style.overflow = "";
  resetPaymentArtifacts({ clearState: true });
});
</script>

<template>
  <Teleport to="body">
    <transition name="drawer-fade">
      <div v-if="modelValue" class="drawer-root">
        <div class="drawer-backdrop" @click="closeDrawer"></div>
        <div class="drawer-panel">
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
                <div class="paypal-entry">
                  <div v-if="isPreparingPaypal" class="panel-message inline-message">
                    {{ pageText.paymentModal.paypalLoading }}
                  </div>
                  <div
                    id="payment-inline-paypal"
                    class="paypal-inline-container"
                    :class="{ 'paypal-inline-container--loading': isPreparingPaypal }"
                  ></div>
                </div>

                <button
                  class="payment-entry wallet-entry"
                  :disabled="!productInfo || isCreatingStripeCheckout"
                  @click="openPaymentPopup('stripe')"
                >
                  <span class="wallet-brand apple-brand">
                    <span>{{ drawerText.applePay }}</span>
                  </span>
                </button>
              </div>

              <div v-if="paymentError && !activePopup" class="panel-error">
                {{ paymentError }}
              </div>

              <div class="pay-description">
                We store a secure payment token to process subscription renewals and any add-ons you choose to buy. Read how we  process your data in the <span class="des-underline">Privacy Policy</span>.
              </div>
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

              <div v-if="activePopup === 'stripe'"> d
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
  </Teleport>
</template>

<style scoped lang="less">
.drawer-root {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.drawer-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.32);
  backdrop-filter: blur(6px);
}

.drawer-panel {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: top;
  justify-content: center;
  padding: 24px 20px;
  box-sizing: border-box;
  background: #f3f5f7;
}

.drawer-card {
  position: relative;
  width: min(100%, 360px);
  max-height: 100%;
  overflow-y: auto;
  // padding: 18px 18px 22px;
  // border-radius: 22px;
  // background: #ffffff;
  // border: 1px solid #edf0f4;
  // box-shadow: 0 20px 48px rgba(15, 23, 42, 0.1);
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
  top: 0px;
  right: 0px;
  z-index: 1001;
  border: 1px solid #EEEEEE;
  border-radius: 999px;
  color: #323233;
  background: #f3f5f7;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.product-block {
  padding: 24px 0 20px;
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
  min-height: 58px;
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
}

.inline-message {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 55px;
  margin: 0;
  color: #7d5b0f;
  font-size: 14px;
  font-weight: 600;
}

.paypal-inline-container {
  min-height: 55px;
}

:deep(.paypal-inline-container iframe) {
  min-height: 55px !important;
}

.paypal-inline-container--loading {
  display: none;
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

.apple-icon {
  font-size: 24px;
  line-height: 1;
}

.google-brand {
  gap: 6px;
}

.google-copy,
.google-pay-copy {
  font-size: 16px;
  font-weight: 600;
}

.google-icon {
  font-size: 32px;
  line-height: 1;
  font-weight: 700;
  background: conic-gradient(
    from 10deg,
    #4285f4 0deg 90deg,
    #34a853 90deg 180deg,
    #fbbc05 180deg 250deg,
    #ea4335 250deg 360deg
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.card-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
  padding: 6px 0 12px;
  border: 0;
  background: transparent;
  color: #a4a4aa;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.card-toggle:disabled,
.card-preview:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.card-toggle-icon {
  font-size: 16px;
  line-height: 1;
}

.card-preview {
  width: 100%;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #eaedf1;
  background: #ffffff;
  cursor: pointer;
  text-align: left;
}

.card-preview-field,
.card-preview-half {
  display: flex;
  align-items: center;
  min-height: 54px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid #edf0f4;
  background: #ffffff;
}

.card-preview-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.card-preview-half {
  flex: 1;
}

.card-preview-label {
  font-size: 15px;
  font-weight: 500;
  color: #30343b;
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
  position: absolute;
  bottom: 0;
  left: 0;
  color: #969696;
  font-size: 14px;
  line-height: 1.6;
}

.des-underline{
  text-decoration: underline;
}
@media (max-width: 767px) {
  .drawer-panel {
    padding: 16px;
  }

  .drawer-content {
    padding: 0;
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
