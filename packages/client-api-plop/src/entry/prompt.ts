// import { Method } from 'lib/type';
// import { DOMAIN } from '@/fetch';
import { notEmpty, isValid, customAction, i18n, getPath } from '../utils';
import type { PlopGeneratorConfig, CustomActionFunction } from 'plop';

export const entryGenerator: PlopGeneratorConfig = {
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
      validate: isValid('apiName'),
    },
    {
      type: 'input',
      name: 'url',
      message: i18n.url,
      validate: notEmpty('url'),
    },
    // {
    //   type: 'rawlist',
    //   name: 'method',
    //   message: i18n.method,
    //   choices: Object.keys(Method),
    // },
    // {
    //   type: 'rawlist',
    //   name: 'domain',
    //   message: i18n.domain,
    //   choices: Object.keys(DOMAIN),
    // },
  ],
  actions: () => {
    const apiName = '{{camelCase apiName}}';
    // const { module } = data!;

    return [
      // {
      //   type: 'add',
      //   path: getPath(`api/api/${apiName}.ts`),
      //   templateFile: './entry/api.hbs',
      //   data: {
      //     ...data,
      //     domain: 123,
      //     method: 345,
      //   },
      // },
      {
        type: 'append',
        path: getPath('api/api/index.ts'),
        template: `export * from './${apiName}';`,
      },
      // {
      //   type: 'entryLambda',
      //   path: getPath(`api/lambda/${module}/entry.ts`),
      // },
      // {
      //   type: 'entryLib',
      //   path: getPath(`lib/${module}/entry.ts`),
      // },
    ];
  },
};

export const entryLambdaActionType: CustomActionFunction = (answers, config) => {
  return customAction(answers, config, (apiName, content) => {
    let newContent = '';

    const importMatchReg = /import \* as api from '@\/api';/;
    const importContent = `import type { ${apiName}Data, ${apiName}Res } from '@/api/${apiName}';`;
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
  });
};

export const entryLibActionType: CustomActionFunction = (answers, config) => {
  return customAction(answers, config, (apiName, content) => {
    let newContent = '';

    // add import type
    const importMatchReg = /import { ApiRes } from '@pakwoon\/mysql-utils';/;
    const importContent = `import type { ${apiName}Data, ${apiName}Res } from '@/api/${apiName}';`;
    newContent = content.replace(importMatchReg, (match) => `${match}\n${importContent}`);

    // add entryIndex
    const entryIndexMatchReg = /export type.*?EntryIndex = {/;
    const entryIndexContent = `(data: EntryData<never, ${apiName}Data>, options?: ApiOptions): EntryRes<${apiName}Res>;`;
    newContent = newContent.replace(
      entryIndexMatchReg,
      (match) => `${match}\n\t${entryIndexContent}`,
    );

    // add export type
    const exportContent = `export type { ${apiName}Data, ${apiName}Res } from '@/api/${apiName}';`;
    newContent += `${exportContent}\n`;

    return newContent;
  });
};
