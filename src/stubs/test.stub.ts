export const testStub = (className: string, name: string) => {
  return `import { expect } from 'https://deno.land/std@0.221.0/expect/expect.ts';
  import { fetchRoute } from '@entropy/testing';
  import { ${className} } from './${name}.controller.ts';
  
  Deno.test('${name} module', async (test) => {
    await test.step('${name} controller works', async () => {
      const responseContent = await fetchRoute('/${name}', ${className});
  
      expect(responseContent).toContain('Hello, world!');
    });
  });  
`;
};
