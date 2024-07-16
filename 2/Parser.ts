import { Word } from "./Word.ts"

type Tree = Word | [string, ...Tree[]]

export class Parser {
    rule
    constructor(rule: Record<string, string>) {
        this.rule = rule
    }

    parse(words: Word[]): Tree[] {
        const list: string[] = []
        const input = words.map((word, i) => {
            return word[0] + i
        }).join(" ")
        let output = input
        let prev = output

        while (true) {
            for (const [from, to] of Object.entries(this.rule)) {
                prev = output
                const regex = new RegExp(
                    from
                        .split(" ")
                        .map(x => x + "\\d*")
                        .join(" "),
                )
                output = output.replace(regex, match => {
                    // console.log(`[${from} -> ${to}]`)
                    // console.log(output, "\n")
                    list.push(match)
                    return to + (words.length + list.length - 1)
                })
                if (prev != output) break
            }
            if (prev == output) break
        }

        const makeTree = (id: string): Tree[] => {
            const index = Number(id.match(/\d+$/)?.[0] || -1)
            if (index == -1) return [[id]]

            const type = id.match(/^(.*[^\d]+)\d+$/)![1]

            if (index < words.length) {
                return [words[index]]
            } else {
                const result =
                    list[index - words.length]
                        .split(" ")
                        .flatMap(makeTree)
                if (type[0] < "Z") {
                    return [[
                        type,
                        ...result,
                    ]]
                } else {
                    return result
                }
            }
        }

        return output
            .split(" ")
            .flatMap(makeTree)
    }

    static parse(rule: Record<string, string>) {
        const parser = new Parser(rule)
        return parser.parse.bind(parser)
    }
}
