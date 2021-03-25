function setup() {
    const menu = lab.spawn(dna.hud.Menu, {
        x: 0,
        y: 0,
        w: ctx.width,
        h: ctx.height,

        items: [
            'one',
            'two',
            'three',
        ],
        onSelect(menu, item, i) {
            log('selected #' + i + ': ' + item)

            switch(i) {
                case 2:
                    menu.selectFrom({
                        items: [
                            {
                                name: 'option-1',
                                action: function(menu) {
                                    log('aciton on option 1')
                                },
                            },
                            {
                                name: 'option-2',
                                action: function(menu) {
                                    log('aciton on option 2')
                                },
                            },
                            'option-3',
                            'option-4',
                        ],
                        onSelect(item, i) {
                            log('another select: ' + item)
                        },
                    })
                    break
            }
        },
    })

    menu.show()
}
