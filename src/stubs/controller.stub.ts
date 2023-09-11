export const controllerStub = (className: string, slug: string) => {
  return `import { Controller } from '@entropy/http';
import { Route } from '@entropy/router';

export class ${className} extends Controller {
  @Route.Get('/${slug}')
  public index() {
    return this.render('${slug}/index');
  }
}
`;
};
