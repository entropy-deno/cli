import {
  ClassDecorator,
  Reflector,
} from 'https://deno.land/x/entropy@1.0.0-beta.17/src/utils/utils.module.ts';

interface Options {
  aliases?: string[];
  args?: {
    boolean?: string[];
    default?: Record<string, unknown>;
    string?: string[];
  };
  name: string;
}

export function Command(
  { aliases = [], args = {}, name }: Options,
): ClassDecorator {
  return (originalClass) => {
    Reflector.defineMetadata<
      {
        aliases: string[];
        args: {
          boolean?: string[];
          default?: Record<string, unknown>;
          string?: string[];
        };
        name: string;
      }
    >('options', {
      aliases,
      args,
      name,
    }, originalClass);

    return originalClass;
  };
}
