import type { CustomActionFunction } from 'plop';

import fs from 'fs';
import path from 'path';

const { spawn } = require('cross-spawn');

type CustomActionFunctionParameters = Parameters<CustomActionFunction>;

export const notEmpty = (name: string) => (v: string) =>
  !v || v.trim() === '' ? `${name} is required` : true;

export const isValid = (name: string) => (v: string) =>
  !/^[a-zA-Z][a-zA-Z0-9_/-]*$/.test(v) ? `${name} is an invalid variable` : true;

export const getPath = (_path: string) => path.join(process.cwd(), _path);

const toCamelCase = (str: string) =>
  str
    .replace(/^[A-Z]/, (match) => match.toLowerCase())
    .replace(/[-/_]+([a-z])/g, (_, p1) => p1.toUpperCase());

export const customAction = (
  answers: CustomActionFunctionParameters[0],
  config: CustomActionFunctionParameters[1],
  modifyContent: (apiName: string, content: string) => string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(config.path, 'utf8', (err, content) => {
      if (err) {
        reject(err);
      }
      const apiName = toCamelCase(answers.apiName);
      const newContent = modifyContent(apiName, content);

      fs.writeFile(config.path, newContent, 'utf8', (err) => {
        if (err) {
          reject(err);
        }

        // eslint
        const isFix = process.argv[3];

        if (isFix) {
          spawn('eslint', ['--fix', '--cache', config.path]).on('close', () =>
            resolve(i18n.success),
          );
        } else {
          resolve(i18n.success);
        }
      });
    });
  });
};

enum LangType {
  ZH_CN,
  EN,
}
interface LangConfig {
  [key: string]: any;
}

const useI18n = () => {
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
