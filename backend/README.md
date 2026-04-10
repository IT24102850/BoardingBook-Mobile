# BoardingBook Backend

Production-ready Express + MongoDB backend for BoardingBook authentication.

## Features

- Secure Express defaults with `helmet`, `compression`, CORS allowlist, and rate limiting.
- MongoDB connection bootstrap with graceful shutdown.
- Auth APIs: signup, verify email, resend verification, signin, and `GET /api/auth/me`.
- Request validation using `express-validator`.
- Password hashing via `bcryptjs` and JWT authentication.

## API Endpoints

- `POST /api/auth/signup`
- `GET /api/auth/verify-email?token=...`
- `POST /api/auth/resend-verification`
- `POST /api/auth/signin`
- `GET /api/auth/me` (Bearer token required)
- `GET /api/health`

## Environment Setup

Copy `.env.example` to `.env` and fill values:

- `PORT`
- `NODE_ENV`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CORS_ORIGIN`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `FRONTEND_URL`

## Local Run

```bash
cd backend
npm install
npm run dev
```

## Production Notes

- Use MongoDB Atlas with IP access restrictions and least-privilege DB user.
- Set a strong `JWT_SECRET` (32+ random chars).
- Set `NODE_ENV=production`.
- Restrict `CORS_ORIGIN` to your deployed frontend domain(s).
- Configure SMTP with a provider account dedicated to transactional email.
