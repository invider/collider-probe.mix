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
        onSelect(item, i) {
            log('selected #' + i + ': ' + item)

            switch(i) {
                case 2:
                    this.selectFrom({
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
                        ],
                    })
                    break
            }
        },

        showBackground: false,
    })
    lab.control.player.bindAll(menu)
}
