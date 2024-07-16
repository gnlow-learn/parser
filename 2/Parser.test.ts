import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { Parser } from "./Parser.ts"

Deno.test("Parser.parse - basic", () => {
    assertEquals(
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
        ]),
        [
            [
                "<expr>",
                [
                    "<expr>",
                    [ "<expr>", [ "n", "1" ] ],
                    [ "<0op>", [ "DIV" ] ],
                    [ "<expr>", [ "n", "2" ] ]
                ],
                [ "<0op>", [ "MUL" ] ],
                [ "<expr>", [ "n", "3" ] ]
            ]
        ]
    )
})
