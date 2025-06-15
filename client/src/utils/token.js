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

