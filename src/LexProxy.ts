import { AWSError } from 'aws-sdk';
import * as LexRuntime from 'aws-sdk/clients/lexruntime';

/** Class proxying message from API Gateway to AWS Lex*/
export default class LexProxy {
  private lexInstance: LexRuntime;
  private params: LexRuntime.PostTextRequest = {
    botAlias: null,
    botName: null,
    userId: null,
    inputText: null,
  };

  /** Create LexProxy object.
   * @param botAlias: The bot alias configured in Lex
   * @param botName: The bot name configured in Lex
   * @param awsSdk: AWS SDK instance with configurations made. Allows usage of any AWS SDK version.
   * @throws Will throw an error if invalid AWS SDK is provided.*/
  constructor(botAlias: string, botName: string, awsSdk: any) {
    this.params.botAlias = botAlias;
    this.params.botName = botName;
    if (awsSdk.hasOwnProperty('LexRuntime')) {
      this.lexInstance = new awsSdk.LexRuntime();
    } else {
      throw new Error('AWS SDK with LexRuntime expected. Please provide AWS SDK with all configurations ' +
            'setup a priori.');
    }
  }

    /**
     * Method that is to be used in lambda to proxy call to Lex directly
     * @param event: Lambda Event Object
     * @param context: Lambda Context Object
     * @param callback: Lambda Callback Function
     */
  public proxy(event: any, context: any, callback: any): void {
    if (event && event.hasOwnProperty('body-json')) {
      this.params.inputText = event['body-json'].message;
      this.params.userId = event['body-json'].uuid;

      this.lexInstance.postText(this.params, (err: AWSError, data: LexRuntime.PostTextResponse) => {
        if (err) {
          callback(err, 'Failed.');
        } else {
          context.succeed(data);
        }
      });
    } else {
      throw new Error('Event missing body-json payload. Have you added the proper request templates ?');
    }
  }
}
