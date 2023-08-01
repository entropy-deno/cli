import { Command } from '../interfaces/command.interface.ts';
import { init } from '../init.ts';

export class NewCommand implements Command {
  public async handle() {
    await init();
  }
}
