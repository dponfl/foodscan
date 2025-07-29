import { Injectable } from '@nestjs/common';
import { IScene, MyContext } from '../../../../types';
import { SCENES } from '../scenes.constants';

@Injectable()
export class PaymentSceneService implements IScene {
  readonly SCENE_NAME = SCENES.PAYMENT;

  async handle(ctx: MyContext): Promise<void> {
    ctx.session.waitingForInput = null;
    ctx.session.sceneEntryTime = Date.now();
    ctx.session.currentScene = this.SCENE_NAME;
  }
}
