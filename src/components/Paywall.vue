<script setup>
import { computed, onMounted, ref } from "vue";
import { createAnonymousAccount } from "@/utils/firebase.js";
import { getPriceList } from "@/api/system/index.js";
import webConfig from "@/config/index.js";
import { PageData } from "@/tool/index.js";
import PaymentDrawer from "@/components/paywall/PaymentDrawer.vue";

const pageData = new PageData();
const pageText = window.languageData.Paywall;
const priceInfo = ref(null);
const isLoadingPrice = ref(true);
const priceError = ref("");
const showPaymentDrawer = ref(false);

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

  const currency = product.priceCurrency.toUpperCase();
  return `${currency} ${(product.priceUnitAmount / 100).toFixed(2)}`;
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

async function loadPriceInfoFromBackend() {
  isLoadingPrice.value = true;
  priceError.value = "";

  //获取价格（价格来源？）
  try {
    const uid = await ensureUid();
    const lang = new URLSearchParams(window.location.search).get("lang") || "en";
    // 价格组ID（需补充）
    const lpId = webConfig.defaultPriceGroup || "9BKFW";
    const { data } = await getPriceList(uid, {
      uid,
      lpId,
      lang,
    });
    const products = data?.products || [];

    if (!products.length) {
      throw new Error("No products returned from getPriceList");
    }

    priceInfo.value =
      products.find((item) => item.mostPopular) ||
      products[1] ||
      products[0];
  } catch (error) {
    console.error("Failed to load price list:", error);
    priceError.value = pageText.errors.loadPrice;
  } finally {
    isLoadingPrice.value = false;
  }
}

function openPaymentDrawer() {
  if (!priceInfo.value) {
    return;
  }
  showPaymentDrawer.value = true;
}

onMounted(() => {
  loadPriceInfoFromBackend();
});
</script>

<template>
  <div class="paywall-page">
    <div class="badge">{{ pageText.badge }}</div>
    <div class="title">{{ pageText.title }}</div>
    <div class="subtitle">{{ pageText.subtitle }}</div>
    <div class="description">{{ pageText.description }}</div>

    <div class="panel">
      <div class="panel-title">{{ pageText.summary.title }}</div>
      <div class="row">
        <span class="row-label">{{ pageText.summary.planLabel }}</span>
        <span class="row-value">{{ priceInfo?.name || pageText.summary.planPending }}</span>
      </div>
      <div class="row">
        <span class="row-label">{{ pageText.summary.priceLabel }}</span>
        <span class="row-value">{{ formatDisplayPrice(priceInfo) }}</span>
      </div>
      <div v-if="isLoadingPrice" class="panel-message">{{ pageText.loadingPrice }}</div>
      <div v-if="priceError" class="panel-error">{{ priceError }}</div>
    </div>

    <div class="note">
      {{ pageText.note }}
    </div>

    <div class="btn-container">
      <div
        class="continue-btn"
        :class="{ disabled: isLoadingPrice || !priceInfo }"
        @click="openPaymentDrawer"
      >
        <div class="spacer"></div>
        <div>{{ pageText.cta }}</div>
        <img src="@/assets/continue-icon.webp" alt="" />
      </div>
    </div>

    <PaymentDrawer
      v-model="showPaymentDrawer"
      :product-info="priceInfo"
      :customer-name="pageData.UserName || ''"
      :customer-email="pageData.EnterEmail || ''"
    />
  </div>
</template>

<style scoped lang="less">
.paywall-page {
  width: min(100%, 760px);
  padding: 0 20px 140px;
  box-sizing: border-box;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: #e8f2ff;
  color: #2e73e0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.title {
  margin-top: 20px;
  font-family: Laien, sans-serif;
  font-size: 40px;
  font-weight: 700;
  line-height: 1.1;
  color: #242424;
}

.subtitle {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #2e73e0;
}

.description {
  margin-top: 12px;
  font-size: 16px;
  line-height: 1.7;
  color: #666666;
}

.panel {
  margin-top: 24px;
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

.note {
  margin-top: 24px;
  padding: 16px 18px;
  border-radius: 14px;
  background: #fff6e5;
  color: #855b00;
  font-size: 14px;
  line-height: 1.6;
}

.panel-message {
  margin-top: 16px;
  color: #7d8793;
  font-size: 14px;
}

.panel-error {
  margin-top: 16px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #fff0f0;
  color: #b42318;
  font-size: 14px;
  line-height: 1.6;
}

@media (max-width: 767px) {
  .paywall-page {
    padding: 0 16px 140px;
  }

  .title {
    font-size: 30px;
  }

  .subtitle {
    font-size: 16px;
  }

  .description,
  .note {
    font-size: 14px;
  }

  .panel-message,
  .panel-error {
    font-size: 13px;
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
