import { Word } from "./Word.ts"

export class Lexer {
    input
    pos = 0
    indents: number[] = []
    constructor(input: string) {
        this.input = input
    }
    look(): string {
        return this.input[this.pos] || ""
    }
    take() {
        return this.input[this.pos++] || ""
    }
    read(matcher: RegExp) {
        let result = ""
        while (this.look().match(matcher)) {
            result += this.take()
        }
        return result
    }

    skipWS() {
        this.read(/[^\S\n]/)
    }
    readNumber() {
        let result = this.read(/\d/)
        if (this.look() == ".") {
            result += this.take()
            result += this.read(/\d/)
        }
        return result
    }
    readId() {
        return this.read(/[a-zA-Z]/)
    }
    readNL(): Word[] {
        this.take() // take \n
        const indent = this.read(/ /).length

        let prevIndent = this.indents[this.indents.length-1] || -1

        const result: Word[] = [["NL"]]

        if (prevIndent < indent) {
            result.push(["INDENT"])
            this.indents.push(indent)
        } else while (prevIndent > indent) {
            this.indents.pop()
            prevIndent = this.indents[this.indents.length] || -1
            result.push(["DEDENT"])
        }

        return result
    }

    getNextTokens(): Word[] | false {
        this.skipWS()

        const char = this.look()

        if (!char) {
            return false
        }

        if (char.match(/\d/)) {
            return [["num", this.readNumber()]]
        }
        if (char.match(/[a-zA-Z]/)) {
            return [["id", this.readId()]]
        }
        if (char.match(/\n/)) {
            return this.readNL()
        }

        if ("+-*/()".includes(char)) {
            return [[this.take()]]
        } else {
            throw new Error(`Unexpected ${char}`)
        }
    }

    static *lex(input: string) {
        const lexer = new Lexer(input)
        while (true) {
            const tokens = lexer.getNextTokens()
            if (!tokens) break
            yield* tokens
        }
        yield* lexer.indents.map(_ => ["DEDENT"])
    }
    static print(input: string) {
        return [...Lexer.lex(input)].map(([type, ...args]) => type + (
            args.length
                ? `(${args.join()})`
                : ""
        )).join(" ")
    }
}
