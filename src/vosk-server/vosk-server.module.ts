import {forwardRef, Module} from '@nestjs/common';
import { VoskServerService } from './vosk-server.service';
import {VoskServerController} from "./vosk-server.controller";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [VoskServerController],
  providers: [VoskServerService],
  exports: [VoskServerService],
  imports: [
    forwardRef(() => AuthModule)
  ],
})
export class VoskServerModule {}
