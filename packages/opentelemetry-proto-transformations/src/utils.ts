import * as api from '@opentelemetry/api';

export function hexToBytesArray(hexStr: string): Uint8Array {
    const hexStrLen = hexStr.length;
    let bytesArray: number[] = [];
    for (let i = 0; i < hexStrLen; i += 2) {
        const hexPair = hexStr.substring(i, i + 2);
        const hexVal = parseInt(hexPair, 16);
        bytesArray.push(hexVal);
    }
    return Uint8Array.from(bytesArray);
}

export function bytesArrayToHex(bytes: Uint8Array): string {
    return Array.from(bytes, (byte) => {
        return ('0' + (byte & 0xff).toString(16)).slice(-2);
    }).join('');
}

const NANOSECOND_DIGITS = 9;
const SECOND_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS);

export function nanosecondsToHrTime(nanosecondsTime: number): api.HrTime {
    return [Math.floor(nanosecondsTime / SECOND_TO_NANOSECONDS), nanosecondsTime % SECOND_TO_NANOSECONDS];
}
