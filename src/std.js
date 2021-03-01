(() => {
    'use strict'

    const std = new Map

    function add (name, body) {
        std.set(name, { type: 'native', body })
    }

    add('+', (stack) => {
        stack.push(stack.pop() + stack.pop())
    })

    add('-', (stack) => {
        const top = stack.pop()
        stack.push(stack.pop() - top)
    })

    add('*', (stack) => {
        stack.push(stack.pop() * stack.pop())
    })

    add('/', (stack) => {
        const top = stack.pop()
        stack.push(Math.floor(stack.pop() / top))
    })

    add('mod', (stack) => {
        const top = stack.pop()
        stack.push(stack.pop() % top)
    })

    add('dup', (stack) => {
        stack.push(stack[stack.length - 1])
    })

    add('drop', (stack) => {
        stack.pop()
    })

    add('swap', (stack) => {
        const temp = stack[stack.length - 2]
        stack[stack.length - 2] = stack[stack.length - 1]
        stack[stack.length - 1] = temp
    })

    add('over', (stack) => {
        stack.push(stack[stack.length - 2])
    })

    add('dupd', (stack) => {
        stack.push(stack[stack.length - 1])
        stack[stack.length - 2] = stack[stack.length - 3]
    })

    add('swapd', (stack) => {
        const temp = stack[stack.length - 3]
        stack[stack.length - 3] = stack[stack.length - 2]
        stack[stack.length - 2] = temp
    })

    add('nip', (stack) => {
        stack[stack.length - 2] = stack[stack.length - 1]
        stack.pop()
    })

    add('rot', (stack) => {
        const temp = stack[stack.length - 3]
        stack[stack.length - 3] = stack[stack.length - 2]
        stack[stack.length - 2] = stack[stack.length - 1]
        stack[stack.length - 1] = temp
    })

    add('clear', (stack) => {
        stack.length = 0
    })

    add('.', (stack, namespace, output) => {
        output(st.stringify(stack.pop()))
    })

    add('.s', (stack, namespace, output) => {
        output(stack.map(st.stringify).join(' '))
    })

    add('=', (stack) => {
        stack.push(st.equals(stack.pop(), stack.pop()))
    })

    add('<', (stack) => {
        const a = stack.pop()
        const b = stack.pop()

        stack.push(
            typeof a === 'number' && typeof b === 'number' ?
            a > b :
            false
        )
    })

    add('>', (stack) => {
        const a = stack.pop()
        const b = stack.pop()

        stack.push(
            typeof a === 'number' && typeof b === 'number' ?
            a < b :
            false
        )
    })

    add('call', (stack, namespace, output, ev) => {
        ev(stack.pop().body)
    })

    add('bi', (stack, namespace, output, ev) => {
        const quote1 = stack.pop()
        const quote2 = stack.pop()

        const data = stack[stack.length - 1]
        ev(quote1.body)

        stack.push(data)
        ev(quote2.body)
    })

    add('if', (stack, namespace, output, ev) => {
        const alternate = stack.pop()
        const consequent = stack.pop()
        const test = stack.pop()

        ev(test !== false ? consequent.body : alternate.body)
    })

    add('if*', (stack, namespace, output, ev) => {
        const alternate = stack.pop()
        const consequent = stack.pop()
        const test = stack[stack.length - 1]

        ev(test !== false ? consequent.body : alternate.body)
    })

    add('when', (stack, namespace, output, ev) => {
        const consequent = stack.pop()
        const test = stack.pop()

        if (test !== false) {
            ev(consequent.body)
        }
    })

    add('when*', (stack, namespace, output, ev) => {
        const consequent = stack.pop()
        const test = stack[stack.length - 1]

        if (test !== false) {
            ev(consequent.body)
        }
    })

    add('each-integer', (stack, namespace, output, ev) => {
        const quote = stack.pop()
        const count = stack.pop()

        for (let i = 0; i < count; i++) {
            stack.push(i)
            ev(quote.body)
        }
    })

    add('each', (stack, namespace, output, ev) => {
        const quote = stack.pop()
        const list = stack.pop()

        list.items.forEach((item) => {
            stack.push(item)
            ev(quote.body)
        })
    })

    add('map', (stack, namespace, output, ev) => {
        const quote = stack.pop()
        const list = stack.pop()

        const items = list.items.map((item) => {
            stack.push(item)
            ev(quote.body)
            return stack.pop()
        })

        stack.push({ type: 'list', items })
    })

    add('filter', (stack, namespace, output, ev) => {
        const quote = stack.pop()
        const list = stack.pop()

        const items = list.items.filter((item) => {
            stack.push(item)
            ev(quote.body)
            return stack.pop() !== false
        })

        stack.push({ type: 'list', items })
    })

    add('reduce', (stack, namespace, output, ev) => {
        const quote = stack.pop()
        const init = stack.pop()
        const list = stack.pop()

        stack.push(
            list.items.reduce((prev, item) => {
                stack.push(prev, item)
                ev(quote.body)
                return stack.pop()
            }, init)
        )
    })

    add('see', (stack, namespace, output) => {
        const name = stack.pop().token

        if (namespace.has(name)) {
            output(st.stringify(namespace.get(name)))
        } else {
            output('--')
        }
    })

    Object.assign(window.st, {
        std,
    })
})()