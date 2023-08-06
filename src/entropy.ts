import { parse as parseFlags } from 'https://deno.land/std@0.197.0/flags/mod.ts';
import { Command } from './interfaces/command.interface.ts';
import { Constructor } from 'https://deno.land/x/entropy@1.0.0-alpha.8/src/utils/utils.module.ts';
import { inject } from 'https://deno.land/x/entropy@1.0.0-alpha.8/src/injector/injector.module.ts';
import { Logger } from 'https://deno.land/x/entropy@1.0.0-alpha.8/src/logger/logger.module.ts';
import { NewCommand } from './commands/new.command.ts';
import { VersionCommand } from './commands/version.command.ts';

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
    new VersionCommand().handle();

    Deno.exit();
  }

  const commands: Record<string, Constructor<Command>> = {
    new: NewCommand,
    version: VersionCommand,
  };

  for (const [name, command] of Object.entries(commands)) {
    if (flags._[0] === name) {
      const result = new command().handle();
      const exitCode = result instanceof Promise ? await result : result;

      Deno.exit(exitCode ?? 0);
    }
  }

  logger.error(`Unknown command: ${flags._[0]}`);

  Deno.exit(1);
}
