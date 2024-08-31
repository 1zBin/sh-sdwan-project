interface Captcha {
  imgHeight: number;
  imgWidth: number;
  keyLong: number;
}

interface Email {
  from: string;
  host: string;
  isSsl: boolean;
  nickname: string;
  port: number;
  secret: string;
  to: string;
}

interface Token {
  bufferTime: string;
  expiresTime: string;
  issuer: string;
  signingKey: string;
}

interface UserLoginLimit {
  dayMaxCount: number;
  intervalSeconds: number;
  retryCount: number;
}

export interface SystemConfigModel {
  captcha?: Captcha;
  email?: Email;
  token?: Token;
  userLoginLimit?: UserLoginLimit;
}

// 获取系统配置
export const getSystemConfig = () => {
  return usePost<any, undefined>("/config/getSystemConfig");
};

// 设置系统配置
export const setSystemConfig = (params: any) => {
  return usePost<any, any>("/config/setSystemConfig", params);
};
