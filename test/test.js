(() => {
    'use strict'

    const entries = [
        ['11 23 + .', '34'],
        ['11 22 33 + .s', '11 55'],
        ['11 22 { 33 { 44 55 } } .', '{ 33 { 44 55 } }'],
        ['11 22 dup .s', '11 22 22'],
        ['11 22 33 drop .s', '11 22'],
        ['11 22 swap .s', '22 11'],
        ['11 22 33 over .s', '11 22 33 22'],
        ['11 22 33 dupd .s', '11 22 22 33'],
        ['11 22 33 swapd .s', '22 11 33'],
        ['11 22 33 nip .s', '11 33'],
        ['11 22 33 rot .s', '22 33 11'],
        ['11 22 33 clear .s', ''],
        ['11 11 = .s', 't'],
        ['11 22 = .s', 'f'],
        ['f f = .s', 't'],
        ['{ 11 { 22 33 } } { 11 22 33 } = .s', 'f'],
        ['{ 11 { 22 33 } } { 11 { 22 44 } } = .s', 'f'],
        ['{ 11 { 22 33 } } { 11 { 22 33 } } = .s', 't'],
        ['11 22 < .s', 't'],
        ['11 22 > .s', 'f'],
        ['t [ 11 ] [ 22 ] if .s', '11'],
        ['f [ 11 ] [ 22 ] if .s', '22'],
        ['f [ 11 ] [ 22 ] if* .s', 'f 22'],
        ['t [ 11 ] when .s', '11'],
        ['f [ 11 ] when .s', ''],
        ['t [ 11 ] when* .s', 't 11'],
        [': sq ( a -- b ) dup * ; 11 sq .', '121'],
        [': sq ( a -- b ) dup * ; : cb ( a -- b ) dup sq * ; 11 cb .', '1331'],
        ['11 [ . ] call', '11'],
        ['11 22 [ .s ] [ .s ] bi', '11 22 11 22 22'],
        ['5 [ . ] each-integer', '0 1 2 3 4'],
        ['{ 11 { 22 33 } } [ . ] each', '11 { 22 33 }'],
        ['{ { 11 22 } { 33 44 } } [ . ] each', '{ 11 22 } { 33 44 }'],
        ['{ 11 22 } [ 1 + ] map .', '{ 12 23 }'],
        ['{ 11 22 } [ 33 55 ] map .s', '11 33 22 33 { 55 55 }'],
        ['{ 11 22 33 44 } [ 25 > ] filter .s', '{ 33 44 }'],
        ['{ 11 22 33 } 0 [ + ] reduce .s', '66'],
        [': sq ( a -- b ) dup * ; \\ sq see', ': sq ( a -- b ) dup * ;']
    ]

    entries.forEach(([source, expected]) => {
        const actualParts = []
        const runtime = st.makeRuntime({ output (data) { actualParts.push(data) } })
        runtime.more(source)

        const actual = actualParts.join(' ')
        if (actual !== expected) {
            throw { source, actual, expected }
        }
    })

    Object.assign(window.st, {
        tests: entries,
    })
})()