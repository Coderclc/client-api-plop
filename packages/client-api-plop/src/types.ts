import type { NodePlopAPI } from 'plop';

enum LangType {
  ZH_CN,
  EN,
}

enum GeneratorType {
  ENTRY,
  CUSTOM,
}

enum ModuleType {
  BLOC_HOTEL_MANAGE = 'blocHotelManage', // 单点后台
  COMMON = 'common', // 公共
  CONSUMER_EMPLOYEE = 'consumerEmployee', // 商户版
  CONSUMER_HOTEL = 'consumerHotel', // 旧h5
  CONSUMER_WECHAT = 'consumerWechat', // 小程序
  CONSUMER_XMN_HOTEL = 'consumerXmnHotel', // 新的h5
  FLAT_MANAGE = 'flatManage', // 平台层后台
  MONITOR = 'monitor', // 监控
  SCRM_MANAGE = 'scrmManage', // scrm后台
}

type LangConfig = {
  [key in LangType]: Record<string, any>;
};

type BypassConfig = {
  generatorType: GeneratorType;
  module: string;
  apiName: string;
  method: string;
};

type EntryBypassConfig = BypassConfig & {
  url: string;
  domain: string;
  apiModule?: string;
};

type CustomBypassConfig = BypassConfig & {
  integrationApiName: string[];
};

type HelperFunction = Parameters<NodePlopAPI['setHelper']>[1];

type DefaultIncludeType = {
  method?: string[];
  domain?: Array<string>;
  lang?: LangType;
  eslint?: boolean;
};

export { LangType, GeneratorType, ModuleType };
export type {
  DefaultIncludeType,
  NodePlopAPI,
  LangConfig,
  HelperFunction,
  EntryBypassConfig,
  CustomBypassConfig,
};
