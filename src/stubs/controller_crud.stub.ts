export const controllerCrudStub = (className: string, slug: string) => {
  return `import { Controller, HttpRequest } from '@entropy/http';
import { Route } from '@entropy/router';

export class ${className} extends Controller {
  @Route.Get('/${slug}')
  public async index() {
    return await this.render('${slug}/index');
  }

  @Route.Get('/${slug}/create')
  public async create() {
    return await this.render('${slug}/create');
  }

  @Route.Post('/${slug}')
  public store([], request: HttpRequest) {
    // 
  }

  @Route.Get('/${slug}/:id')
  public async show([id]: [string]) {
    return await this.render('${slug}', {
      id,
    });
  }

  @Route.Get('/${slug}/:id/edit')
  public async edit([id]: [string]) {
    return await this.render('${slug}/edit', {
      id,
    });
  }

  @Route.Patch('/${slug}/:id')
  public update([id]: [string], request: HttpRequest) {
    // 
  }

  @Route.Delete('/${slug}/:id')
  public destroy([id]: [string], request: HttpRequest) {
    // 
  }
}
`;
};
