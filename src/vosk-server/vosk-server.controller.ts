import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import { VoskServerService } from "./vosk-server.service";
import { VoskDockerService } from "./vosk-docker.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiResponse } from "@nestjs/swagger";
import { Roles } from "../auth/roles-auth.decorator";
import { RolesGuard } from "../auth/roles.guard";


@Controller('vosk')
export class VoskServerController {

    constructor(
        private readonly voskService: VoskServerService,
        private readonly voskDockerService: VoskDockerService
    ) { }

    @Post('recognize')
    @ApiResponse({ status: 200 })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @UseInterceptors(FileInterceptor('audio'))
    async recognizeSpeech(@UploadedFile() file: Express.Multer.File): Promise<{ text: string }> {
        if (!file) {
            throw new Error('No file uploaded');
        }

        // We can pass the buffer directly to the Docker service without writing to disk
        const recognizedText = await this.voskDockerService.processAudio(file.buffer);
        return recognizedText;
    }

    @Post('recognize-docker')
    @ApiResponse({ status: 200, description: 'Speech recognition result from Docker Vosk container' })
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @UseInterceptors(FileInterceptor('audio'))
    async recognizeSpeechDocker(@UploadedFile() file: Express.Multer.File): Promise<{ text: string }> {
        if (!file) {
            throw new Error('No file uploaded');
        }

        // We can pass the buffer directly to the new service without writing to disk
        const recognizedText = await this.voskDockerService.processAudio(file.buffer);
        return recognizedText;
    }
}
