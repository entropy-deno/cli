export const serviceStub = (className: string, method: string) => {
  return `export class ${className} {
  public ${method}() {
    return [];
  }
}
`;
};
