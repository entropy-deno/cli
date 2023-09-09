export interface Command {
  handle(...params: unknown[]): number | void | Promise<number | void>;
}
