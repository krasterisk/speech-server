import {
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    Query,
    BadRequestException,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { WhisperServerService } from './whisper-server.service';

@ApiTags('Whisper Server')
@Controller('whisper')
export class WhisperServerController {
    constructor(private readonly whisperService: WhisperServerService) {}

    @Post('recognize')
    @ApiResponse({ status: 200, description: 'Speech recognition result' })
    @ApiQuery({ name: 'encode', required: false, type: Boolean })
    @ApiQuery({ name: 'task', required: false, enum: ['transcribe', 'translate'] })
    @ApiQuery({ name: 'language', required: false, type: String })
    @ApiQuery({ name: 'output', required: false, enum: ['txt', 'vtt', 'srt', 'tsv', 'json'] })
    @ApiQuery({ name: 'initial_prompt', required: false, type: String })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @UseInterceptors(FileInterceptor('audio'))
    async recognizeSpeech(
        @UploadedFile() file: Express.Multer.File,
        @Query('encode') encode?: string,
        @Query('task') task?: 'transcribe' | 'translate',
        @Query('language') language?: string,
        @Query('output') output?: 'txt' | 'vtt' | 'srt' | 'tsv' | 'json',
        @Query('initial_prompt') initial_prompt?: string,
    ): Promise<any> {
        if (!file) throw new BadRequestException('No audio file uploaded');

        const options = {
            encode: encode !== 'false',
            task,
            language,
            output,
            initial_prompt,
        };

        return await this.whisperService.processAudio(file.buffer, file.mimetype, options);
    }
}
