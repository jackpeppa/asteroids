"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class cVector {
    constructor(x = 0, y = 0) {
        this.x = 0;
        this.y = 0;
        this.magnitude = () => {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        this.magSq = () => {
            return this.x * this.x + this.y * this.y;
        };
        this.normalize = (magnitude = 1) => {
            var len = Math.sqrt(this.x * this.x + this.y * this.y);
            this.x /= len;
            this.y /= len;
            return this;
        };
        this.zero = () => {
            this.x = 0;
            this.y = 0;
        };
        this.copy = (point) => {
            this.x = point.x;
            this.y = point.y;
        };
        this.duplicate = () => {
            var dup = new cVector(this.x, this.y);
            return dup;
        };
        this.rotate = (radians) => {
            var cos = Math.cos(radians);
            var sin = Math.sin(radians);
            var x = (cos * this.x) + (sin * this.y);
            var y = (cos * this.y) - (sin * this.x);
            this.x = x;
            this.y = y;
        };
        this.rotate90 = () => {
            var x = -this.y;
            var y = this.x;
            this.x = x;
            this.y = y;
        };
        this.getAngle = () => {
            return Math.atan2(this.x, this.y);
        };
        this.multiply = (value) => {
            this.x *= value;
            this.y *= value;
        };
        this.add = (value) => {
            this.x += value.x;
            this.y += value.y;
        };
        this.subtract = (value) => {
            this.x -= value.x;
            this.y -= value.y;
        };
        this.dot = (vec) => {
            return this.x * vec.x + this.y * vec.y;
        };
        this.project = (onto) => {
            var mult = onto.duplicate();
            var d = onto.magSq();
            if (d != 0) {
                mult.multiply(this.dot(onto) / d);
                return mult;
            }
            return mult;
        };
        this.x = x;
        this.y = y;
    }
}
exports.default = cVector;
