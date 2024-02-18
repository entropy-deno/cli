import { Encrypter } from 'https://deno.land/x/entropy@1.0.0-beta.17/src/encrypter/encrypter.module.ts';
import { inject } from 'https://deno.land/x/entropy@1.0.0-beta.17/src/injector/injector.module.ts';
import { Logger } from 'https://deno.land/x/entropy@1.0.0-beta.17/src/logger/logger.module.ts';
import { Command } from '../decorators/command.decorator.ts';
import { CommandHandler } from '../interfaces/command_handler.interface.ts';

interface Args {
  _: string[];
  h?: boolean;
  help?: boolean;
}

@Command({
  name: 'env',
  args: {
    boolean: ['h', 'help'],
    default: {
      h: false,
      help: false,
    },
  },
})
export class EnvCommand implements CommandHandler {
  private readonly encrypter = inject(Encrypter);

  private readonly logger = inject(Logger);

  private displayHelp(): void {
    this.logger.info('Role: Set up environment configuration\n');

    this.logger.info('Usage: %c$ %centropy env:generate', {
      colors: ['gray', 'green'],
    });
  }

  private async prepare(): Promise<void> {
    const envFile = './.env';

    try {
      await Deno.copyFile(
        `${envFile}.example`,
        envFile,
      );

      this.logger.info('Generated .env file');
    } finally {
      await Deno.writeTextFile(
        envFile,
        (await Deno.readTextFile(envFile)).replace(
          /^ENCRYPTER_KEY=.*?$/m,
          `ENCRYPTER_KEY=${this.encrypter.generateRandomString(32)}}`,
        ),
      );

      this.logger.info('Generated safe encrypter key');
    }
  }

  public async handle(args: Args) {
    if (args.h || args.help) {
      this.displayHelp();

      return 0;
    }

    switch (args._[0]) {
      case 'generate':
      case 'prepare':
        await this.prepare();

        break;
      default:
        this.logger.error([
          `Invalid 'env' command action`,
          `Run 'entropy env --help' for more information`,
        ]);

        return 1;
    }
  }
}
