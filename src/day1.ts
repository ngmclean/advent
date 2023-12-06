import { min, max, zip, range } from "radash";
import { inputPath, readLines, asyncSum } from "./common.js"

const defaultFilePath = inputPath("day1.txt");

export async function part1(filePath = defaultFilePath) {
    return await asyncSum(getValues());

    async function* getValues() {
        for await (const line of readLines(filePath)) {
            const digits = [...line].map(c => parseInt(c)).filter(Number.isInteger);
            yield digits[0] * 10 + digits.slice(-1)[0];
        }
    }
}

const digitMap = new Map(
    [...range(1, 9, d => [d.toString(), d] as const)]
    .concat(
        zip(["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
            [...range(1, 9)])));

export async function part2(filePath = defaultFilePath) {
    return await asyncSum(getValues());

    async function* getValues() {
        for await (const line of readLines(filePath)) {
            const searchResults =
                [...digitMap.entries()]
                    .map(([name, digit]) => ({
                        firstIndex: line.indexOf(name),
                        lastIndex: line.lastIndexOf(name),
                        digit
                    }))
                    .filter(r => r.firstIndex != -1);

            const firstDigit = min(searchResults, r => r.firstIndex)!.digit;
            const lastDigit = max(searchResults, r => r.lastIndex)!.digit;
            yield firstDigit * 10 + lastDigit;
        }
    }
}