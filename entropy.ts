import { parse as parseFlags } from 'https://deno.land/std@0.203.0/flags/mod.ts';
import { Constructor } from 'https://deno.land/x/entropy@1.0.0-beta.4/src/utils/utils.module.ts';
import { inject } from 'https://deno.land/x/entropy@1.0.0-beta.4/src/injector/injector.module.ts';
import { Logger } from 'https://deno.land/x/entropy@1.0.0-beta.4/src/logger/logger.module.ts';
import { Command } from './src/interfaces/command.interface.ts';
import { MakeCommand } from './src/commands/make.command.ts';
import { NewCommand } from './src/commands/new.command.ts';
import { VersionCommand } from './src/commands/version.command.ts';

if (import.meta.main) {
  const logger = inject(Logger);

  const flags = parseFlags(Deno.args, {
    boolean: ['h', 'help', 'mongodb', 'v', 'version'],
    default: {
      h: false,
      help: false,
      mongodb: false,
      v: false,
      version: false,
    },
  });

  const [commandName] = flags._;

  if (flags.v || flags.version) {
    inject(VersionCommand).handle();

    Deno.exit();
  }

  if (!commandName) {
    logger.error('No command or flag specified');

    Deno.exit(1);
  }

  const commands: Record<string, Constructor<Command>> = {
    g: MakeCommand,
    generate: MakeCommand,
    m: MakeCommand,
    make: MakeCommand,
    n: NewCommand,
    new: NewCommand,
    v: VersionCommand,
    version: VersionCommand,
  };

  for (const [name, command] of Object.entries(commands)) {
    if (commandName === name) {
      const result = inject(command).handle(flags);
      const exitCode = result instanceof Promise ? await result : result;

      Deno.exit(exitCode ?? 0);
    }
  }

  logger.error(`Unknown command: ${commandName}`);

  Deno.exit(1);
}
