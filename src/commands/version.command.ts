import {
  inject,
  Logger,
} from 'https://deno.land/x/entropy@1.0.0-alpha.4/src/mod.ts';
import { Command } from '../interfaces/command.interface.ts';
import { VERSION } from '../constants.ts';

export class VersionCommand implements Command {
  private readonly logger = inject(Logger);

  public handle() {
    this.logger.info(`Entropy CLI ${VERSION}`);
  }
}
