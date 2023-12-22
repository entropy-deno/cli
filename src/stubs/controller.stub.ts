export const controllerStub = (className: string, slug: string) => {
  return `import { Controller, Route } from '@entropy/router';

export class ${className} extends Controller {
  @Route.Get('/${slug}')
  public async index() {
    return await this.render('${slug}/index');
  }
}
`;
};
