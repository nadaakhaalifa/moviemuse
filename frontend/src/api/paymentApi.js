import api from "./axios";

export const createCheckoutSession = async () => {
  const response = await api.post("/payments/create-checkout-session");
  return response.data;
};

export const getMySubscription = async () => {
  const response = await api.get("/payments/my-subscription");
  return response.data;
};