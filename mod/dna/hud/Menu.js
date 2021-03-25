const ACTIVE = 1
const DISABLED = 0

const df = {
    x: 0,
    y: 0,
    w: 80,
    h: 40,
    step: 40,
    border: 2,
    IDLE: 20,
}

const defaultColors = {
    main:     hsl(.55, .1, .9),
    selected: hsl(.12, .5, .5),
    disabled: hsl(.55, .05, .25),
    section:  hsl(.55, .05, .4),
}

const defaultItems = [
    'provide',
    'items list',
    'for the constructor',
]

function isOption(item) {
    return (isObj(item) && item.options)
}

class Menu {

    constructor(st) {
        this.color = defaultColors
        this.items = defaultItems
        this.handlers = {}
        this.cache = []
        augment(this, df, st)
        this.normalizeItems()
    }

    normalizeItems() {
        if (!this.items) throw 'no menu items found!'
        this.items.forEach((item, i) => {
            if (isString(item)) {
                this.items[i] = {
                    __: this,
                    title: item,
                }

            } else if (isArray(item)) {
                // turn into options object
                const opt = {
                    options: [],
                    current: 0,
                }
                item.forEach(e => opt.options.push(e))
                this.items[i] = opt

            } else if (isObj(item)) {
                item.__ = this
                if (isOption(item)) {
                    if (!item.current) item.current = 0
                }
                if (item.init) {
                    item.init(this)
                }
            }
        })
        if (!this.items.current) this.items.current = 0
    }

    show() {
        this.hidden = false
        this.state = ACTIVE
        this.lastTouch = Date.now()
        lab.control.player.bindAll(this)
    }

    hide() {
        this.hidden = true
        this.state = DISABLED
        lab.control.player.unbindAll(this)
    }

    selectFrom(st) {
        this.items = st.items
        this.handlers = st.handlers || {}
        if (st.onSelect) this.handlers.onSelect = st.onSelect

        this.normalizeItems()

        this.slideToActiveItem()
        this.show()
    }

    slideToActiveItem() {
        const item = this.items[this.items.current]
        if (isObj(item) && item.section) {
            this.items.current ++
            if (this.items.current >= this.items.length) this.items.current = 0
            this.slideToActiveItem()
        }
    }

    next() {
        if (this.hidden) return
        this.items.current ++
        if (this.items.current >= this.items.length) this.items.current = 0

        const item = this.items[this.items.current]
        if (isObj(item) && (item.section || item.disabled)) {
            this.next()
        } else {
            // landed
            if (this.onMove) this.onMove(item)
            //sfx.play('select', env.mixer.level.select)
        }
        
    }

    prev() {
        if (this.hidden) return
        this.items.current --
        if (this.items.current < 0) this.items.current = this.items.length - 1

        const item = this.items[this.items.current]
        if (isObj(item) && (item.section || item.disabled)) {
            this.prev()
        } else {
            // landed
            if (this.onMove) this.onMove(item)
            //sfx.play('select', env.mixer.level.select)
        }
    }

    left() {
        if (this.hidden) return
        const item = this.currentItem()
        if (isOption(item)) {
            item.current --
            if (item.current < 0) item.current = item.options.length - 1
            if (this.onSwitch) this.onSwitch(item, this.items.current)
            if (item.sync) item.sync()
            //sfx.play('apply', env.mixer.level.switch)
        }
        if (this.onMove) this.onMove(item)
    }

    right() {
        if (this.hidden) return
        const item = this.currentItem()
        if (isOption(item)) {
            item.current ++
            if (item.current >= item.options.length) item.current = 0
            if (this.onSwitch) this.onSwitch(item, this.items.current)
            if (item.sync) item.sync()
            //sfx.play('apply', env.mixer.level.switch)
        }
        if (this.onMove) this.onMove(item)
    }

    select() {
        const item = this.currentItem()

        if (item.action) {
            item.action(this)
            //sfx.play('use', env.mixer.level.apply)
        } else if (isOption(item)) {
            this.right()
        } else {
            if (this.handlers.onSelect) {
                this.handlers.onSelect(this, item, this.items.current)
            } else if (this.onSelect) {
                this.onSelect(this, item, this.items.current)
            }
            //sfx.play('use', env.mixer.level.apply)
        }
    }

    back() {
        if (this.onBack) {
            this.onBack( this.currentItem() )
        }
        //sfx.play('noisy', env.mixer.level.apply)
    }

    activate(action) {
        this.lastTouch = Date.now()
        switch(action) {
            case 1: this.prev(); break;
            case 2: this.left(); break;
            case 3: this.next(); break;
            case 4: this.right(); break;
            case 5: this.select(); break;
            case 6: this.back(); break;
        }
    }

    focusOn(name) {
        const i = this.items.indexOf(name)
        if (i >= 0) this.items.current = i
    }

    currentItem() {
        return this.items[this.items.current]
    }

    selectedValue(i) {
        const item = this.items[i]
        if (isString(item)) return item
        else if (isArray(item)) {
            return item[item.current]
        }
    }

    evo(dt) {
        if (this.state === DISABLED) return

        const idle = (Date.now() - this.lastTouch)/1000
        if (this.onIdle && idle >= this.IDLE) {
            this.onIdle()
            this.lastTouch = Date.now()
        }
    }

    draw() {
        if (!this.items) return
        const n = this.items.length
        const cx = this.x + floor(this.w/2)
        const cy = this.y + floor(this.h/2)

        alignCenter()
        baseTop()
        font(env.style.font)

        const b = this.border
        const x = cx
        const rx = this.x
        const rw = this.w
        const h = n * this.step + 2*b
        let y = cy - floor(h/2)

        /*
        if (this.showBackground) {
            fill(this.background)
            rect(rx, y-2*b, rw, h)
        }
        */

        for (let i = 0; i < n; i++) {
            let hidden = false
            let active = true
            let disabled = false
            let item = this.items[i]
            if (isObj(item)) {
                if (item.section) {
                    active = false
                    item = item.title
                } else if (isOption(item)) {
                    if (item.title) {
                        item = item.title + ': ' + item.options[item.current]
                    } else {
                        item = '< ' + item.options[item.current] + ' >'
                    }
                } else {
                    item = item.title
                }
            }

            if (!hidden) {
                if (!active) fill(this.color.section)
                else if (disabled) fill(this.color.disabled)
                else if (i === this.items.current) fill(this.color.selected)
                else fill(this.color.main)
                text(item, x, y)
                y += this.step
            }
        }
    }

    save() {
        this.cache.push(this.items)
        this.cache.push(this.handlers)
    }

    restore() {
        this.handlers = this.cache.pop()
        this.items = this.cache.pop()
    }
}
