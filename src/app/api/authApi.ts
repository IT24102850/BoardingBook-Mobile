const API_BASE_URL = (((import.meta as any).env?.VITE_API_URL as string) || '').replace(/\/$/, '');


interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  needsVerification?: boolean;
}

interface SignInPayload {
  email: string;
  password: string;
}

interface SignUpPayload {
  email: string;
  password: string;
  role: 'student' | 'owner';
  fullName?: string;
  phoneNumber?: string;
  companyName?: string;
  propertyCount?: number;
}


interface SignUpResult {
  userId: string;
  email: string;
  role: 'student' | 'owner' | 'admin';
  isVerified: boolean;
  verificationUrl: string;
  verificationToken?: string;
}


interface SignInResult {
  token: string;
  user: {
    id: string;
    email: string;
    role: 'student' | 'owner' | 'admin';
    fullName?: string;

    phoneNumber?: string;
    companyName?: string;
    propertyCount?: number;
    profileCompleted?: boolean;

    isVerified: boolean;
  };
}

export class AuthApiError extends Error {
  status: number;
  needsVerification: boolean;

  constructor(message: string, status = 500, needsVerification = false) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
    this.needsVerification = needsVerification;
  }
}

async function parseJson<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    return (await response.json()) as ApiResponse<T>;
  } catch {
    return { success: false, message: 'Invalid server response' };
  }
}


async function signIn(payload: SignInPayload): Promise<SignInResult> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  const result = await parseJson<SignInResult>(response);

  if (!response.ok || !result.success || !result.data) {
    throw new AuthApiError(
      result.message || 'Sign in failed',
      response.status,
      Boolean(result.needsVerification)
    );
  }

  return result.data;
}

async function signUp(payload: SignUpPayload): Promise<SignUpResult | undefined> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  const result = await parseJson<SignUpResult>(response);

  if (!response.ok || !result.success || !result.data) {
    throw new AuthApiError(
      result.message || 'Sign up failed',
      response.status,
      Boolean(result.needsVerification)
    );
  }

  return result.data;
}

export const authApi = {
  signIn,
  signUp,
};
