import { getCustomGenerator, getCustomLibActionType, unlessLastHelper } from './custom/prompt';
import { getEntryGenerator, getEntryLambdaActionType, getEntryLibActionType } from './entry/prompt';
import { i18n, setI18n } from './i18n';
import { mustProvide } from './utils';

import type { NodePlopAPI } from 'plop';
import type { DefaultIncludeType, EntryBypassConfig, CustomBypassConfig } from './types';
import { GeneratorType } from './types';

const runPrompt = (plop: NodePlopAPI): void => {
  const { lang } = plop.getDefaultInclude() as DefaultIncludeType;

  // i18n
  setI18n(lang);

  // set welcome
  plop.setWelcomeMessage(i18n.welcome);

  // entry
  plop.setGenerator('entry', getEntryGenerator(plop));
  plop.setActionType('entryLambda', getEntryLambdaActionType());
  plop.setActionType('entryLib', getEntryLibActionType());

  // custom
  plop.setGenerator('custom', getCustomGenerator(plop));
  plop.setActionType('customLib', getCustomLibActionType());

  // helper
  plop.setHelper('unlessLast', unlessLastHelper);
};

const runBypass = (plop: NodePlopAPI, bypass: EntryBypassConfig | CustomBypassConfig): void => {
  const { lang } = plop.getDefaultInclude() as DefaultIncludeType;
  const { generatorType } = bypass;

  // i18n
  setI18n(lang);

  // set welcome
  plop.setWelcomeMessage(i18n.welcome);

  switch (generatorType) {
    case GeneratorType.ENTRY:
      // entry
      mustProvide(bypass, ['module', 'apiName', 'method', 'url', 'domain']);
      plop.setGenerator('entry', getEntryGenerator(plop, bypass as EntryBypassConfig));
      plop.setActionType('entryLambda', getEntryLambdaActionType(bypass as EntryBypassConfig));
      plop.setActionType('entryLib', getEntryLibActionType(bypass as EntryBypassConfig));
      break;
    case GeneratorType.CUSTOM:
      // custom
      mustProvide(bypass, ['module', 'apiName', 'method', 'integrationApiName']);
      plop.setGenerator('custom', getCustomGenerator(plop, bypass as CustomBypassConfig));
      plop.setActionType('customLib', getCustomLibActionType(bypass as CustomBypassConfig));
      // helper
      plop.setHelper('unlessLast', unlessLastHelper);
      break;
  }
};

export * from './types';
export { runPrompt, runBypass };
