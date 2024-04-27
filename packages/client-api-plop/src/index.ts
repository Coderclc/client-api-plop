import type { NodePlopAPI } from 'plop';

const useI18n = () => {
  enum LangType {
    ZH_CN,
    EN,
  }
  interface LangConfig {
    [key: string]: any;
  }

  const locale = LangType.ZH_CN;

  const lang: Record<LangType, LangConfig> = {
    [LangType.ZH_CN]: {
      welcome: '🦖 欢迎使用 client-api-plop, 请选择一个生成器.',
      entryDescription: '生成一个入口接口',
      customDescription: '生成一个自定义接口',
      module: '请选择模块',
      apiName: '请输入请求接口名称',
      url: '请输入请求接口地址',
      method: '请选择请求方式',
      domain: '请选择请求域名',
      integrationApiName: '请输入整合接口名称, 多个之间用空格或换行分隔',
      success: '生成成功',
    },
    [LangType.EN]: {
      welcome: '🦖 Welcome to use client-api-plop, Please choose a generator.',
      entryDescription: 'generate a entry api',
      customDescription: 'generate a custom api',
      module: 'Please select the module',
      apiName: 'Please enter the request apiName',
      url: 'Please enter the request url',
      method: 'Please select the request method',
      domain: 'Please select the request domain',
      integrationApiName:
        'Please enter the integration apiName, Separate multiple with spaces or line breaks',
      success: 'Successfully generated',
    },
  };

  return lang[locale];
};

export const i18n = useI18n();

module.exports = (plop: NodePlopAPI) => {
  plop.setGenerator('entry', {
    description: i18n.entryDescription,
    prompts: [
      {
        type: 'rawlist',
        name: 'module',
        message: i18n.module,
        choices: [
          'blocHotelManage', // 单点后台
          'common', // 公共
          'consumerEmployee', // 商户版
          'consumerHotel', // 旧h5
          'consumerWechat', // 小程序
          'consumerXmnHotel', // 新的h5
          'flatManage', // 平台层后台
          'monitor', // 监控
          'scrmManage', // scrm后台
        ],
      },
      {
        type: 'input',
        name: 'apiName',
        message: i18n.apiName,
      },
      {
        type: 'input',
        name: 'url',
        message: i18n.url,
      },
      {
        type: 'rawlist',
        name: 'method',
        message: i18n.method,
      },
      {
        type: 'rawlist',
        name: 'domain',
        message: i18n.domain,
      },
    ],
  });
};
