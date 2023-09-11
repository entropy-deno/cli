export const testStub = (className: string, name: string) => {
  return `import { assertStringIncludes } from '@std/assert/mod.ts';
  import { fetchRoute } from '@entropy/testing';
  import { ${className} } from './${name}.controller.ts';
  
  Deno.test('${name} module', async (test) => {
    await test.step('${name} controller works', async () => {
      const responseContent = await fetchRoute('/${name}', ${className});
  
      assertStringIncludes(responseContent, 'Hello, world!');
    });
  });  
`;
};
