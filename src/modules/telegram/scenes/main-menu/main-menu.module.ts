import { Module } from '@nestjs/common';
import { MainMenuSceneService } from './main-menu.service';

@Module({
  providers: [MainMenuSceneService],
  exports: [MainMenuSceneService],
})
export class MainMenuSceneModule {}
