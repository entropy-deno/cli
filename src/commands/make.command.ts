import { exists } from 'https://deno.land/std@0.201.0/fs/mod.ts';
import { pascalCase, snakeCase } from 'https://deno.land/x/case@2.1.1/mod.ts';
import { plural } from 'https://deno.land/x/deno_plural@2.0.0/mod.ts';
import {
  inject,
  Logger,
} from 'https://deno.land/x/entropy@1.0.0-alpha.13/src/mod.ts';
import { Command } from '../interfaces/command.interface.ts';
import { channelStub } from '../stubs/channel.stub.ts';
import { controllerStub } from '../stubs/controller.stub.ts';
import { middlewareStub } from '../stubs/middleware.stub.ts';
import { moduleStub } from '../stubs/module.stub.ts';
import { serviceStub } from '../stubs/service.stub.ts';
import { testStub } from '../stubs/test.stub.ts';

interface Args {
  _: string[];
  help?: boolean;
}

export class MakeCommand implements Command {
  private readonly logger = inject(Logger);

  public async handle(args: Args) {
    if (args.help) {
      this.logger.info(
        'Usage: %c$ %centropy make %c<file_type> <name>',
        {
          colors: ['gray', 'white', 'gray'],
        },
      );

      this.logger.info('Available options:');

      console.table([
        {
          type: 'channel',
          description: 'Create new WebSocket channel',
        },
        {
          type: 'controller',
          description: 'Create new controller',
        },
        {
          type: 'middleware',
          description: 'Create new HTTP middleware',
        },
        {
          type: 'module',
          description: 'Create new application module',
        },
        {
          type: 'service',
          description: 'Create new service class',
        },
        {
          type: 'test',
          description: 'Create new module test',
        },
      ]);

      return;
    }

    if (!args._[2]) {
      this.logger.error('The <name> argument is required');

      return;
    }

    const fileName = snakeCase(args._[2]);
    const moduleName = plural(snakeCase(args._[2]));

    switch (args._[1]) {
      case 'channel': {
        const className = `${pascalCase(args._[2])}Channel`;
        const path = `${Deno.cwd()}/src/${moduleName}`;

        if (!await exists(path)) {
          await Deno.mkdir(path, {
            recursive: true,
          });
        }

        await Deno.writeTextFile(
          `${path}/${fileName}.channel.ts`,
          channelStub(className, plural(snakeCase(args._[2]))),
        );

        break;
      }

      case 'controller': {
        const className = `${pascalCase(args._[2])}Controller`;
        const path = `${Deno.cwd()}/src/${moduleName}`;

        if (!await exists(path)) {
          await Deno.mkdir(path, {
            recursive: true,
          });
        }

        await Deno.writeTextFile(
          `${path}/${fileName}.controller.ts`,
          controllerStub(className, plural(snakeCase(args._[2]))),
        );

        break;
      }

      case 'middleware': {
        const className = `${pascalCase(args._[2])}Middleware`;
        const path = `${Deno.cwd()}/src/${moduleName}`;

        if (!await exists(path)) {
          await Deno.mkdir(path, {
            recursive: true,
          });
        }

        await Deno.writeTextFile(
          `${path}/${fileName}.middleware.ts`,
          middlewareStub(className),
        );

        break;
      }

      case 'module': {
        const className = `${pascalCase(args._[2])}Module`;
        const path = `${Deno.cwd()}/src/${moduleName}`;

        if (!await exists(path)) {
          await Deno.mkdir(path, {
            recursive: true,
          });
        }

        await Deno.writeTextFile(
          `${path}/${fileName}.module.ts`,
          moduleStub(className),
        );

        break;
      }

      case 'service': {
        const className = `${pascalCase(args._[2])}Service`;
        const path = `${Deno.cwd()}/src/${moduleName}`;

        if (!await exists(path)) {
          await Deno.mkdir(path, {
            recursive: true,
          });
        }

        await Deno.writeTextFile(
          `${path}/${fileName}.service.ts`,
          serviceStub(className, `get${plural(pascalCase(args._[2]))}`),
        );

        break;
      }

      case 'test': {
        const className = `${pascalCase(args._[2])}Module`;
        const path = `${Deno.cwd()}/src/${moduleName}`;

        if (!await exists(path)) {
          await Deno.mkdir(path, {
            recursive: true,
          });
        }

        await Deno.writeTextFile(
          `${path}/${fileName}.test.ts`,
          testStub(className, plural(snakeCase(args._[2]))),
        );

        break;
      }

      default: {
        this.logger.error('Invalid <file_type> argument', {
          additionalInfo: `Run 'entropy make --help' for more information`,
        });

        Deno.exit(1);
      }
    }

    this.logger.info(`Created new ${args._[1]} ${args._[2]}`);
  }
}
