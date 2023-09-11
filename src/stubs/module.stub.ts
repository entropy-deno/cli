export const moduleStub = (className: string) => {
  return `import { Module } from '@entropy/server';
  
  export class ${className} implements Module {
    public readonly channels = [];
  
    public readonly controllers = [];
  }
`;
};
