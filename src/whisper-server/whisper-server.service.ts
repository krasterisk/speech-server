import { Injectable } from '@nestjs/common';
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
    constructor(private readonly http: HttpService) {}

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

        const url = `http://127.0.0.1:9000/asr?${queryParams.toString()}`;

        try {
            const response = await firstValueFrom(
                this.http.post(url, formData, {
                    headers: formData.getHeaders(),
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                }),
            );

            // Whisper может вернуть text либо полный JSON
            return response.data?.text
                ? { text: response.data.text }
                : response.data;
        } catch (err) {
            console.error('Whisper recognition error:', err?.message || err);
            throw new Error('Whisper recognition failed');
        }
    }
}
