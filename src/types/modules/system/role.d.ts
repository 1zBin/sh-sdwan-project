interface MenuBtnModel {
  createdAt: string;
  desc: string;
  id: number;
  name: string;
  sysBaseMenuID: number;
  updatedAt: string;
}

interface MetaModel {
  closeTab: boolean;
  defaultMenu: boolean;
  icon: string;
  keepAlive: boolean;
  title: string;
}

interface ParameterModel {
  createdAt: string;
  id: number;
  key: string;
  sysBaseMenuID: number;
  type: string;
  updatedAt: string;
  value: string;
}

interface Menu {
  authoritys: string[];
  children: string[];
  component: string;
  createdAt: string;
  hidden: boolean;
  id: number;
  menuBtn: MenuBtnModel[];
  meta: MetaModel;
  name: string;
  parameters: ParameterModel[];
  parentId: string;
  path: string;
  sort: number;
  updatedAt: string;
}

interface AuthorityData {
  authorityId: number;
  authorityName: string;
  children?: string[];
  createdAt: string;
  dataAuthorityId?: string[];
  defaultRouter?: string;
  menus?: Menu[];
  parentId: number;
  updatedAt?: string;
}

export interface CopyRoleData {
  authority?: any;
  srcAuthorityId: number;
}

interface DataAuthorityId {
  createdAt?: string;
  updatedAt?: string;
  authorityId: number;
  authorityName: string;
  parentId: number;
  defaultRouter?: string;
}

export interface RoleDataModel {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  authorityId?: number;
  authorityName?: string;
  parentId?: number;
  dataAuthorityId?: DataAuthorityId[];
  defaultRouter?: string;
  menus?: any[];
  children?: any[];
}
