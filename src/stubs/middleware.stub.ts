export const middlewareStub = (className: string) => {
  return `import { Middleware } from '@entropy/http';

export class ${className} implements Middleware {
  public handle() {}
}
`;
};
