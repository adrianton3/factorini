(() => {
    'use strict'

    function makeToken (source) {
        if (/^\d+$/.test(source)) {
            return Number(source)
        }

        if (source === 't') {
            return true
        }

        if (source === 'f') {
            return false
        }

        return source
    }

    function makeList (list) {
        let index = 0

        return {
            hasNext () { return index < list.length },
            current () { return list[index] },
            advance () { if (index < list.length) { index++ } },
        }
    }

    function tokenize (source) {
        const tokens = source.split(/\s+/).map(makeToken)
        tokens.push('end')

        return makeList(tokens)
    }

    function parse (tokens) {
        const namespace = new Map

        function parseWord () {
            const signature = []

            tokens.advance()

            const name = tokens.current()
            tokens.advance()

            if (tokens.current() === '(') {
                signature.push(tokens.current())
                tokens.advance()

                while (tokens.hasNext()) {
                    signature.push(tokens.current())

                    if (tokens.current() === ')') {
                        tokens.advance()
                        break
                    }

                    tokens.advance()
                }
            }

            const body = df()

            return { type: 'word', name, body, signature }
        }

        function parseQuote () {
            const body = df()
            return { type: 'quote', body }
        }

        function parseList () {
            const items = df()
            return { type: 'list', items }
        }

        function df () {
            const body = []

            while (tokens.hasNext()) {
                const current = tokens.current()

                if (current === 'end') {
                    break
                } else if (current === ';' || current === ']' || current === '}') {
                    tokens.advance()
                    break
                } else if (current === ':') {
                    throw { message: 'cannot declare nested words' }
                } else if (current === '\\') {
                    tokens.advance()

                    body.push({ type: 'escape', token: tokens.current() })
                    tokens.advance()
                } else if (current === '[') {
                    tokens.advance()
                    body.push(parseQuote())
                } else if (current === '{') {
                    tokens.advance()
                    body.push(parseList())
                } else {
                    body.push(current)
                    tokens.advance()
                }
            }

            return body
        }

        const program = []
        while (tokens.hasNext()) {
            const current = tokens.current()

            if (current === ':') {
                const word = parseWord()
                namespace.set(word.name, word)
            } else if (current === '\\') {
                tokens.advance()

                program.push({ type: 'escape', token: tokens.current() })
                tokens.advance()
            } else if (current === '[') {
                tokens.advance()
                program.push(parseQuote())
            } else if (current === '{') {
                tokens.advance()
                program.push(parseList())
            } else {
                program.push(current)
                tokens.advance()
            }
        }

        return { program, namespace }
    }

    Object.assign(window.st, {
        tokenize,
        parse,
    })
})()