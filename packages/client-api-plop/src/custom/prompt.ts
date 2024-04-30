import { getPath, isValid, customAction, notEmpty, getTemplateFile } from '../utils';
import { i18n } from '../i18n';
import type { PlopGeneratorConfig, CustomActionFunction, NodePlopAPI } from 'plop';

type HelperFunction = Parameters<NodePlopAPI['setHelper']>[1];

export const getCustomGenerator = (plop: NodePlopAPI): PlopGeneratorConfig => {
  const { Method } = plop.getDefaultInclude() as Record<string, any>;

  return {
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
      {
        type: 'rawlist',
        name: 'method',
        message: i18n.method,
        choices: Object.keys(Method),
      },
    ],
    actions: (data = {}) => {
      const apiName = '{{camelCase apiName}}';
      const { module, integrationApiName } = data;
      const integrationApiNameArr = integrationApiName.split(/\s+/).filter((item: string) => item);

      return [
        {
          type: 'add',
          path: getPath(`api/lambda/${module}/${apiName}.ts`),
          templateFile: getTemplateFile('custom/lambda.hbs'),

          data: {
            ...data,
            integrationApiNameArr,
          },
        },
        {
          type: 'add',
          path: getPath(`lib/${module}/${apiName}.ts`),
          templateFile: getTemplateFile('custom/lib.hbs'),
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
};

export const customLibActionType: CustomActionFunction = (
  ...args: Parameters<CustomActionFunction>
) => {
  return customAction(
    (apiName, content) => {
      let newContent = '';

      // add import type
      const importContent = `import ${apiName} from './${apiName}';`;
      newContent = `${importContent}\n${content}`;

      // add fetch
      const fetchMatchReg = /const.*?\{/;
      const fetchContent = `...${apiName}(fetch),`;
      newContent = newContent.replace(fetchMatchReg, (match) => `${match}\n\t${fetchContent}`);

      return newContent;
    },
    ...args,
  );
};

export const unlessLastHelper: HelperFunction = ({ data: { last } }) => {
  if (!last) {
    return ' & ';
  } else {
    return '';
  }
};
