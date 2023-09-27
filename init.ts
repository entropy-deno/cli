import { parse as parseFlags } from 'https://deno.land/std@0.203.0/flags/mod.ts';
import { NewCommand } from './src/commands/new.command.ts';

const flags = parseFlags(Deno.args, {
  boolean: ['mongodb'],
  default: {
    mongodb: false,
  },
});

if (import.meta.main) {
  Deno.exit(await new NewCommand().handle(flags) ?? 0);
}
