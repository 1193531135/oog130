<script setup>
import { computed, onMounted, ref } from "vue";
import {
  getPaypalSubscriptionInfo,
  getSubscriptionInfo,
} from "@/api/system/index.js";
import { useRoute, useRouter } from "vue-router";
import {
  clearPaymentFlowState,
  completePaymentFlow,
  getPaymentFlowState,
  updatePaymentFlowState,
} from "@/tool/payment.js";

const route = useRoute();
const router = useRouter();
const pageText = window.languageData[route.name];
const activeSession = ref(null);
const paymentInfo = ref(null);
const isLoadingVerification = ref(false);
const verificationError = ref("");

const result = computed(() => {
  if (route.query.paymentSuccess === "true") {
    return "success";
  }

  if (route.query.paymentCancelled === "true") {
    return "cancelled";
  }

  return "idle";
});

if (result.value === "success" || result.value === "cancelled") {
  activeSession.value = completePaymentFlow(result.value) || getPaymentFlowState();
} else {
  activeSession.value = getPaymentFlowState();
}

const resultConfig = computed(() => {
  if (result.value === "success") {
    return {
      badge: pageText.success.badge,
      title: pageText.success.title,
      description: pageText.success.description,
    };
  }

  if (result.value === "cancelled") {
    return {
      badge: pageText.cancelled.badge,
      title: pageText.cancelled.title,
      description: pageText.cancelled.description,
    };
  }

  return {
    badge: pageText.idle.badge,
    title: pageText.idle.title,
    description: pageText.idle.description,
  };
});

const detailRows = computed(() => {
  if (!activeSession.value) {
    return [];
  }

  return [
    {
      label: pageText.details.sessionIdLabel,
      value: activeSession.value.sessionId,
    },
    {
      label: pageText.details.statusLabel,
      value: activeSession.value.status,
    },
    {
      label: pageText.details.providerLabel,
      value: activeSession.value.provider,
    },
    {
      label: pageText.details.priceLabel,
      value: activeSession.value.priceDisplay,
    },
    {
      label: pageText.details.productLabel,
      value: activeSession.value.productName || pageText.details.notAvailable,
    },
  ];
});

const receiptRows = computed(() => {
  if (!paymentInfo.value) {
    return [];
  }

  return [
    {
      label: pageText.receipt.amountLabel,
      value: `${paymentInfo.value.currency?.toUpperCase() || ""} ${(
        (paymentInfo.value.amountPaid || 0) / 100
      ).toFixed(2)}`,
    },
    {
      label: pageText.receipt.statusLabel,
      value: paymentInfo.value.paymentStatus || pageText.details.notAvailable,
    },
    {
      label: pageText.receipt.customerLabel,
      value: paymentInfo.value.customerEmail || activeSession.value?.customerEmail || pageText.details.notAvailable,
    },
  ];
});

async function verifyPayment() {
  if (
    result.value !== "success" ||
    !activeSession.value?.uid
  ) {
    return;
  }

  isLoadingVerification.value = true;
  verificationError.value = "";

  try {
    let response;
    if (activeSession.value?.provider === "paypal") {
      if (!activeSession.value?.subscriptionId) {
        throw new Error("Missing PayPal subscriptionId");
      }
      response = await getPaypalSubscriptionInfo(
        activeSession.value.uid,
        activeSession.value.subscriptionId,
      );
    } else {
      if (!activeSession.value?.sessionId) {
        throw new Error("Missing Stripe sessionId");
      }
      response = await getSubscriptionInfo(
        activeSession.value.uid,
        activeSession.value.sessionId,
      );
    }
    const { data } = response;
    paymentInfo.value = data || null;
    if (data) {
      activeSession.value = updatePaymentFlowState({
        status: "paid",
        result: "success",
      });
    }
  } catch (error) {
    console.error("Failed to verify payment:", error);
    verificationError.value = pageText.verificationError;
  } finally {
    isLoadingVerification.value = false;
  }
}

async function backToPaywall() {
  clearPaymentFlowState();
  await router.replace("/paywall");
}

onMounted(() => {
  verifyPayment();
});
</script>

<template>
  <div class="payment-result-page">
    <div class="badge">{{ resultConfig.badge }}</div>
    <div class="title">{{ resultConfig.title }}</div>
    <div class="description">{{ resultConfig.description }}</div>

    <div class="panel">
      <div class="panel-title">{{ pageText.details.title }}</div>
      <div v-if="detailRows.length">
        <div class="row" v-for="item in detailRows" :key="item.label">
          <span class="row-label">{{ item.label }}</span>
          <span class="row-value">{{ item.value }}</span>
        </div>
      </div>
      <div v-else class="empty-state">{{ pageText.details.empty }}</div>
    </div>

    <div class="panel" v-if="receiptRows.length || isLoadingVerification || verificationError">
      <div class="panel-title">{{ pageText.receipt.title }}</div>
      <div v-if="receiptRows.length">
        <div class="row" v-for="item in receiptRows" :key="item.label">
          <span class="row-label">{{ item.label }}</span>
          <span class="row-value">{{ item.value }}</span>
        </div>
      </div>
      <div v-else-if="isLoadingVerification" class="empty-state">
        {{ pageText.verifying }}
      </div>
      <div v-if="verificationError" class="verification-error">
        {{ verificationError }}
      </div>
    </div>

    <div class="note">{{ pageText.note }}</div>

    <div class="btn-container">
      <div class="continue-btn" @click="backToPaywall">
        <div class="spacer"></div>
        <div>{{ pageText.cta }}</div>
        <img src="@/assets/continue-icon.webp" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.payment-result-page {
  width: min(100%, 720px);
  padding: 0 20px 120px;
  box-sizing: border-box;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: #e8f8ef;
  color: #0f8a47;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.title {
  margin-top: 20px;
  font-family: Laien, sans-serif;
  font-size: 38px;
  font-weight: 700;
  line-height: 1.1;
  color: #242424;
}

.description {
  margin-top: 14px;
  font-size: 16px;
  line-height: 1.7;
  color: #666666;
}

.panel {
  margin-top: 28px;
  padding: 20px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid #e7ebf0;
  box-shadow: 0 14px 36px rgba(36, 36, 36, 0.06);
}

.panel-title {
  margin-bottom: 14px;
  font-size: 18px;
  font-weight: 700;
  color: #242424;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid #eef2f6;
}

.row:first-of-type {
  border-top: 0;
  padding-top: 0;
}

.row-label {
  font-size: 14px;
  font-weight: 600;
  color: #7d8793;
}

.row-value {
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #242424;
}

.empty-state {
  color: #8e98a3;
  font-size: 14px;
  line-height: 1.6;
}

.note {
  margin-top: 24px;
  padding: 16px 18px;
  border-radius: 14px;
  background: #fff6e5;
  color: #855b00;
  font-size: 14px;
  line-height: 1.6;
}

.verification-error {
  margin-top: 16px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #fff0f0;
  color: #b42318;
  font-size: 14px;
  line-height: 1.6;
}

@media (max-width: 767px) {
  .payment-result-page {
    padding: 0 16px 120px;
  }

  .title {
    font-size: 30px;
  }

  .description,
  .note,
  .verification-error {
    font-size: 14px;
  }

  .panel {
    padding: 18px;
    border-radius: 18px;
  }

  .row {
    flex-direction: column;
    gap: 6px;
  }

  .row-value {
    text-align: left;
  }
}
</style>
