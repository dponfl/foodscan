import { Get, Injectable } from '@nestjs/common';
import { OpenAiService } from './modules/openai';

@Injectable()
export class AppService {
  constructor(private readonly openAiService: OpenAiService) {}
  getHello(): string {
    return 'Hello World!';
  }

  chat() {
    const res = this.openAiService.textCompletion('Расскажи про Италию');
    return res;
  }
}
