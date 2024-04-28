import { customGenerator, customLibActionType, unlessLastHelper } from './custom/prompt';
import { entryGenerator, entryLambdaActionType, entryLibActionType } from './entry/prompt';
import { i18n } from './utils';
import type { NodePlopAPI } from 'plop';

export default (plop: NodePlopAPI, ...arg: any): void => {
  console.log(arg, 456);
  console.log(plop.getDestBasePath());
  console.log(plop.getDefaultInclude());

  plop.setWelcomeMessage(i18n.welcome);

  // entry
  plop.setGenerator('entry', entryGenerator);
  plop.setActionType('entryLambda', entryLambdaActionType);
  plop.setActionType('entryLib', entryLibActionType);

  // custom
  plop.setGenerator('custom', customGenerator);
  plop.setActionType('customLib', customLibActionType);

  plop.setHelper('unlessLast', unlessLastHelper);
};

export type { NodePlopAPI } from 'plop';
