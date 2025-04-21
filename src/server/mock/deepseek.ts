import axios from 'axios';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import type { AIClient, DeepSeekConfig, AIResponse } from '../types';

export class DeepSeekAPI implements AIClient {
  constructor(private apiKey: string) {}

  chat = {
    complete: async (config: DeepSeekConfig) => {
      try {
        const response = await axios.post(
          'https://api.deepseek.com/v1/chat/completions',
          {
            model: config.model,
            messages: config.messages,
            temperature: config.temperature,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        return {
          output: response.data.choices[0].message.content,
          usage: response.data.usage,
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data?.error?.message || error.message);
        }
        throw error;
      }
    }
  };

  async mockResponse(messages: ChatCompletionMessageParam[], role?: string): Promise<AIResponse> {
    // This method is kept for compatibility but now just calls the real API
    const result = await this.chat.complete({ messages, role, model: 'deepseek-chat', temperature: 0.7 });
    return {
      success: true,
      response: result.output,
      usage: result.usage
    };
  }
}