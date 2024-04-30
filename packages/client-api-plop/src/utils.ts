import type { CustomActionFunction } from 'plop';

import fs from 'fs';
import path from 'path';
import { i18n } from './i18n';

const { spawn } = require('cross-spawn');

export const notEmpty = (name: string) => (v: string) =>
  !v || v.trim() === '' ? `${name} is required` : true;

export const isValid = (name: string) => (v: string) =>
  !/^[a-zA-Z][a-zA-Z0-9_/-]*$/.test(v) ? `${name} is an invalid variable` : true;

export const getPath = (_path: string) => path.join(process.cwd(), _path);
export const getTemplateFile = (_path: string) => path.join(__dirname, _path);

const toCamelCase = (str: string) =>
  str
    .replace(/^[A-Z]/, (match) => match.toLowerCase())
    .replace(/[-/_]+(.)/g, (_, p1) => p1.toUpperCase())
    .replace(/[-_/]+$/, '');

export const customAction: (
  modifyContent: (apiName: string, content: string) => string,
  ...args: Parameters<CustomActionFunction>
) => ReturnType<CustomActionFunction> = (modifyContent, ...args) => {
  const [answers, config, plop] = args;

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
        const { eslint } = plop.getDefaultInclude() as Record<string, any>;

        if (eslint) {
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
