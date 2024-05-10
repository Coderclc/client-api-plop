#!/usr/bin/env node
import { Plop, run } from 'plop';
import minimist from 'minimist';
import 'tsx';

const args = process.argv.slice(2);
const argv = minimist(args);

Plop.prepare(
  {
    cwd: argv.cwd,
    preload: argv.preload || [],
    configPath: argv.plopfile,
    completion: argv.completion,
  },
  function (env) {
    Plop.execute(env, run);
  },
);
