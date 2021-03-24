function keyDown(e) {
    const action = env.bind.keyMap[e.code]

    if (action) {
        lab.control.player.act(action.id, 0)
    }
}
