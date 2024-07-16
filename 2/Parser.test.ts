import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { Parser } from "./Parser.ts"

Deno.test("Parser.parse - basic", () => {
    assertEquals(
        Parser.parse({
            "Mul": "opA",
            "Div": "opA",
            "Add": "opB",
            "Sub": "opB",
            "expr opA expr": "BinExpr",
            "expr opB expr": "BinExpr",
            "Num": "expr",
            "BinExpr": "expr",
        })([
            ["Num", "1"],
            ["Div"],
            ["Num", "2"],
            ["Mul"],
            ["Num", "3"],
        ]),
        [[
            "BinExpr",
            [
                "BinExpr",
                ["Num", "1"],
                ["Div"],
                ["Num", "2"],
            ],
            ["Mul"],
            ["Num", "3"],
        ]]
    )
})
