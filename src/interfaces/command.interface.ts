export interface Command {
  handle(): number | void | Promise<number | void>;
}
