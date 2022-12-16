import { ChatGPTAPIBrowser } from 'chatgpt';

export default class GPTClient {
  private GPTClient: ChatGPTAPIBrowser;

  TIMEOUT = 15000;

  constructor() {
    this.GPTClient = new ChatGPTAPIBrowser({
      email: 'kluteyt@gmail.com',
      password: 'yRsjzaG$M#575&Ad'
    });
  }

  auth = async () => {
    await this.GPTClient.init();
    return this.GPTClient;
  };

  getJavaErrorHint = async (error: string) => {
    // send a message and wait for the response
    const response = await this.GPTClient.sendMessage(
      `Provide a hint (in less than 180 characters) as to what is causing the following Java error: ${error}`,
      {
        timeoutMs: this.TIMEOUT
      }
    );

    // response is a markdown-formatted string
    return response;
  };
}
