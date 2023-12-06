import { max, group } from "radash";
import { inputPath, readLines, asyncSum } from "./common.js"

type Bag = { [color: string]: number };

const defaultFilePath = inputPath("day2.txt");
const defaultBag: Bag = { red: 12, green: 13, blue: 14 };

export async function part1(filePath = defaultFilePath, bag = defaultBag) {
    return await asyncSum(possibleGames());

    async function* possibleGames() {
        for await (const line of readLines(filePath)) {
            const { id, samples } = line.match(/game (?<id>\d+):(?<samples>.*)/i)!.groups!;
            if (samplesFitBag(samples, bag)) {
                yield parseInt(id);
            }
        }
    }
}

export async function part2(filePath = defaultFilePath) {
    return await asyncSum(bagPowers());

    async function* bagPowers() {
        for await (const line of readLines(filePath)) {
            const samples = line.split(":")[1];
            yield Object.values(smallestPossibleBag(samples))
                .reduce((a, b) => a * b);
        }
    }
}

function samplesFitBag(samples: string, bag: Bag) {
    return getColorCounts(samples)
        .every(([color, counts]) => counts.every(c => c <= bag[color]));
}

function smallestPossibleBag(samples: string) : Bag {
    return Object.fromEntries(
        getColorCounts(samples)
            .map(([color, counts]) => [color, max(counts)!])
    );
}

function getColorCounts(samples: string) {
    const allMatches =
        [...samples.matchAll(/(?<count>\d+) (?<color>[a-z]+)(,|;|$)/gi)]
            .map(m => m.groups! as { color: string, count: string });
    const colorGroups = group(allMatches, g => g.color);
    return Object.entries(colorGroups)
        .map(([color, matches]) => [color, matches!.map(g => parseInt(g.count))] as const);
}