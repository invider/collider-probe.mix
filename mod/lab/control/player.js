const MAX_PLAYERS = 8
const MAX_ACTIONS = 8

const ON = 1
const OFF = 0

const ctrl = []

const targetMap = []

function bindAll(target) {
    target.playerId = 1
    for (let i = 0; i < MAX_PLAYERS; i++) {
        targetMap[i] = target
        if (!ctrl[i]) ctrl[i] = []
    }
}

function unbindAll(target) {
    if (target) target.playerId = 0
    for (let i = 0; i < MAX_PLAYERS; i++) {
        const target = targetMap[i]
        if (target) {
            target.playerId = 0
            targetMap[i] = false
        }
    }
}

function release(playerId) {
    const target = targetMap[playerId]
    if (target) {
        target.playerId = 0
        targetMap[playerId] = false
    }
}

function releaseAll() {
    for (let i = 0; i < targetMap.length; i++) {
        targetMap[i] = false
    }
}

function target(playerId) {
    if (!playerId) playerId = 0
    return targetMap[playerId]
}

function act(action, playerId) {
    if (!playerId) playerId = 0
    if (action === 6) action = 4 // map X to A
    if (action === 7) action = 5 // map Y to B

    const target = targetMap[playerId]
    if (!target && env.state === 'play') {
        // spawn playerId
        const nextPlayer = lib.gen.player(playerId)
        this.bind(playerId, nextPlayer)
    }

    if (ctrl[playerId] && !ctrl[playerId][action]) {
        ctrl[playerId][action] = ON
        if (target && target.activate) {
            target.activate(action + 1)
        }
    }
}

function stop(action, playerId) {
    if (!playerId) playerId = 0
    if (action === 6) action = 4 // map X to A
    if (action === 7) action = 5 // map Y to B

    if (ctrl[playerId]) {
        if (ctrl[playerId][action]) {
            const target = targetMap[playerId]
            if (target && target.deactivate) {
                target.deactivate(action + 1)
            }
        }
        ctrl[playerId][action] = OFF
    }
}

function stopAll() {
    for (let p = 0; p < MAX_PLAYERS; p++) {
        for (let i = 0; i < MAX_ACTIONS; i++) {
            stop(i, p)
        }
    }
}

function evo(dt) {
    for (let p = 0; p < ctrl.length; p++) {
        const playerCtrl = ctrl[p]
        if (!playerCtrl) continue

        for (let a = 0; a < playerCtrl.length; a++) {
            if (ctrl[p][a]) {
                const target = targetMap[p]
                if (target && target.act) target.act(a + 1, dt)
            }
        }
    }
}
