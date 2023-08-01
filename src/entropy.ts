import { parse as parseFlags } from 'https://deno.land/std@0.196.0/flags/mod.ts';
import {
  inject,
  Logger,
} from 'https://deno.land/x/entropy@1.0.0-alpha.4/src/mod.ts';
import { init } from './init.ts';
import { VERSION } from './constants.ts';

if (import.meta.main) {
  const logger = inject(Logger);

  const flags = parseFlags(Deno.args, {
    boolean: ['v', 'version'],
    default: {
      v: false,
      version: false,
    },
  });

  if (flags.v || flags.version) {
    logger.info(`Entropy CLI ${VERSION}`);

    Deno.exit();
  }

  if (flags._[0] === 'new') {
    await init();
  }
}
