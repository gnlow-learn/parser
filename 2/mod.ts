`
a:
    b: 1
    c: 2

id colon indent
    id colon expr nl
    id colon expr nl
dedent
`

const input = `
    id colon indent
        id colon expr nl
        id colon expr nl
    dedent
`.trim().replaceAll(/\s+/g, " ")//.split(" ")

const map = {
    "id colon expr": "expr",
    "expr nl expr": "expr",
    "expr nl": "expr",
    "indent expr dedent": "expr",
}

let output = input
let prev = output
const list = []
console.log(Object.entries(map))

while (true) {
    for (const [from, to] of Object.entries(map)) {
        prev = output
        const regex = new RegExp(
            from
                .split(" ")
                .map(x => x + "\\d*")
                .join(" "),
        )
        output = output.replace(regex, match => {
            console.log(`[${from} -> ${to}]`)
            console.log(output, "\n")
            list.push(match)
            return to + (list.length - 1)
        })
        if (prev != output) break
    }
    if (prev == output) break
}

console.log(output)
