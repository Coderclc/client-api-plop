import type { CustomActionFunction } from 'plop';
import type { DefaultIncludeType } from './types';

import fs from 'fs';
import path from 'path';
import { i18n } from './i18n';
import { ESLint } from 'eslint';

export const notEmpty = (name: string) => (v: string) =>
  !v || v.trim() === '' ? name + i18n.notEmpty : true;

export const isValid = (name: string) => (v: string) =>
  !/^[a-zA-Z][a-zA-Z0-9_/-]*$/.test(v) ? name + i18n.isValid : true;

export const mustProvide = (payload: Record<string, any>, parameter: string | string[]) => {
  if (!Array.isArray(parameter)) {
    parameter = [parameter];
  }

  parameter.forEach((key) => {
    if (!payload[key]) {
      throw new Error(i18n.mustProvide + key);
    }
  });

  return payload;
};

export const getPath = (_path: string) => path.join(process.cwd(), _path);

export const getTemplateFile = (_path: string) => path.join(__dirname, _path);

export const toCamelCase = (str: string = '') =>
  str
    .replace(/^[A-Z]/, (match) => match.toLowerCase())
    .replace(/[-/_]+(.)/g, (_, p1) => p1.toUpperCase())
    .replace(/[-_/]+$/, '');

export const customAction: (
  modifyContentFun: (apiName: string, content: string) => string,
  ...args: Parameters<CustomActionFunction>
) => ReturnType<CustomActionFunction> = (modifyContentFun, ...args) => {
  const [answers, config, plop] = args;

  return new Promise((resolve, reject) => {
    fs.readFile(config.path, 'utf8', (err, content) => {
      if (err) reject(err);

      const apiName = toCamelCase(answers.apiName);
      const newContent = modifyContentFun(apiName, content);

      fs.writeFile(config.path, newContent, 'utf8', async (err) => {
        if (err) reject(err);

        // eslint
        const { eslint } = plop.getDefaultInclude() as DefaultIncludeType;

        if (eslint) {
          const eslint = new ESLint({ fix: true });
          const results = await eslint.lintFiles(config.path);
          await ESLint.outputFixes(results);
          resolve(i18n.success);
        } else {
          resolve(i18n.success);
        }
      });
    });
  });
};
