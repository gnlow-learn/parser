`
a:
    b: 1
    c: 2

id colon indent
    id colon expr nl
    id colon expr nl
dedent
`

class Lexer {
    input
    pos = 0
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
        this.read(/\s/)
    }
    readNumber() {
        let result = this.read(/\d/)
        if (this.look() == ".") {
            result += this.take()
            result += this.read(/\d/)
        }
        return result
    }

    getNextToken() {
        this.skipWS()

        const char = this.look()

        if (!char) {
            return false
        }

        if (char.match(/\d/)) {
            return ["num", this.readNumber()]
        }

        if ("+-*/()".includes(char)) {
            return [this.take()]
        } else {
            throw new Error(`Unexpected ${char}`)
        }
    }

    static *lex(input: string) {
        const lexer = new Lexer(input)
        while (true) {
            const token = lexer.getNextToken()
            if (!token) break
            yield token
        }
    }
}

console.log(
    ...Lexer.lex("1.25 + 2")
)
