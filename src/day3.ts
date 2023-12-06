import { inputPath, readLines, asyncSum } from "./common.js"

const defaultFilePath = inputPath("day3.txt");

export async function part1(filePath = defaultFilePath) {
    return await asyncSum(findAllPartNumbers(readLines(filePath)));
}

export async function part2(filePath = defaultFilePath) {
    return await asyncSum(findAllGearRatios(readLines(filePath)));
}

async function* findAllPartNumbers(lines: AsyncIterable<string>) {
    let previousLine: string | undefined;
    for await (const line of lines) {
        yield* findPartNumbers(line, line);
        if (previousLine) {
            yield* findPartNumbers(previousLine, line)
                .concat(findPartNumbers(line, previousLine));
        }
        previousLine = line;
    }
}

function findPartNumbers(numberLine: string, symbolLine: string) {
    const symbolIndexes = [...symbolLine.matchAll(/[^\d.]/g)].map(m => m.index!);
    const numberMatches = [...numberLine.matchAll(/\d+/g)];
    return numberMatches
        .filter(m => symbolIndexes.some(i => i >= m.index! - 1 && i <= m.index! + m[0].length))
        .map(m => parseInt(m[0]));
}

async function* findAllGearRatios(lines: AsyncIterable<string>) {
    let previousLine: string | undefined;
    let line: string | undefined;
    // buffer holds up to 3 lines in a rolling window, which is searched for adjacent numbers
    const buffer: string[] = [];
    for await (line of lines) {
        buffer.push(line);
        if (previousLine) {
            yield* findGearRatios(previousLine, buffer);
        }
        if (buffer.length == 3) {
            buffer.shift();
        }
        previousLine = line;
    }
    if (line) {
        yield* findGearRatios(line, buffer);
    }
}

function* findGearRatios(gearLine: string, numberLines: string[]) {
    const starIndexes = [...gearLine.matchAll(/\*/g)].map(m => m.index!);
    const numberMatches = numberLines.flatMap(line => [...line.matchAll(/\d+/g)]);
    for (var i of starIndexes) {
        const adjacentNumbers = numberMatches
            .filter(m => m.index! >= i - m[0].length && m.index! <= i + 1)
            .map(m => parseInt(m[0]));
        if (adjacentNumbers.length == 2) {
            const [p1, p2] = adjacentNumbers;
            yield p1 * p2;
        }
    }
}