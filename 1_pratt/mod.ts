/*
    https://martin.janiczek.cz/2023/07/03/demystifying-pratt-parsers.html
*/

type Token = TNum | TOp;

interface TNum {
    type: 'TNum';
    value: number;
}

interface TOp {
    type: 'TOp';
    op: Binop;
}

type Binop = 'Add' | 'Sub' | 'Mul' | 'Div' | 'Pow';

type Expr = Num | Op;

interface Num {
    type: 'Num';
    value: number;
}

interface Op {
    type: 'Op';
    left: Expr;
    op: Binop;
    right: Expr;
}

const exampleTokens: Token[] = [
    { type: 'TNum', value: 1 },
    { type: 'TOp', op: 'Add' },
    { type: 'TNum', value: 2 },
    { type: 'TOp', op: 'Sub' },
    { type: 'TNum', value: 3 },
    { type: 'TOp', op: 'Mul' },
    { type: 'TNum', value: 4 },
    { type: 'TOp', op: 'Add' },
    { type: 'TNum', value: 5 },
    { type: 'TOp', op: 'Div' },
    { type: 'TNum', value: 6 },
    { type: 'TOp', op: 'Pow' },
    { type: 'TNum', value: 7 },
    { type: 'TOp', op: 'Sub' },
    { type: 'TNum', value: 8 },
    { type: 'TOp', op: 'Mul' },
    { type: 'TNum', value: 9 }
];

/**
 * Larger precedence means higher priority when chomping operations.
 */
function precedence(binop: Binop): number {
    switch (binop) {
        case 'Add':
        case 'Sub':
            return 1;
        case 'Mul':
        case 'Div':
            return 2;
        case 'Pow':
            return 3;
    }
}

/**
 * Our top-level parser. The user doesn't care about the rest of the tokens
 * so we throw these away.
 */
function parse(tokens: Token[]): Expr | null {
    const result = pratt(0, tokens);
    return result ? result[0] : null;
}

/**
 * We're only parsing a simplified language, but in a more real-world one
 * you'd also have things like -5, !False and (1+3).
 */
function prefix(tokens: Token[]): [Expr, Token[]] | null {
    if (tokens.length === 0) {
        return null;
    }
    const [token, ...rest] = tokens;
    if (token.type === 'TNum') {
        return [{ type: 'Num', value: token.value }, rest];
    }
    return null;
}

/**
 * Parse a prefix expression then run the loop.
 */
function pratt(precLimit: number, tokens: Token[]): [Expr, Token[]] | null {
    const prefixResult = prefix(tokens);
    if (!prefixResult) {
        return null;
    }
    const [left, tokensAfterPrefix] = prefixResult;
    return prattLoop(precLimit, left, tokensAfterPrefix);
}

function prattLoop(precLimit: number, left: Expr, tokensAfterLeft: Token[]): [Expr, Token[]] | null {
    if (tokensAfterLeft.length === 0) {
        return [left, tokensAfterLeft];
    }

    const [token, ...tokensAfterOp] = tokensAfterLeft;

    if (token.type === 'TOp') {
        const opPrec = precedence(token.op);

        if (opPrec > precLimit) {
            const rightResult = pratt(opPrec, tokensAfterOp);
            if (rightResult) {
                const [right, tokensAfterRight] = rightResult;
                const newLeft: Op = {
                    type: 'Op',
                    left,
                    op: token.op,
                    right
                };
                return prattLoop(precLimit, newLeft, tokensAfterRight);
            }
            return null;
        }
    }

    return [left, tokensAfterLeft];
}

console.log(parse(exampleTokens))
