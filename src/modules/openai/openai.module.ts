import { Module } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { OpenAiClientFactory } from './openai-client.factory';

@Module({
  providers: [OpenAiClientFactory, OpenAiService],
  exports: [OpenAiClientFactory, OpenAiService],
})
export class OpenAiModule {}
