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

        const makeTree = (id: string): Tree => {
            const index = Number(id.match(/\d+$/)?.[0] || -1)
            if (index == -1) return [id]

            const type = id.match(/^(.*[^\d]+)\d+$/)![1]
            return index < words.length
                ? words[index]
                : [
                    `<${type}>`,
                    ...list[index - words.length]
                        .split(" ")
                        .map(makeTree)
                ]
        }

        return output
            .split(" ")
            .map(makeTree)
    }

    static parse(rule: Record<string, string>) {
        const parser = new Parser(rule)
        return parser.parse.bind(parser)
    }
}
console.log(
Parser.parse({
    "MUL": "0op",
    "DIV": "0op",
    "ADD": "1op",
    "SUB": "1op",
    "expr 0op expr": "expr",
    "expr 1op expr": "expr",
    "n": "expr",
})([
    ["n", "1"],
    ["DIV"],
    ["n", "2"],
    ["MUL"],
    ["n", "3"],
])
)

/*
parse({
    "id colon expr": "expr",
    "expr nl expr": "expr",
    "expr nl": "expr",
    "indent expr dedent": "expr",
})(`
    id colon indent
        id colon expr nl
        id colon expr nl
    dedent
`.trim().replaceAll(/\s+/g, " "))

parse({
    "n MUL n": "n",
    "n DIV n": "n",
    "n ADD n": "n",
    "n SUB n": "n",
})("n DIV n MUL n") // wrong

parse({
    "MUL": "0op",
    "DIV": "0op",
    "ADD": "1op",
    "SUB": "1op",
    "n 0op n": "n",
    "n 1op n": "n",
})("n DIV n MUL n") // right

*/