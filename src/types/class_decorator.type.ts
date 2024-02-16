import { Constructor } from 'https://deno.land/x/entropy@1.0.0-beta.16/src/utils/utils.module.ts';

// deno-lint-ignore no-explicit-any
export type ClassDecorator<TTarget extends Constructor = any> = (
  originalClass: Constructor<TTarget>,
  context: ClassDecoratorContext,
) => TTarget;
