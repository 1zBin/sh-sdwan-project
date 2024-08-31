interface Role {
  authorityId: number;
  authorityName: string;
  children: string[];
  createdAt: string;
  dataAuthorityId: string[];
  defaultRouter: string;
  menus: string[];
  parentId: number;
  updatedAt: string;
}

interface MenuBtn {
  createdAt: string;
  desc: string;
  id: number;
  name: string;
  sysBaseMenuID: number;
  updatedAt: string;
}

export interface Meta {
  closeTab?: boolean;
  defaultMenu?: boolean;
  icon?: string;
  keepAlive?: boolean;
  title: string;
}

interface Parameter {
  createdAt: string;
  id: number;
  key: string;
  sysBaseMenuID: number;
  type: string;
  updatedAt: string;
  value: string;
}

export interface MenuDataModel<T = any> {
  authoritys?: Role[];
  children?: any[];
  component?: string;
  createdAt?: string;
  hidden?: boolean;
  id?: number;
  menuBtn?: MenuBtn[];
  meta?: Meta;
  name?: string;
  parameters?: Parameter[];
  parentId?: string;
  path?: string;
  sort?: number;
  updatedAt?: string;
  [key?: string]: T;
}
