import { NewCommand } from './src/commands/new.command.ts';

if (import.meta.main) {
  Deno.exit(await new NewCommand().handle() ?? 0);
}
