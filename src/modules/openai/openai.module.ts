import { Module } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { OpenAiClientFactory } from './openai-client.factory';
import { CommonService } from '../../helpers';

@Module({
  providers: [OpenAiClientFactory, OpenAiService, CommonService],
  exports: [OpenAiClientFactory, OpenAiService],
})
export class OpenAiModule {}
