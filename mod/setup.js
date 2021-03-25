function setup() {
    const menu = lab.spawn(dna.hud.Menu, {
        name: 'menu',
        x: 0,
        y: 0,
        w: ctx.width,
        h: ctx.height,

        items: [
            'one',
            'two',
            'sub-menu',
            {
                title: 'sound',
                options: [ 'on', 'off', 'unknown', ],
            },
            [ 'easy', 'medium', 'hard', ],
        ],
        onSelect(menu, item, i) {
            log('selected #' + i + ': ' + item.title)
            menu.save()

            switch(i) {
                case 2:
                    menu.selectFrom({
                        items: [
                            {
                                title: 'option-1',
                                action: function(menu) {
                                    log('aciton on option 1')
                                },
                            },
                            {
                                title: 'option-2',
                                action: function(menu) {
                                    log('aciton on option 2')
                                },
                            },
                            'option-3',
                            'option-4',
                            {
                                title: 'back',
                                action: function(menu) {
                                    log('going back!')
                                    menu.restore()
                                },
                            },
                        ],
                        onSelect(menu, item, i) {
                            log('another select: ' + item.title)
                        },
                    })
                    break
            }
        },
    })

    menu.show()
}
