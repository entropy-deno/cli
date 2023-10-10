export interface CommandHandler {
  handle(...params: unknown[]): number | void | Promise<number | void>;
}
