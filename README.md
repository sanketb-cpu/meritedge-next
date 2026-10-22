# MeritEdge · JD-first PLG prototype (Next.js)

A clickable, animated prototype of the MeritEdge onboarding flow:
Welcome → Savings → Paste JD → 5-second build countdown → Try a question → Score →
Invite a candidate → Sign up + email code (OTP) → Dashboard → Day-12 trial reminder → Checkout → Welcome to Pro.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

Build for production: `npm run build && npm start`. Deploys as-is to Vercel.

## Where to change things

| What | File |
|---|---|
| **All text, numbers, steps, options, prices** | `data/flow.json` |
| Screen order | the `next` field on each screen in `data/flow.json` |
| Colours, spacing, animations | `app/globals.css` |
| Logo and background fingerprint | `public/otomeyt-ai-logo.svg`, `public/fingerprint.svg` |
| Screen layouts | `components/screens/*.jsx` |
| Sign-up, validation and OTP | `components/ui/SignupModal.jsx` |
| Navigation, loading states, session | `components/Prototype.jsx` |

### Useful JSON settings
- `screens.savings.minutesPerScreen` / `automationShare`: the hours-saved formula
- `screens.countdown.seconds`: length of the build countdown
- `signup.blockedDomains`: personal email domains that are rejected
- `signup.otpLength`, `signup.resendSeconds`: OTP rules

## Notes
- Demo only: no email is sent, no account is created and no payment is taken.
  The OTP code is generated in the browser and shown on screen.
- The signed-in user is stored in the browser's localStorage until **Log out**.
- `[Price]` on the checkout screen is a placeholder.
