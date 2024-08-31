export interface HeaderFile {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  url: string;
  tag: string;
  key: string;
}

interface Authority {
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
  authorityId: number;
  authorityName: string;
  parentId: number;
  defaultRouter: string;
}

export interface User {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  uuid?: string;
  userName?: string;
  nickName?: string;
  sideMode?: string;
  headerImg?: string;
  headerFile?: HeaderFile;
  baseColor?: string;
  activeColor?: string;
  authorityId?: number;
  authority?: Authority;
  authorities?: Authority[];
  phone?: string;
  email?: string;
  enable?: number;
}

export interface UserFormParams {
  authorityIds?: number[];
  email?: string;
  enable?: number;
  headerImg?: string;
  id?: number;
  nickName?: string;
  phone?: string;
  sideMode?: string;
}
