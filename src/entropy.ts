import { parse as parseFlags } from 'https://deno.land/std@0.196.0/flags/mod.ts';
import { inject, Logger } from 'https://deno.land/x/entropy@1.0.0-alpha.2/src/mod.ts';
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

  if (Deno.args[0] === 'new') {
    const name = Deno.args[1] || prompt('Project name: ');

    const repoName = 'app-template';
    const repoUrl = `https://github.com/entropy-deno/${repoName}`;
    const zipUrl = `${repoUrl}/archive/refs/heads/main.zip`;
  }
}
