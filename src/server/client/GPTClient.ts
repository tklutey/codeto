import OpenAI from 'openai-api';

export default class GPTClient {
  private openAIClient: OpenAI;

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

  askQuestion = async (question: string) => {
    console.log(question);
    const gptResponse = await this.openAIClient.complete({
      engine: 'text-davinci-003',
      prompt: `Q: ${question}\nA:`,
      maxTokens: 512,
      temperature: 0,
      stream: false
    });

    return gptResponse.data?.choices[0]?.text;
  };
}
