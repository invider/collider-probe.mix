const keyboard = [
    [ 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'KeyQ', 'Space', 'RightShift' ],
    [ 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight',
        'ShiftRight', 'Enter' ],
    [ 'Numpad8', 'Numpad4', 'Numpad2', 'Numpad6',
        'KeyX', 'KeyZ', 'KeyO', 'KeyP' ],
]

const keyMap = {}

const padMap = [
    [12, 14, 13, 15, 0, 1, 3, 2],
    [12, 14, 13, 15, 0, 1, 3, 2],
    [12, 14, 13, 15, 0, 1, 3, 2],
    [12, 14, 13, 15, 0, 1, 3, 2],
]

function indexKeys() {
    for (let p = 0; p < keyboard.length; p++) {
        const actions = keyboard[p]
        for (let a = 0; a < actions.length; a++) {
            const key = actions[a]
            keyMap[key] = {
                id: a,
                player: p + padMap.length,
            }
        }
    }
}

function init() {
    indexKeys()
}
