# REGEN Spin & Win — frontend integration contract

Route: `/spin-regen`.

## Integration status

The backend does not exist yet (confirmed by the project owner). The frontend now uses `https://api.drinkregen.com/api/v1/spin`. The endpoints below are a proposed contract, not verified deployed endpoints. Until implemented, the page intentionally shows service unavailable and disables spin/redemption. No production import of `spin.mock.ts` exists. That module is an in-memory test fixture only; it does not establish backend security or durable storage.

## Campaign rules

- A new guest has one free spin. That first spin must award `VOUCHER_10`, `VOUCHER_50`, `POINTS_5`, or `POINTS_10`, never `TRY_AGAIN`.
- After the result, invite the user to submit a name and WhatsApp number and verify ownership. First successful registration grants five additional spins once.
- Authenticated spins can return any of the five outcomes, including `TRY_AGAIN`. The backend configures probabilities and draws the result; equal wheel sectors do not promise equal odds.
- +5/+10 credits the server ledger once. Guest points/vouchers transfer to the verified account exactly once.
- `CARTON` costs 100 points; `THREE_BOTTLES` costs 25 points. These follow the final explicit prize list. Products are redeemed, never direct wheel outcomes.
- Successful redemption deducts the applicable cost and preserves the remainder. Insufficient balance, stock failure, or failed transaction cannot debit points.
- Registered accounts have five spins per Asia/Jakarta calendar day, resetting at 00:00 WIB without carry-over. Points and claims do not reset. The client requests fresh status at the reset time or when returning to the page; it never computes authoritative quota.
- Returning users verify the same normalized phone number to recover the same account, balance and daily quota. Signing in again cannot grant another registration bonus.

## Proposed HTTP contract

All responses are JSON with `Cache-Control: no-store`. All status objects have:

```ts
{
  registered: boolean;
  user: { id: string; name: string } | null;
  remainingSpins: number; // integer 0..5; unregistered max 1
  totalValidSpins: number;
  points: number; // nonnegative integer
  dailyResetAt: string; // ISO timestamp with timezone
  csrfToken: string;
}
```

- `GET /status`: returns status. Establish/resume an anonymous or authenticated server session via cookie. Returning `registered: true` requires `user`.
- `POST /register`, body `{name, whatsapp}`: validate and normalize the phone, issue an OTP challenge to WhatsApp, return `{challengeId}`. This step must not authenticate, expose an existing account balance, award spins or transfer points.
- `POST /verify`, body `{challengeId, code}`: validate a six-digit single-use OTP, atomically create/resume the account, transfer guest awards once, award the one-time registration bonus only for new accounts, rotate session, return authenticated status. Requires `Idempotency-Key`.
- `POST /`, body `{}`: validate session and quota, draw on server, atomically debit one spin and credit points/allocate voucher, then return status plus `{id, rewardType, voucher?}`. Voucher outcomes must include `{code, expiresAt}` with a real allocated Shopee voucher. Requires `Idempotency-Key`.
- `POST /redeem`, body `{rewardId: 'CARTON' | 'THREE_BOTTLES'}`: validate authenticated account, server-side price, balance and stock, debit/reserve atomically, persist claim and return status plus `{redemption: {id, rewardId, status: 'confirmed'}}`. Requires `Idempotency-Key`. The UI confirms the selection before submitting, displays the returned balance and claim ID, and never subtracts locally.

All POSTs include `X-CSRF-Token` obtained from status. Responses that include status also return the current token. Fetch uses `credentials: include`, a 15-second timeout, runtime schema validation, and no cache. No balance, cost, selected outcome, user ID or phone number is accepted in spin/redemption requests; identity comes from the server session.

Errors: 400 invalid input, 401 expired session, 403 CSRF/auth failure, 409 operation pending or conflict, 422 insufficient quota/points/stock or invalid OTP, 429 throttled, 5xx server failure. No raw server error body is rendered. Timeouts, malformed responses, 409 and 5xx remain uncertain: UI retries the same idempotency key and does not show success or modify balance. Idempotency keys currently survive retries within the mounted page; backend status/claim history is required for reconciliation after navigation or reload.

## Required server implementation

1. Database-backed accounts keyed by unique canonical phone number (e.g. +628...), sessions, anonymous awards, daily quotas, immutable point ledger, vouchers, redemption records and idempotency records. Name is display data, never authentication.
2. OTP ownership verification on signup and return; hashed/expiring codes, bounded attempts, resend cooldown, phone/IP rate limits. Keep PII and codes out of logs.
3. Secure HttpOnly host-only cookies on the API origin, appropriate SameSite policy, explicit credentialed CORS allowlist for the actual frontend origin, validated Origin and session-bound CSRF token. Never wildcard credentialed CORS.
4. Atomic database transactions/locking for quota, ledger entries, voucher/stock allocation and redemptions. Use unique operation IDs so concurrent requests/tabs, retries, and lost responses cannot double-spend or award twice. Persist idempotent results scoped to session/account + endpoint + body; reject key reuse with changed payload. OTP verification retries must also resolve after session rotation.
5. Reset daily quota on the server at Jakarta midnight (lazy date-bucket update inside transactions is sufficient). Login and guest-to-account transfer cannot reset today's consumed quota. Transfer awards once and prevent repeat guest sessions from farming signup/free-spin credit on an existing account.
6. Anonymous cookies alone cannot guarantee one free spin per person after cookie deletion. Add server abuse controls and decide an explicit guest eligibility policy before campaign launch; the frontend cannot enforce human uniqueness.
7. Configure actual prize probabilities, voucher inventory/expiry and fulfillment workflow. Add authenticated claim/history reconciliation so reloads can show prior successful awards and redemptions. No external fulfillment or campaign deployment is performed by this frontend change.

## Verification

- `node node_modules/typescript/bin/tsc --project tsconfig.spin.json --noEmit`
- `node --import tsx --test src/services/spin.mock.test.ts src/services/spin.service.test.ts`
- `npm run build`

Fixture tests cover first-spin constraints, same-account points, verification, one-time bonus, redemption costs/remainders, duplicate requests, overspending and Jakarta midnight. API tests cover payloads, credentials, CSRF, response validation and fail-closed errors. Backend transactional/concurrency security still needs integration tests against the implemented API.
