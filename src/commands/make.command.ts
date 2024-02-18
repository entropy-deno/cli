import { plural } from 'https://deno.land/x/deno_plural@2.0.0/mod.ts';
import { inject } from 'https://deno.land/x/entropy@1.0.0-beta.17/src/injector/injector.module.ts';
import { Logger } from 'https://deno.land/x/entropy@1.0.0-beta.17/src/logger/logger.module.ts';
import { Utils } from 'https://deno.land/x/entropy@1.0.0-beta.17/src/utils/utils.module.ts';
import { Command } from '../decorators/command.decorator.ts';
import { CommandHandler } from '../interfaces/command_handler.interface.ts';
import { channelStub } from '../stubs/channel.stub.ts';
import { controllerCrudStub } from '../stubs/controller_crud.stub.ts';
import { controllerStub } from '../stubs/controller.stub.ts';
import { middlewareStub } from '../stubs/middleware.stub.ts';
import { moduleStub } from '../stubs/module.stub.ts';
import { serviceStub } from '../stubs/service.stub.ts';
import { testStub } from '../stubs/test.stub.ts';

interface Args {
  _: string[];
  crud?: boolean;
  f?: boolean;
  force?: boolean;
  h?: boolean;
  help?: boolean;
  r?: boolean;
  raw?: boolean;
}

@Command({
  name: 'make',
  aliases: ['g', 'generate', 'm', 'make'],
  args: {
    boolean: ['crud', 'f', 'force', 'h', 'help', 'r', 'raw'],
    default: {
      crud: false,
      f: false,
      force: false,
      h: false,
      help: false,
      r: false,
      raw: false,
    },
  },
})
export class MakeCommand implements CommandHandler {
  private args!: Args;

  private readonly logger = inject(Logger);

  private fileName!: string;

  private moduleName?: string;

  private name!: string;

  private type?: string;

  private displayHelp(): void {
    this.logger.info('Role: Generate new source file\n');

    this.logger.info('Usage: %c$ %centropy make %c<type> <name>', {
      colors: ['gray', 'green', 'gray'],
    });

    this.logger.info('File type options:');

    this.logger.table([
      {
        type: 'all',
        description: 'Create all available source files',
      },
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

  private async createChannel(): Promise<void> {
    const className = `${Utils.toPascalCase(this.name)}Channel`;
    const path = `${Deno.cwd()}/src/${this.moduleName}`;

    try {
      await Deno.mkdir(path, {
        recursive: true,
      });
    } catch (error) {
      if (!(error instanceof Deno.errors.AlreadyExists)) {
        throw error;
      }
    }

    const name = this.args.r || this.args.raw
      ? this.name
      : plural(Utils.toSnakeCase(this.name));

    await Deno.writeTextFile(
      `${path}/${this.fileName}.channel.ts`,
      channelStub(className, name),
    );
  }

  private async createController(): Promise<void> {
    const className = `${Utils.toPascalCase(this.name)}Controller`;
    const path = `${Deno.cwd()}/src/${this.moduleName}`;

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
      `${path}/${this.fileName}.controller.ts`,
      (this.args.crud ? controllerCrudStub : controllerStub)(
        className,
        plural(Utils.toSnakeCase(this.name)),
      ),
    );
  }

  private async createMiddleware(): Promise<void> {
    const className = `${Utils.toPascalCase(this.name)}Middleware`;
    const path = `${Deno.cwd()}/src/${this.moduleName}`;

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
      `${path}/${this.fileName}.middleware.ts`,
      middlewareStub(className),
    );
  }

  private async createModule(): Promise<void> {
    const className = `${Utils.toPascalCase(this.name)}Module`;
    const path = `${Deno.cwd()}/src/${this.moduleName}`;

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
      `${path}/${this.fileName}.module.ts`,
      moduleStub(className),
    );
  }

  private async createService(): Promise<void> {
    const className = `${Utils.toPascalCase(this.name)}Service`;
    const path = `${Deno.cwd()}/src/${this.moduleName}`;

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
      `${path}/${this.fileName}.service.ts`,
      serviceStub(className, `get${plural(Utils.toPascalCase(this.name))}`),
    );
  }

  private async createTest(): Promise<void> {
    const className = `${Utils.toPascalCase(this.name)}Module`;
    const path = `${Deno.cwd()}/src/${this.moduleName}`;

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
      `${path}/${this.fileName}.test.ts`,
      testStub(className, plural(Utils.toSnakeCase(this.name))),
    );
  }

  public async handle(args: Args) {
    if (args.h || args.help) {
      this.displayHelp();

      return 0;
    }

    this.args = args;
    this.type = args._[1] ?? prompt('File type: ');
    this.name = args._[2] ?? prompt('File name: ');

    if (!this.name) {
      this.logger.error([
        'Invalid name',
        `Run 'entropy make --help' for more information`,
      ]);

      return 1;
    }

    this.fileName = Utils.toSnakeCase(this.name);
    this.moduleName = plural(Utils.toSnakeCase(this.name));

    switch (this.type) {
      case 'all': {
        await this.createChannel();
        await this.createController();
        await this.createMiddleware();
        await this.createModule();
        await this.createService();
        await this.createTest();

        break;
      }

      case 'channel': {
        await this.createChannel();

        break;
      }

      case 'controller': {
        await this.createController();

        break;
      }

      case 'middleware': {
        await this.createMiddleware();

        break;
      }

      case 'module': {
        await this.createModule();

        break;
      }

      case 'service': {
        await this.createService();

        break;
      }

      case 'test': {
        await this.createTest();

        break;
      }

      default: {
        this.logger.error([
          'Invalid <type> argument',
          `Run 'entropy make --help' for more information`,
        ]);

        return 1;
      }
    }

    this.logger.info(`Created new ${this.type} ${this.name}`);
  }
}
