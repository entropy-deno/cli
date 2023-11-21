export const controllerCrudStub = (className: string, slug: string) => {
  return `import { Controller } from '@entropy/http';
import { Route } from '@entropy/router';

export class ${className} extends Controller {
  @Route.Get('/${slug}')
  public index() {
    return this.render('${slug}/index');
  }

  @Route.Get('/${slug}/create')
  public create() {
    return this.render('${slug}/create');
  }

  @Route.Post('/${slug}')
  public store() {
    // 
  }

  @Route.Get('/${slug}/:id')
  public show([id]: [string]) {
    return this.render('${slug}', {
      id,
    });
  }

  @Route.Get('/${slug}/:id/edit')
  public edit([id]: [string]) {
    return this.render('${slug}/edit', {
      id,
    });
  }

  @Route.Patch('/${slug}/:id')
  public update([id]: [string]) {
    // 
  }

  @Route.Delete('/${slug}/:id')
  public destroy([id]: [string]) {
    // 
  }
}
`;
};
