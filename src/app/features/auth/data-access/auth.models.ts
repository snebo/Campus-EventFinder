export interface SignupFormValue { fullName: string; email: string; password: string; }
export interface LoginFormValue { email: string; password: string; }
export interface AuthError { message: string; fieldErrors?: Partial<Record<string, string>>; }
export interface AuthSession { user: { id: string; fullName: string; email: string, memberType?: string }; token: string; }
export interface ForgotPasswordFormValue { email: string; }
