"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class cKeyboardInput {
    constructor() {
        this.keyCallback = {};
        this.keyDown = {};
        this.addKeycodeCallback = (keycode, f) => {
            this.keyCallback[keycode] = f;
            this.keyDown[keycode] = false;
        };
        this.keyboardDown = (event) => {
            if (this.keyCallback[event.keyCode] != null) {
                event.preventDefault();
            }
            this.keyDown[event.keyCode] = true;
        };
        this.keyboardUp = (event) => {
            this.keyDown[event.keyCode] = false;
        };
        this.inputLoop = () => {
            for (let key in this.keyDown) {
                let is_down = this.keyDown[key];
                if (is_down) {
                    let callback = this.keyCallback[key];
                    if (callback != null) {
                        callback();
                    }
                }
            }
        };
        document.addEventListener('keydown', this.keyboardDown);
        document.addEventListener('keyup', this.keyboardUp);
    }
}
exports.default = cKeyboardInput;
