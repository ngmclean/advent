import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import * as readline from "readline";

export function inputPath(relativePath: string) {
    return path.join(fileURLToPath(new URL("input", import.meta.url)), relativePath);
}

export function readLines(filePath: string): AsyncIterable<string> {
    const stream = fs.createReadStream(filePath);
    return readline.createInterface(stream);
}

export async function asyncSum(values: AsyncIterable<number>) {
    let sum = 0;
    for await (const value of values) {
        sum += value;
    }
    return sum;
}