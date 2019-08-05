"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cVector_1 = __importDefault(require("./cVector"));
class cLine {
    constructor() {
        this.position = new cVector_1.default();
        this.endPosition = new cVector_1.default(1, 1);
    }
}
exports.default = cLine;
