import { notEmpty, isValid, customAction, getPath, getTemplateFile, toCamelCase } from '../utils';
import { i18n } from '../i18n';

import type { PlopGeneratorConfig, CustomActionFunction, NodePlopAPI } from 'plop';
import type { DefaultIncludeType, EntryBypassConfig } from '../types';
import { ModuleType } from '../types';

export const getEntryGenerator = (
  plop: NodePlopAPI,
  bypass?: EntryBypassConfig,
): PlopGeneratorConfig => {
  const { method, domain } = plop.getDefaultInclude() as DefaultIncludeType;

  return {
    description: i18n.entryDescription,
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
            type: 'input',
            name: 'url',
            message: i18n.url,
            validate: notEmpty('url'),
          },
          {
            type: 'rawlist',
            name: 'method',
            message: i18n.method,
            choices: method,
          },
          {
            type: 'rawlist',
            name: 'domain',
            message: i18n.domain,
            choices: domain,
          },
        ]
      : [],
    actions: (prompt) => {
      const data = (bypass || prompt)!;
      data.apiName = toCamelCase(data.apiName);
      const { module, apiName } = data;
      const apiModule = data.apiModule ? data.apiModule + '/' : '';

      return [
        {
          type: 'add',
          path: getPath(`api/api/${apiModule}${apiName}.ts`),
          templateFile: getTemplateFile('entry/api.hbs'),
          data,
        },
        {
          type: 'append',
          path: getPath('api/api/index.ts'),
          template: `export * from './${apiModule}${apiName}';`,
        },
        {
          type: 'entryLambda',
          path: getPath(`api/lambda/${module}/entry.ts`),
        },
        {
          type: 'entryLib',
          path: getPath(`lib/${module}/entry.ts`),
        },
      ];
    },
  };
};

export const getEntryLambdaActionType: (bypass?: EntryBypassConfig) => CustomActionFunction =
  (bypass) =>
  (...args: Parameters<CustomActionFunction>) =>
    customAction(
      (apiName, content) => {
        apiName = bypass?.apiName || apiName;

        let newContent = '';
        const apiModule = bypass?.apiModule ? bypass?.apiModule + '/' : '';

        const importMatchReg = /import \* as api from '@\/api';/;
        const importContent = `import type { ${apiName}Data, ${apiName}Res } from '@/api/${apiModule}${apiName}';`;
        newContent = content.replace(importMatchReg, (match) => `${match}\n${importContent}`);

        // add apiMap
        const apiMapMatchReg = /const apiMap.*?\{/;
        const apiMapContent = `${apiName}: api.${apiName},`;
        newContent = newContent.replace(apiMapMatchReg, (match) => `${match}\n\t${apiMapContent}`);

        // add entryPost
        const entryPostMatch = 'export type EntryPost = {';
        const entryPostContent = `(option: Option<never, ${apiName}Data>): EntryRes<${apiName}Res>;`;
        newContent = newContent.replace(
          new RegExp(entryPostMatch),
          `${entryPostMatch}\n\t${entryPostContent}`,
        );

        return newContent;
      },
      ...args,
    );

export const getEntryLibActionType: (bypass?: EntryBypassConfig) => CustomActionFunction =
  (bypass) =>
  (...args: Parameters<CustomActionFunction>) =>
    customAction(
      (apiName, content) => {
        apiName = bypass?.apiName || apiName;

        let newContent = '';
        const apiModule = bypass?.apiModule ? bypass?.apiModule + '/' : '';

        // add import type
        const importMatchReg = /import { ApiRes } from '@pakwoon\/mysql-utils';/;
        const importContent = `import type { ${apiName}Data, ${apiName}Res } from '@/api/${apiModule}${apiName}';`;
        newContent = content.replace(importMatchReg, (match) => `${match}\n${importContent}`);

        // add entryIndex
        const entryIndexMatchReg = /export type.*?EntryIndex = {/;
        const entryIndexContent = `(data: EntryData<never, ${apiName}Data>, options?: ApiOptions): EntryRes<${apiName}Res>;`;
        newContent = newContent.replace(
          entryIndexMatchReg,
          (match) => `${match}\n\t${entryIndexContent}`,
        );

        // add export type
        const exportContent = `export type { ${apiName}Data, ${apiName}Res } from '@/api/${apiModule}${apiName}';`;
        newContent += `${exportContent}\n`;

        return newContent;
      },
      ...args,
    );
