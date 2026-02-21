import { Injectable, Logger } from '@nestjs/common';
import WebSocket from 'ws';

@Injectable()
export class VoskDockerService {
    private readonly logger = new Logger(VoskDockerService.name);
    // Use environment variable or default to the Docker service name 'vosk'
    private readonly wsUrl = process.env.VOSK_WS_URL || 'ws://vosk:2700';

    async processAudio(audioBuffer: Buffer): Promise<{ text: string }> {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(this.wsUrl);
            let finalResult = '';

            ws.on('open', () => {
                this.logger.debug(`Connected to Vosk WebSocket server at ${this.wsUrl}`);
                // Send the audio file as binary
                ws.send(audioBuffer);
                // Send EOF to signal end of stream
                ws.send(JSON.stringify({ eof: 1 }));
            });

            ws.on('message', (data: WebSocket.Data) => {
                const response = JSON.parse(data.toString());
                if (response.result || response.text) {
                    // Usually Vosk sends partial results, then a final result with 'text'
                    if (response.text !== undefined) {
                        finalResult = response.text;
                        ws.close();
                        resolve({ text: finalResult });
                    }
                }
            });

            ws.on('error', (err) => {
                this.logger.error(`Vosk WebSocket error: ${err.message}`, err.stack);
                reject(err);
            });

            ws.on('close', (code, reason) => {
                // If the connection closes before resolving
                this.logger.debug(`Vosk WebSocket closed: ${code} ${reason}`);
                resolve({ text: finalResult });
            });
        });
    }
}
