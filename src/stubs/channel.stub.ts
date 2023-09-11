export const channelStub = (className: string, name: string) => {
  return `import { Broadcaster, Channel, Subscribe } from '@entropy/web_socket';

@Channel('${name}/:id')
export class ${className} extends Broadcaster {
  public sendMessage(id: string) {
    this.broadcast({
      message: 'Hello, world!',
    }, \`${name}/\${id}\`);
  }

  @Subscribe('message')
  public listenMessage() {}
}
`;
};
