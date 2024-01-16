import { inject } from 'https://deno.land/x/entropy@1.0.0-beta.15/src/injector/injector.module.ts';
import { Logger } from 'https://deno.land/x/entropy@1.0.0-beta.15/src/logger/logger.module.ts';
import { Command } from '../decorators/command.decorator.ts';
import { CommandHandler } from '../interfaces/command_handler.interface.ts';
import { VERSION } from '../constants.ts';

@Command({
  name: 'version',
  aliases: ['v'],
})
export class VersionCommand implements CommandHandler {
  private readonly logger = inject(Logger);

  public handle() {
    this.logger.info(`Entropy CLI version %c${VERSION}`, {
      colors: ['blue'],
    });
  }
}
