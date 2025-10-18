import {forwardRef, Module} from '@nestjs/common';
import {WhisperServerController} from "./whisper-server.controller";
import {WhisperServerService} from "./whisper-server.service";
import {AuthModule} from "../auth/auth.module";
import {HttpModule} from "@nestjs/axios";

@Module({
    controllers: [WhisperServerController],
    providers: [WhisperServerService],
    exports: [WhisperServerService],
    imports: [
        HttpModule,
        forwardRef(() => AuthModule)
    ]
})
export class WhisperServerModule {}
