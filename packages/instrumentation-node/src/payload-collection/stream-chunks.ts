// for body with at most this length, full body will be captured.
// for large body with more than this amount of bytes, we will
// collect at least this amount of bytes, but might truncate after it
export const MIN_COLLECTED_BODY_LENGTH = 524288;

export class StreamChunks {
    chunks: String[] | Buffer[];
    length: number;

    constructor() {
        this.chunks = [];
        this.length = 0;
    }

    addChunk(chunk: any) {
        if (this.length >= MIN_COLLECTED_BODY_LENGTH) return;

        const chunkLength = chunk?.length;
        if (!chunkLength) return;

        this.chunks.push(chunk);
        this.length += chunkLength;
    }

    getBody(): string {
        return this.chunks.join('');
    }
}
