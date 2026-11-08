# Private Nursing Home Services — starter project

This project contains:
- `mobile/`: Expo React Native Android app
- `admin/`: Vite + React admin dashboard
- Firebase Firestore as the shared booking database
- Booking form writes a booking record and opens WhatsApp with the booking summary

## Important
This is a development starter, not a signed Play Store APK/AAB. Firebase must be configured before cloud booking records/admin login work. WhatsApp booking requires the user to press Send in WhatsApp.

## 1. Firebase setup
1. Create a Firebase project at https://console.firebase.google.com
2. Add a Web app and copy its config.
3. Enable **Firestore Database**.
4. Enable **Authentication > Email/Password**.
5. Create an admin user under Authentication.
6. Paste the Firebase config into both:
   - `mobile/src/firebase.js`
   - `admin/src/firebase.js`
7. Set Firestore rules using `firestore.rules` (review before production).

## 2. Run mobile app
Install Node.js on a computer, then:
```bash
cd mobile
npm install
npx expo start
```
Use Expo Go on Android to scan the QR code. For a Play Store build, use EAS Build after configuring the project.

## 3. Run admin dashboard
```bash
cd admin
npm install
npm run dev
```
Open the local URL, sign in with the admin email/password you created in Firebase.

## Business details included
WhatsApp: +923025259802
Instagram: @juttchzaman
Email: zamanjutt07@gmail.com
Address: 152B, B-Block, Satellite Town, Chandni Chowk, Rawalpindi
Service area: Rawalpindi & Islamabad

Update these details in `mobile/App.js` if needed.
