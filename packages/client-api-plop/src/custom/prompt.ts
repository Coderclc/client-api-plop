import { getPath, isValid, customAction, notEmpty, getTemplateFile, toCamelCase } from '../utils';
import { i18n } from '../i18n';

import type { DefaultIncludeType, HelperFunction, CustomBypassConfig } from '../types';
import type { PlopGeneratorConfig, CustomActionFunction, NodePlopAPI } from 'plop';
import { ModuleType } from '../types';

export const getCustomGenerator = (
  plop: NodePlopAPI,
  bypass?: CustomBypassConfig,
): PlopGeneratorConfig => {
  const { method } = plop.getDefaultInclude() as DefaultIncludeType;

  return {
    description: i18n.customDescription,
    prompts: !bypass
      ? [
          {
            type: 'rawlist',
            name: 'module',
            message: i18n.module,
            choices: Object.values(ModuleType),
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
            choices: method,
          },
        ]
      : [],
    actions: (prompt) => {
      const data = (bypass || prompt)!;
      data.apiName = toCamelCase(data.apiName);
      const { module, integrationApiName, apiName } = data;
      const integrationApiNameArr = bypass
        ? integrationApiName
        : integrationApiName.split(/\s+/).filter((item: string) => item);

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

export const getCustomLibActionType: (bypass?: CustomBypassConfig) => CustomActionFunction =
  (bypass) =>
  (...args: Parameters<CustomActionFunction>) =>
    customAction(
      (apiName, content) => {
        apiName = bypass?.apiName || apiName;

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

export const unlessLastHelper: HelperFunction = ({ data: { last } }) => {
  if (!last) {
    return ' & ';
  } else {
    return '';
  }
};
