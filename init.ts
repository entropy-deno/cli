import { parseArgs } from 'https://deno.land/std@0.207.0/cli/parse_args.ts';
import { NewCommand } from './src/commands/new.command.ts';

const args = parseArgs(Deno.args, {
  boolean: ['mongodb'],
  string: ['name'],
  default: {
    mongodb: false,
  },
});

if (import.meta.main) {
  Deno.exit(await new NewCommand().handle(args) ?? 0);
}
