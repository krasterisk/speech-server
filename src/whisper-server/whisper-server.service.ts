import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';

export interface WhisperOptions {
    encode?: boolean;
    task?: 'transcribe' | 'translate';
    language?: string;
    output?: 'txt' | 'vtt' | 'srt' | 'tsv' | 'json';
    initial_prompt?: string;
}

@Injectable()
export class WhisperServerService {
    constructor(private readonly http: HttpService) { }

    async processAudio(
        buffer: Buffer,
        mimeType = 'audio/wav',
        options: WhisperOptions = {},
    ): Promise<any> {
        const {
            encode = true,
            task = 'transcribe',
            language = 'ru',
            output = 'json',
            initial_prompt = '',
        } = options;

        const formData = new FormData();
        formData.append('audio_file', buffer, {
            filename: `audio.${mimeType.split('/')[1] || 'wav'}`,
            contentType: mimeType,
        });

        const queryParams = new URLSearchParams({
            encode: String(encode),
            task,
            language,
            output,
        });

        if (initial_prompt) queryParams.append('initial_prompt', initial_prompt);

        const url = `http://whisper:9000/asr?${queryParams.toString()}`;

        try {
            const response = await firstValueFrom(
                this.http.post(url, formData, {
                    headers: formData.getHeaders(),
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    timeout: 300000, // 5 минут — Whisper может долго обрабатывать большие файлы
                }),
            );

            // Whisper может вернуть text либо полный JSON
            return response.data?.text
                ? { text: response.data.text }
                : response.data;
        } catch (err) {
            const status = err?.response?.status || 500;
            const responseData = err?.response?.data || err?.message || 'Unknown error';
            console.error(`Whisper recognition error [${status}]:`, responseData);
            throw new HttpException(
                `Whisper recognition failed: ${typeof responseData === 'string' ? responseData : JSON.stringify(responseData)}`,
                status,
            );
        }
    }
}
