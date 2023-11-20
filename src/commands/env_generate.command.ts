import { Encrypter } from 'https://deno.land/x/entropy@1.0.0-beta.6/src/encrypter/encrypter.module.ts';
import { inject } from 'https://deno.land/x/entropy@1.0.0-beta.6/src/injector/injector.module.ts';
import { Logger } from 'https://deno.land/x/entropy@1.0.0-beta.6/src/logger/logger.module.ts';
import { Command } from '../decorators/command.decorator.ts';
import { CommandHandler } from '../interfaces/command_handler.interface.ts';

interface Args {
  _: string[];
  h?: boolean;
  help?: boolean;
}

@Command({
  name: 'env:generate',
  aliases: ['env:g'],
  args: {
    boolean: ['help'],
    default: {
      h: false,
      help: false,
    },
  },
})
export class EnvGenerateCommand implements CommandHandler {
  private readonly encrypter = inject(Encrypter);

  private readonly logger = inject(Logger);

  private displayHelp(): void {
    this.logger.info('Role: Set up environment configuration\n');

    this.logger.info('Usage: %c$ %centropy env:generate', {
      colors: ['gray', 'green'],
    });
  }

  public async handle(args: Args) {
    if (args.h || args.help) {
      this.displayHelp();

      return 0;
    }

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

      this.logger.info('Generated encrypter key');
    }
  }
}
