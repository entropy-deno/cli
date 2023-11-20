import { pascalCase, snakeCase } from 'https://deno.land/x/case@2.2.0/mod.ts';
import { plural } from 'https://deno.land/x/deno_plural@2.0.0/mod.ts';
import { inject } from 'https://deno.land/x/entropy@1.0.0-beta.6/src/injector/injector.module.ts';
import { Logger } from 'https://deno.land/x/entropy@1.0.0-beta.6/src/logger/logger.module.ts';
import { Command } from '../decorators/command.decorator.ts';
import { CommandHandler } from '../interfaces/command_handler.interface.ts';
import { channelStub } from '../stubs/channel.stub.ts';
import { controllerStub } from '../stubs/controller.stub.ts';
import { middlewareStub } from '../stubs/middleware.stub.ts';
import { moduleStub } from '../stubs/module.stub.ts';
import { serviceStub } from '../stubs/service.stub.ts';
import { testStub } from '../stubs/test.stub.ts';

interface Args {
  _: string[];
  h?: boolean;
  help?: boolean;
}

@Command({
  name: 'make',
  aliases: ['g', 'generate', 'h', 'help', 'm', 'make'],
  args: {
    boolean: ['help'],
    default: {
      h: false,
      help: false,
    },
  },
})
export class MakeCommand implements CommandHandler {
  private readonly logger = inject(Logger);

  private displayHelp(): void {
    this.logger.info('Role: Generate new source file\n');

    this.logger.info('Usage: %c$ %centropy make %c<type> <name>', {
      colors: ['gray', 'green', 'gray'],
    });

    this.logger.info('File type options:');

    this.logger.table([
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
  }

  public async handle(args: Args) {
    if (args.h || args.help) {
      this.displayHelp();

      return 0;
    }

    const [, type, name] = args._;

    if (!name) {
      this.logger.error('The <name> argument is required');

      return;
    }

    const fileName = snakeCase(name);
    const moduleName = plural(snakeCase(name));

    switch (type) {
      case 'channel': {
        const className = `${pascalCase(name)}Channel`;
        const path = `${Deno.cwd()}/src/${moduleName}`;

        try {
          await Deno.mkdir(path, {
            recursive: true,
          });
        } catch (error) {
          if (!(error instanceof Deno.errors.AlreadyExists)) {
            throw error;
          }
        }

        await Deno.writeTextFile(
          `${path}/${fileName}.channel.ts`,
          channelStub(className, plural(snakeCase(name))),
        );

        break;
      }

      case 'controller': {
        const className = `${pascalCase(name)}Controller`;
        const path = `${Deno.cwd()}/src/${moduleName}`;

        try {
          await Deno.mkdir(path, {
            recursive: true,
          });
        } catch (error) {
          if (!(error instanceof Deno.errors.AlreadyExists)) {
            throw error;
          }
        }

        await Deno.writeTextFile(
          `${path}/${fileName}.controller.ts`,
          controllerStub(className, plural(snakeCase(name))),
        );

        break;
      }

      case 'middleware': {
        const className = `${pascalCase(name)}Middleware`;
        const path = `${Deno.cwd()}/src/${moduleName}`;

        try {
          await Deno.mkdir(path, {
            recursive: true,
          });
        } catch (error) {
          if (!(error instanceof Deno.errors.AlreadyExists)) {
            throw error;
          }
        }

        await Deno.writeTextFile(
          `${path}/${fileName}.middleware.ts`,
          middlewareStub(className),
        );

        break;
      }

      case 'module': {
        const className = `${pascalCase(name)}Module`;
        const path = `${Deno.cwd()}/src/${moduleName}`;

        try {
          await Deno.mkdir(path, {
            recursive: true,
          });
        } catch (error) {
          if (!(error instanceof Deno.errors.AlreadyExists)) {
            throw error;
          }
        }

        await Deno.writeTextFile(
          `${path}/${fileName}.module.ts`,
          moduleStub(className),
        );

        break;
      }

      case 'service': {
        const className = `${pascalCase(name)}Service`;
        const path = `${Deno.cwd()}/src/${moduleName}`;

        try {
          await Deno.mkdir(path, {
            recursive: true,
          });
        } catch (error) {
          if (!(error instanceof Deno.errors.AlreadyExists)) {
            throw error;
          }
        }

        await Deno.writeTextFile(
          `${path}/${fileName}.service.ts`,
          serviceStub(className, `get${plural(pascalCase(name))}`),
        );

        break;
      }

      case 'test': {
        const className = `${pascalCase(name)}Module`;
        const path = `${Deno.cwd()}/src/${moduleName}`;

        try {
          await Deno.mkdir(path, {
            recursive: true,
          });
        } catch (error) {
          if (!(error instanceof Deno.errors.AlreadyExists)) {
            throw error;
          }
        }

        await Deno.writeTextFile(
          `${path}/${fileName}.test.ts`,
          testStub(className, plural(snakeCase(name))),
        );

        break;
      }

      default: {
        this.logger.error([
          'Invalid <file_type> argument',
          `Run 'entropy make --help' for more information`,
        ]);

        Deno.exit(1);
      }
    }

    this.logger.info(`Created new ${type} ${name}`);
  }
}
