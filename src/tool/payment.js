const STORAGE_KEY = "paymentFlow";

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

export function setPaymentFlowState(value) {
  return writeStorage(value);
}

export function updatePaymentFlowState(patch) {
  const currentValue = readStorage() || {};
  return writeStorage({
    ...currentValue,
    ...patch,
  });
}

export async function startPaymentFlow({
  routePath = "/paywall",
  customerName = "",
  customerEmail = "",
  uid = "",
  productId = "",
  productName = "",
  priceDisplay = "",
} = {}) {
  const session = {
    mode: import.meta.env.MODE === "production" ? "live" : "test",
    provider: "stripe",
    status: "creating_session",
    result: "pending",
    sessionId: "",
    routePath,
    returnPath: "/paymentResult",
    cancelPath: routePath,
    uid,
    productId,
    productName,
    priceDisplay,
    customerName,
    customerEmail,
    createdAt: new Date().toISOString(),
  };
  return writeStorage(session);
}

export function completePaymentFlow(result = "success") {
  const currentSession = readStorage();

  if (!currentSession) {
    return null;
  }

  const nextSession = {
    ...currentSession,
    status: result === "success" ? "paid" : "cancelled",
    result,
    finishedAt: new Date().toISOString(),
  };

  return writeStorage(nextSession);
}
