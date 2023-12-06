import { inputPath, readLines, asyncSum } from "./common.js"

const defaultFilePath = inputPath("day4.txt");

export async function part1(filePath = defaultFilePath) {
    return await asyncSum(getAllPoints(readLines(filePath)));
}

async function* getAllPoints(lines: AsyncIterable<string>) {
    for await (const line of lines) {
        yield getPoints(getWinCount(line));
    }
}

function getWinCount(line: string) {
    const { win, scratch } = line.match(/:(?<win>[\d\s]+)\|(?<scratch>[\d\s]+)/)!.groups!;
    const winningNums = new Set([...win.matchAll(/\d+/g)].map(m => m[0]));
    return [...scratch.matchAll(/\d+/g)].filter(m => winningNums.has(m[0])).length;
}

function getPoints(winCount: number) {
    return winCount && 2 ** (winCount - 1);
}