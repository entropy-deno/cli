import { parse as parseFlags } from 'https://deno.land/std@0.205.0/flags/mod.ts';
import { Constructor } from 'https://deno.land/x/entropy@1.0.0-beta.5/src/utils/utils.module.ts';
import { inject } from 'https://deno.land/x/entropy@1.0.0-beta.5/src/injector/injector.module.ts';
import { Logger } from 'https://deno.land/x/entropy@1.0.0-beta.5/src/logger/logger.module.ts';
import { Reflector } from 'https://deno.land/x/entropy@1.0.0-beta.5/src/utils/utils.module.ts';
import { CommandHandler } from './src/interfaces/command_handler.interface.ts';
import { EnvGenerateCommand } from './src/commands/env_generate.command.ts';
import { MakeCommand } from './src/commands/make.command.ts';
import { NewCommand } from './src/commands/new.command.ts';
import { VersionCommand } from './src/commands/version.command.ts';

if (import.meta.main) {
  const logger = inject(Logger);

  const globalFlags = parseFlags(Deno.args, {
    boolean: ['h', 'help', 'v', 'version'],
    default: {
      h: false,
      help: false,
      v: false,
      version: false,
    },
  });

  const [commandName] = globalFlags._;

  if (
    !commandName ||
    [globalFlags.h, globalFlags.help, globalFlags.v, globalFlags.version]
      .includes(true)
  ) {
    inject(VersionCommand).handle();

    Deno.exit();
  }

  const commands: Constructor<CommandHandler>[] = [
    EnvGenerateCommand,
    MakeCommand,
    NewCommand,
    VersionCommand,
  ];

  for (const command of commands) {
    const { aliases, args, name } = Reflector.getMetadata<
      {
        aliases: string[];
        args: {
          boolean: string[];
          default: Record<string, unknown>;
          string: string[];
        };
        name: string;
      }
    >('options', command) ?? {};

    if (
      name === commandName || (aliases ?? []).includes(commandName as string)
    ) {
      const flags = parseFlags(Deno.args, args);

      try {
        const result = inject(command).handle(flags);
        const exitCode = result instanceof Promise ? await result : result;

        Deno.exit(exitCode ?? 0);
      } catch {
        logger.error(
          `An error occurred while executing the '${commandName}' command`,
        );

        Deno.exit(1);
      }
    }
  }

  logger.error(`Unknown command: ${commandName}`);

  Deno.exit(1);
}
