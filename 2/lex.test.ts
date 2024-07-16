import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { Lexer } from "./lex.ts"

Deno.test("Lexer.print - basic arithmetic", () => {
    assertEquals(
        Lexer.print("1.25 + 2"),
        "num(1.25) + num(2)",
    )
})

Deno.test("Lexer.print - indent", () => {
    assertEquals(
        Lexer.print(
            "hello\n" +
            "   world(2)"
        ),
        "id(hello) NL INDENT id(world) ( num(2) ) DEDENT",
    )
})