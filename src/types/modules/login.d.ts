import type { User } from "./system/user";

// 登录提交的数据
export interface LoginParams {
  captcha?: string;
  captchaId?: string;
  password?: string;
  userName?: string;
  phone?: string;
  email?: string;
  verifyCode?: string;
  type?: string;
}

// 登录返回数据
export interface LoginResult {
  user: User;
  token: string;
  expiresAt: number;
}

// 验证码
export interface CaptchaResult {
  captchaId?: string;
  picPath?: string;
  captchaLength?: number;
}

// 注册邮箱
export interface EmailParams {
  email?: string;
}
