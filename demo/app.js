(() => {
    'use strict'

    const elements = {
        input: document.getElementById('input'),
        output: document.getElementById('output'),
    }

    const parts = []
    let outputFirst = true

    const runtime = st.makeRuntime({
        output (data) {
            parts.push(data)
        },
        end () {
            if (outputFirst) {
                elements.output.value = 'Factorini\n\n'
                outputFirst = false
                return
            }

            if (parts.length > 0) {
                const string = parts.join('')

                if (string.length > 0) {
                    elements.output.value += `${string}\n`
                }
            }

            parts.length = 0
        },
    })

    let inputLast = ''

    elements.input.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()

            const source = elements.input.value
            if (source.length > 0) {
                if (source.trim() === 'test') {
                    printTests()
                    return
                }

                inputLast = source
                runtime.more(source)
                elements.input.value = ''
            }

            return
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault()

            elements.input.value = inputLast

            return
        }
    })

    function printTests () {
        const testLengthMax = Math.max(...st.tests.map((entry) => entry[0].length))

        elements.output.value += [
            'Type "test" to re-print the test cases',
            '',
            'Test input/output pairs:',
            '',
            ...st.tests.map(([source, output]) => `${source.padEnd(testLengthMax, ' ')}  =>  ${output}`)
        ].join('\n')
    }

    elements.output.value = 'Factorini\n\n'

    printTests()
})()