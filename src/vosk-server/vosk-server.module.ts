import { forwardRef, Module } from '@nestjs/common';
import { VoskServerService } from './vosk-server.service';
import { VoskDockerService } from './vosk-docker.service';
import { VoskServerController } from "./vosk-server.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [VoskServerController],
  providers: [VoskServerService, VoskDockerService],
  exports: [VoskServerService, VoskDockerService],
  imports: [
    forwardRef(() => AuthModule)
  ],
})
export class VoskServerModule { }
