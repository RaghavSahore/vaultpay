# VaultPay — Security Findings Log

**App:** VaultPay (deliberately vulnerable RN practice app)  
**Repo:** https://github.com/RaghavSahore/vaultpay  
**Auditor:** Raghav Sahore  
**Audit Period:** Oct 1, 2026 — ongoing  
**Device Under Test:** OnePlus Nord CE 3 Lite 5G, Android 15, non-rooted  
**Build Tested:** Debug APK (eas build --profile debug)

---

## Severity Scale

| Rating | Meaning |
|---|---|
| CRITICAL | Direct user harm, auth bypass, financial loss, regulatory violation |
| HIGH | Sensitive data exposure, significant impact, requires some precondition |
| MEDIUM | Limited exposure, needs attacker proximity or specific conditions |
| LOW | Information disclosure with no direct impact, hardening gap |

---

## Finding #1 — Sensitive OTP Leaked via Android System Logs

| Field | Value |
|---|---|
| **Severity** | HIGH |
| **Status** | Open |
| **Date Demonstrated** | 2026-10-01 |
| **CWE** | CWE-532 (Insertion of Sensitive Information into Log File) |
| **MASVS Category** | MASVS-STORAGE-2, MASVS-CODE-4 |
| **MASTG Test Case** | MASTG-TEST-0003 |

### Description
The application generates an OTP for user authentication and writes it to the device log (logcat) via `console.log` before user verification. Any process with ADB access to the device can read this OTP in real-time and bypass the authentication flow entirely without needing SMS access.

### Vulnerable Code
```javascript
// file: screens/LoginScreen.js (createOTP_func)
const createOTP_func = () => {
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('DEV OTP is:', generatedOtp);   // <-- leaks to logcat
  setOtp(generatedOtp);
}
```

### Attack Scenario
1. Attacker gains USB/ADB access to victim's unlocked device (physical access, malicious cable, stolen phone, repair shop, juice-jacking station, or MDM-managed device).
2. Attacker runs `adb logcat *:S ReactNativeJS:V` on their laptop to filter for ReactNative JS logs.
3. Victim (or attacker) opens VaultPay and taps "Get OTP" with any phone number.
4. Logcat window prints the 6-digit OTP in real-time.
5. Attacker enters the OTP in the app → full authentication bypass without SMS interception.

### Proof of Concept
**Commands executed:**
```bash
adb logcat *:S ReactNativeJS:V
# App used, OTP printed to log:
# ReactNativeJS: 'DEV OTP is:' '428193'
```

**Evidence files:**
- `C:\dev\vaultpay\exploit-screenshots\otp-logcat-leak\01-logcat-otp-visible.png`
- `C:\dev\vaultpay\exploit-screenshots\otp-logcat-leak\02-app-logged-in.png`

### Impact
- Complete authentication bypass — any attacker with brief ADB access can log in as any user
- No SMS/phone interception required — reduces attacker skill barrier dramatically
- On release builds, `console.log` statements persist unless `babel-plugin-transform-remove-console` is explicitly configured
- Even in release builds, this would be exploitable on rooted devices (~5-10% of Indian Android install base)
- Regulatory: violation of PCI DSS logging requirements if production had payment data

### Remediation
**Short-term fix:**
```javascript
// Remove the console.log entirely
const createOTP_func = () => {
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  setOtp(generatedOtp);
}
```

**Long-term fix:**
1. Add `babel-plugin-transform-remove-console` to `babel.config.js` for production builds
2. OTP should never be generated client-side — move to server-side generation, SMS delivery via Firebase/MSG91/Twilio
3. Implement a logging wrapper that strips sensitive fields even in dev builds
4. Add CI check to grep for `console.log` with keywords like `otp|password|token|pin`

### References
- OWASP MASVS: https://mas.owasp.org/MASVS/06-MASVS-CODE/
- CWE-532: https://cwe.mitre.org/data/definitions/532.html
- MASTG-TEST-0003: https://mas.owasp.org/MASTG/tests/android/MASVS-STORAGE/MASTG-TEST-0003/

## Finding #2 — Sensitive data Leaked via unseure Async storage 
| Field | Value |
|---|---|
| **Severity** | HIGH |
| **Status** | Open |
| **Date Demonstrated** | 2026-10-02 |
| **CWE** | CWE-921 ( Storage of Sensitive Data in a Mechanism without Access Control) |
| **MASVS Category** | MASVS-STORAGE-1, MASVS-CODE-4 |
| **MASTG Test Case** |MASTG-TEST-0207 |
### Description
The application uses Asyncstorage to hold sensetive data like authentication tokens, PII, and financial data  in AsyncStorage, which uses an unencrypted SQLite database file."
### Vulnerable Code
```javascript
// file: screens/LoginScreen.js (set_itemInAsyncStore)
async function set_itemInAsyncStore() {
  try {
    await AsyncStorage.setItem(
      'user',
      JSON.stringify({
        authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo.token',
        phone: '+919876543210',
        cardLast4: '4242',
        balance: 42150,
      })
    );
  } catch (error) {
    console.error('Error setting item in async storage:', error);
  }
}
```
### Attack Scenario
1 atacker with rooted device can access data from asnc storage 
### Impact
- Complete session hijacking via JWT token
- PII exposure (phone number)
- Partial payment card data (last 4) — PCI implications
- Financial information (balance)
- DPDP Act violation if production app
###Remediation
- Short term: encrypt sensitive data before AsyncStorage.setItem (e.g., using expo-secure-store instead)
- Long term: move auth tokens to Keychain/Keystore via expo-secure-store or react-native-keychain; - keep only non-sensitive UI state in AsyncStorage; set android:allowBackup="false" in manifest
