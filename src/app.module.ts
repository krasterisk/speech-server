import {Module} from "@nestjs/common";
import {UsersModule} from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import {RolesModule} from './roles/roles.module';
import {AuthModule} from './auth/auth.module';
import {FilesModule} from './files/files.module';
import * as path from 'path';
import { WsServerModule } from './ws-server/ws-server.module';
import { VoskServerModule } from './vosk-server/vosk-server.module';
import {SequelizeModule} from "@nestjs/sequelize";
import {ServeStaticModule} from "@nestjs/serve-static";
import {getMysqlConfig} from "./config/mysql.config";
import { WhisperServerService } from './whisper-server/whisper-server.service';
import { WhisperServerController } from './whisper-server/whisper-server.controller';
import { WhisperServerModule } from './whisper-server/whisper-server.module';


@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, 'static'),
        }),
        SequelizeModule.forRootAsync({
            useFactory: getMysqlConfig
        }),
        UsersModule,
        RolesModule,
        AuthModule,
        FilesModule,
//        WsServerModule,
        VoskServerModule,
        WhisperServerModule
    ]
})

export class AppModule {}
