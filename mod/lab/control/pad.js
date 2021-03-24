//
// pad controllers monitor
//
const USAGE_TIMEOUT = 15 * 1000

let sens = 0.3 // analog sticks sensitivity

const bind = []
const lastUsage = []

function activate(id, control) {
    lastUsage[id] = Date.now()
}

function isActive(id) {
    return (lastUsage[id] && Date.now()
        -lastUsage[id] < USAGE_TIMEOUT);
}

function evo(dt) {
    pad().forEach(d => {
        const id = d.index

        if (id >= 4) return
        if (!bind[id]) {
            bind[id] = {}
            log(`registering gamepad #${id}:`)
            console.dir(d)
        }

        const p = lab.control.player
        const b = env.bind.padMap[id]

        // directional controls
        let x = d.axes[0] || d.axes[2] || d.axes[4]
        let y = d.axes[1] || d.axes[3] || d.axes[5]

        if (d.buttons[b[0]] && d.buttons[b[0]].pressed) y = -1
        if (d.buttons[b[1]] && d.buttons[b[1]].pressed) x = -1
        if (d.buttons[b[2]] && d.buttons[b[2]].pressed) y = 1
        if (d.buttons[b[3]] && d.buttons[b[3]].pressed) x = 1


        if (x < -sens) {
            activate(id)
            p.act(1, id)
        } else if (x > sens) {
            activate(id)
            p.act(3, id)
        } else if (isActive(id)) {
            p.stop(1, id)
            p.stop(3, id)
        }

        if (y < -sens) {
            activate(id)
            p.act(0, id)
        } else if (y > sens) {
            activate(id)
            p.act(2, id)
        } else if (isActive(id)) {
            p.stop(0, id)
            p.stop(2, id)
        }

        if (d.buttons[b[4]] && d.buttons[b[4]].pressed) {
            activate(id)
            p.act(4, id)
        } else {
            p.stop(4, id)
        }
        if (d.buttons[b[5]] && d.buttons[b[5]].pressed) {
            activate(id)
            p.act(5, id)
        } else {
            p.stop(5, id)
        }
        /*
        if (d.buttons[b[6]] && d.buttons[b[6]].pressed) {
            p.act(6, id)
        } else {
            p.stop(6, id)
        }
        if (d.buttons[b[7]] && d.buttons[b[7]].pressed) {
            p.act(7, id)
        } else {
            p.stop(7, id)
        }
        */
    })
}
