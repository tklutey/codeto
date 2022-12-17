import OpenAI from 'openai-api';

export default class GPTClient {
  private openAIClient: OpenAI;

  TIMEOUT = 15000;

  constructor() {
    const OPENAI_API_KEY = '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';
    this.openAIClient = new OpenAI(OPENAI_API_KEY);
  }

  getJavaErrorHint = async (error: string) => {
    const prompt = `explain why the below code doesn't work \n${error}`;
    const gptResponse = await this.openAIClient.complete({
      engine: 'text-davinci-002',
      prompt: prompt,
      maxTokens: 256,
      temperature: 0,
      stream: false
    });

    return gptResponse.data?.choices[0]?.text;
  };
}
