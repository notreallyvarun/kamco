import {jwtDecode} from "jwt-decode";

export function getTokenExpiry(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000; 
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

export function isTokenExpired(token) {
  const expiry = getTokenExpiry(token);
  return !expiry || Date.now() >= expiry;
}

// utils/token.js

export function checkTokenAndRedirect() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return null;
  }
  return token;
}

