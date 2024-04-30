import { getCustomGenerator, customLibActionType, unlessLastHelper } from './custom/prompt';
import { getEntryGenerator, entryLambdaActionType, entryLibActionType } from './entry/prompt';
import { i18n, setI18n, LangType } from './i18n';
import type { NodePlopAPI } from 'plop';

export default (plop: NodePlopAPI): void => {
  const { lang } = plop.getDefaultInclude() as Record<string, any>;

  // i18n
  setI18n(lang);

  // set welcome
  plop.setWelcomeMessage(i18n.welcome);

  // entry
  plop.setGenerator('entry', getEntryGenerator(plop));
  plop.setActionType('entryLambda', entryLambdaActionType);
  plop.setActionType('entryLib', entryLibActionType);

  // custom
  plop.setGenerator('custom', getCustomGenerator(plop));
  plop.setActionType('customLib', customLibActionType);

  // helper
  plop.setHelper('unlessLast', unlessLastHelper);
};

export { LangType };
export type { NodePlopAPI } from 'plop';
