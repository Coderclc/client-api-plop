// import { Method } from 'lib/type';
import { getPath, isValid, customAction, notEmpty, i18n } from '../utils';
import type { PlopGeneratorConfig, CustomActionFunction, NodePlopAPI } from 'plop';

type HelperFunction = Parameters<NodePlopAPI['setHelper']>[1];

export const customGenerator: PlopGeneratorConfig = {
  description: i18n.customDescription,
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
      validate: isValid('apiName'),
    },
    {
      type: 'editor', // Windows 上的记事本，Mac 或 Linux 上的 vim
      name: 'integrationApiName',
      message: i18n.integrationApiName,
      validate: notEmpty('integrationApiName'),
    },
    // {
    // type: 'rawlist',
    // name: 'method',
    // message: i18n.method,
    // choices: Object.keys(Method),
    // },
  ],
  actions: (data = {}) => {
    const apiName = '{{camelCase apiName}}';
    const { module, integrationApiName } = data;
    const integrationApiNameArr = integrationApiName.split(/\s+/).filter((item: string) => item);

    return [
      {
        type: 'add',
        path: getPath(`api/lambda/${module}/${apiName}.ts`),
        templateFile: 'custom/lambda.hbs',
        data: {
          ...data,
          integrationApiNameArr,
        },
      },
      {
        type: 'add',
        path: getPath(`lib/${module}/${apiName}.ts`),
        templateFile: 'custom/lib.hbs',
        data: {
          ...data,
          integrationApiNameArr,
        },
      },
      {
        type: 'customLib',
        path: getPath(`lib/${module}/index.ts`),
      },
    ];
  },
};

export const customLibActionType: CustomActionFunction = (answers, config) => {
  return customAction(answers, config, (apiName, content) => {
    let newContent = '';

    // add import type
    const importContent = `import ${apiName} from './${apiName}';`;
    newContent = `${importContent}\n${content}`;

    // add fetch
    const fetchMatchReg = /const.*?\{/;
    const fetchContent = `...${apiName}(fetch),`;
    newContent = newContent.replace(fetchMatchReg, (match) => `${match}\n\t${fetchContent}`);

    return newContent;
  });
};

export const unlessLastHelper: HelperFunction = ({ data: { last } }) => {
  if (!last) {
    return ' & ';
  } else {
    return '';
  }
};
