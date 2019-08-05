"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cCollider_1 = __importDefault(require("./cCollider"));
const cVector_1 = __importDefault(require("./cVector"));
const app_1 = require("./app");
class cBullet extends cCollider_1.default {
    constructor(x, y, size, color = "red", lineWidth = 5) {
        super();
        this.active = true;
        this.lineWidth = 5;
        this._size = 0;
        this._halfSize = 0;
        this.color = "red";
        this.exploding = false;
        this.explodeTime = 0.3;
        this.lastFrame = 0;
        this.lineWidthAnimVal = 0;
        this.widthUp = true;
        this.velocity = new cVector_1.default();
        this.speed = 10;
        this.launch = (orientation, rotation) => {
            this.velocity.copy(orientation);
            this.velocity.multiply(this.speed);
            this.rotation = rotation;
        };
        this.draw = () => {
            if (this.active == false) {
                return;
            }
            if (this.exploding == true) {
                if (this.explodeTime > 0) {
                    this.explodeTime -= (new Date().getTime() - this.lastFrame) / 1000;
                    app_1.ctx.fillStyle = "orangered";
                    app_1.ctx.beginPath();
                    app_1.ctx.arc(this.position.x, this.position.y, 5 * this._size * 0.75, 0, Math.PI * 2, false);
                    app_1.ctx.fill();
                    app_1.ctx.fillStyle = "salmon";
                    app_1.ctx.beginPath();
                    app_1.ctx.arc(this.position.x, this.position.y, 5 * this._size * 0.5, 0, Math.PI * 2, false);
                    app_1.ctx.fill();
                    app_1.ctx.fillStyle = "pink";
                    app_1.ctx.beginPath();
                    app_1.ctx.arc(this.position.x, this.position.y, 5 * this._size * 0.25, 0, Math.PI * 2, false);
                    app_1.ctx.fill();
                }
                else {
                    this.active = false;
                    this.exploding = false;
                    this.explodeTime = 0.3;
                }
                this.lastFrame = new Date().getTime();
                return;
            }
            this.lastFrame = new Date().getTime();
            if (this.widthUp == true) {
                this.lineWidthAnimVal += 0.1;
                if (this.lineWidthAnimVal >= 2) {
                    this.widthUp = false;
                }
            }
            else {
                this.lineWidthAnimVal -= 0.1;
                if (this.lineWidthAnimVal <= -2) {
                    this.widthUp = true;
                }
            }
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            if (this.position.x < -10 || this.position.x > app_1.canvas.width || this.position.y < -10 || this.position.y > app_1.canvas.height) {
                this.active = false;
            }
            app_1.ctx.save();
            app_1.ctx.translate(this.position.x, this.position.y);
            app_1.ctx.rotate(this.rotation);
            app_1.ctx.beginPath();
            app_1.ctx.strokeStyle = this.color;
            app_1.ctx.lineWidth = this.lineWidth + this.lineWidthAnimVal;
            app_1.ctx.rect(-this._halfSize, -this._halfSize, this._size, this._size);
            app_1.ctx.stroke();
            app_1.ctx.restore();
        };
        this.setSize = (size) => {
            this._size = size;
            this._halfSize = size / 2;
            while (this._pointList.length > 0) {
                this._pointList.pop();
            }
            this._pointList.push(new cVector_1.default(-this._halfSize, -this._halfSize));
            this._pointList.push(new cVector_1.default(this._halfSize, -this._halfSize));
            this._pointList.push(new cVector_1.default(this._halfSize, this._halfSize));
            this._pointList.push(new cVector_1.default(-this._halfSize, this._halfSize));
        };
        this.position.x = x;
        this.position.y = y;
        this.setSize(size);
        this.color = color;
        this.lineWidth = lineWidth;
    }
    static GetInactiveBullet() {
        var bullet = null;
        for (var i = 0; i < app_1.bullet_array.length; i++) {
            bullet = app_1.bullet_array[i];
            if (bullet.active == false) {
                break;
            }
        }
        return bullet;
    }
}
exports.default = cBullet;
