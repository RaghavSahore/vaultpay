# VaultPay

> ⚠️ **Deliberately vulnerable practice app. Do NOT run against production systems. For security research & learning only.**

A React Native + Express app with intentionally planted security bugs. Built as a lab target for my own React Native security research.

## What's planted here

Five security bugs across the mobile app and the Express backend:

1. **Hardcoded secrets in the JS bundle** — API keys shipped in source
2. **Plaintext PII in AsyncStorage** — sensitive data stored unencrypted
3. **OTP leaked to logcat** — `console.log` of the generated OTP (see my LinkedIn post for a live demo)
4. **IDOR in the Express backend** — object references not scoped to the authenticated user
5. **WebView `eval` bridge** — unsafe JS-to-native bridge in a WebView

## Why this exists

I'm a React Native developer learning mobile application security in public. VaultPay is my own practice target — a place I can plant real-world vulnerabilities, exploit them end-to-end with standard tooling (`adb`, Frida, Burp, objection), and document findings in audit-report format.

If you're a React Native dev and any of this looks surprising, that's the point.

## Running it

```bash
# Mobile app
npm install
npx expo start

# Backend
cd server
npm install
npm
