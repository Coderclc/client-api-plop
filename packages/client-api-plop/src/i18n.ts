export enum LangType {
  ZH_CN,
  EN,
}

type LangConfig = {
  [key in LangType]: Record<string, any>;
};

const useI18n = () => {
  const lang = LangType.EN;
  const langConfig: LangConfig = {
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
  const i18n = langConfig[lang];

  function setI18n(lang: LangType) {
    switch (lang) {
      case LangType.EN:
      case LangType.ZH_CN:
        Object.assign(i18n, langConfig[lang]);
        break;
    }
  }

  return {
    i18n,
    setI18n,
  };
};

const { i18n, setI18n } = useI18n();

export { i18n, setI18n };
