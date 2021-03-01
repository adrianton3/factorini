(() => {
    'use strict'

    function stringify (data) {
        if (typeof data === 'number') {
            return String(data)
        }

        if (typeof data === 'boolean') {
            return data ? 't' : 'f'
        }

        if (typeof data === 'object') {
            if (data.type === 'escape') {
                return `\\ ${data.token}`
            }

            if (data.type === 'word') {
                return `: ${data.name} ${data.signature.map(stringify).join(' ')} ${data.body.map(stringify).join(' ')} ;`
            }

            if (data.type === 'quote') {
                return `[ ${data.body.map(stringify).join(' ')} ]`
            }

            if (data.type === 'list') {
                return `{ ${data.items.map(stringify).join(' ')} }`
            }
        }

        return data
    }

    function equals (a, b) {
        if (typeof a !== typeof b) {
            return false
        }

        if (typeof a === 'number' || typeof a === 'boolean') {
            return a === b
        }

        if (a.type !== b.type) {
            return false
        }

        if (a.type === 'list') {
            if (a.items.length !== b.items.length) {
                return false
            }

            return a.items.every((item, index) => equals(item, b.items[index]))
        }

        if (a.type === 'word' || a.type === 'quote') {
            if (a.body.length !== b.body.length) {
                return false
            }

            return a.body.every((item, index) => equals(item, b.items[index]))
        }

        if (a.type === 'native') {
            return a.body === b.body
        }

        return true
    }

    Object.assign(window.st, {
        stringify,
        equals,
    })
})()