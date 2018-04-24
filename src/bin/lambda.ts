import LexProxy from '../LexProxy';
import * as awsSdk from 'aws-sdk';

const BOT_ALIAS = 'AwesomeBotAlias';
const BOT_NAME = 'AwesomeBotName';

const handler = (event, context, cb) => {
  const lexProxy = new LexProxy(BOT_ALIAS, BOT_NAME, awsSdk);
  lexProxy.proxy(event, context, cb);
};

export default handler;
