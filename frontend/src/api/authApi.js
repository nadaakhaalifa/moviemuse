import api from "./axios";

export const registerUser = async ({ name, email, password }) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
  });

  return response.data;
};

export const verifyEmail = async ({ email, code }) => {
  const response = await api.post("/auth/verify-email", {
    email,
    code,
  });

  return response.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const resendVerificationCode = async (email) => {
  const response = await api.post("/auth/resend-code", {
    email,
  });

  return response.data;
};