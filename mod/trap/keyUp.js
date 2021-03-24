function keyUp(e) {
    const action = env.bind.keyMap[e.code]
    if (action) {
        lab.control.player.stop(action.id, 0)
    }
}
