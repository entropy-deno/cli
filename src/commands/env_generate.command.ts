import { Encrypter } from 'https://deno.land/x/entropy@1.0.0-beta.4/src/encrypter/encrypter.module.ts';
import { inject } from 'https://deno.land/x/entropy@1.0.0-beta.4/src/injector/injector.module.ts';
import { Logger } from 'https://deno.land/x/entropy@1.0.0-beta.4/src/logger/logger.module.ts';
import { Command } from '../decorators/command.decorator.ts';
import { CommandHandler } from '../interfaces/command_handler.interface.ts';

@Command({
  name: 'env:generate',
})
export class EnvGenerateCommand implements CommandHandler {
  private readonly encrypter = inject(Encrypter);

  private readonly logger = inject(Logger);

  public async handle() {
    const envFile = './.env';

    await Deno.copyFile(
      `${envFile}.example`,
      envFile,
    );

    await Deno.writeTextFile(
      envFile,
      (await Deno.readTextFile(envFile)).replace(
        /^ENCRYPTER_KEY=.*?$/m,
        `ENCRYPTER_KEY=${this.encrypter.generateRandomString(32)}}`,
      ),
    );

    this.logger.info('Generated .env file');
  }
}
