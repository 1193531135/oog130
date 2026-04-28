const STORAGE_KEY = "paymentFlow";
const PAYMENT_GATEWAY_KEY = "paymentGateway";

function readStorage() {
  try {
    const rawValue = window.sessionStorage.getItem(STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch (error) {
    console.error("Failed to read payment flow state:", error);
    return null;
  }
}

function writeStorage(value) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  return value;
}

export function getPaymentFlowState() {
  return readStorage();
}

export function clearPaymentFlowState() {
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function setPaymentGateway(gateway) {
  window.sessionStorage.setItem(PAYMENT_GATEWAY_KEY, gateway);
}

export function updatePaymentFlowState(patch) {
  const currentValue = readStorage() || {};
  return writeStorage({
    ...currentValue,
    ...patch,
  });
}

export function startPaymentFlow({
  routePath = "/paywall",
  uid = "",
  productId = "",
} = {}) {
  const session = {
    status: "creating_session",
    routePath,
    uid,
    productId,
    createdAt: new Date().toISOString(),
  };
  return writeStorage(session);
}
