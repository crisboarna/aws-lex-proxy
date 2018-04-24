declare class LexProxy {
  constructor(botAlias: string, botName: string, awsSdk: any);
  proxy(event: any, context: any, callback: any): void;
}
