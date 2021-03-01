(() => {
    'use strict'

    function run (program, { stack, namespace }, output) {
        function ev (body) {
            if (typeof body === 'function') {
                body(stack, namespace, output, ev)
                return
            }

            for (const object of body) {
                if (object === 'end') {
                    return // unwind the whole tower
                }

                if (typeof object === 'number' || typeof object === 'boolean') {
                    stack.push(object)
                    continue
                }

                if (typeof object === 'object') {
                    if (object.type === 'list' || object.type === 'quote') {
                        stack.push(object)
                        continue
                    }

                    if (object.type === 'escape') {
                        // stack.push(object.token)
                        stack.push(object)
                        continue
                    }

                    if (object.type === 'native') {
                        stack.push(object)
                        continue
                    }

                    continue
                }

                if (namespace.has(object)) {
                    ev(namespace.get(object).body)
                    continue
                }
            }
        }

        ev(program)
    }

    function makeRuntime ({ output, end }) {
        const state = {
            stack: [],
            namespace: new Map(st.std.entries()),
        }

        return {
            more (source) {
                const tokenized = st.tokenize(source)
                const parsed = st.parse(tokenized)

                for (const [key, value] of parsed.namespace) {
                    state.namespace.set(key, value)
                }

                run(parsed.program, state, output)

                if (end != null) {
                    end()
                }
            }
        }
    }

    Object.assign(window.st, {
        makeRuntime,
    })
})()