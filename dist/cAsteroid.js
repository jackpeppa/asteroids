"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cCollider_1 = __importDefault(require("./cCollider"));
const cVector_1 = __importDefault(require("./cVector"));
const app_1 = require("./app");
class cAsteroid extends cCollider_1.default {
    constructor(x, y, size, color = "white", line_width = 2) {
        super();
        this.active = true;
        this.lineWidth = 5;
        this.color = "white";
        this._size = 20;
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.velocity = new cVector_1.default();
        this.setSize = (size) => {
            this._size = size;
            let xrand = 0;
            let yrand = 0;
            xrand = Math.round(Math.random() * size - size / 2);
            yrand = Math.round(Math.random() * size - size / 2);
            do {
                while (this._pointList.length > 0) {
                    this._pointList.pop();
                }
                this._pointList.push(new cVector_1.default(xrand, yrand + 3 * size));
                xrand = Math.round(Math.random() * size - size / 2);
                yrand = Math.round(Math.random() * size - size / 2);
                this._pointList.push(new cVector_1.default(xrand + 3 * size, yrand + size));
                xrand = Math.round(Math.random() * size - size / 2);
                yrand = Math.round(Math.random() * size - size / 2);
                this._pointList.push(new cVector_1.default(xrand + 3 * size, yrand - size));
                xrand = Math.round(Math.random() * size - size / 2);
                yrand = Math.round(Math.random() * size - size / 2);
                this._pointList.push(new cVector_1.default(xrand + size, yrand - 3 * size));
                xrand = Math.round(Math.random() * size - size / 2);
                yrand = Math.round(Math.random() * size - size / 2);
                this._pointList.push(new cVector_1.default(xrand - size, yrand - 3 * size));
                xrand = Math.round(Math.random() * size - size / 2);
                yrand = Math.round(Math.random() * size - size / 2);
                this._pointList.push(new cVector_1.default(xrand - 3 * size, yrand - size));
                xrand = Math.round(Math.random() * size - size / 2);
                yrand = Math.round(Math.random() * size - size / 2);
                this._pointList.push(new cVector_1.default(xrand - 3 * size, yrand + size));
                xrand = Math.round(Math.random() * size - size / 2);
                yrand = Math.round(Math.random() * size - size / 2);
                this._pointList.push(new cVector_1.default(xrand - size, yrand + 3 * size));
            } while (cCollider_1.default.isConvex(this) == false);
        };
        this.getSize = () => {
            return this._size;
        };
        this.draw = () => {
            this.position.add(this.velocity);
            if (this.position.x < -this._size * 4) {
                this.position.x = app_1.canvas.width + this._size * 4;
            }
            else if (this.position.x > app_1.canvas.width + this._size * 4) {
                this.position.x = -4 * this._size;
            }
            if (this.position.y < -this._size * 4) {
                this.position.y = app_1.canvas.height + this._size * 4;
            }
            else if (this.position.y > app_1.canvas.height + this._size * 4) {
                this.position.y = -4 * this._size;
            }
            this.rotation += this.rotationSpeed;
            app_1.ctx.save();
            app_1.ctx.translate(this.position.x, this.position.y);
            app_1.ctx.rotate(-this.rotation);
            app_1.ctx.beginPath();
            app_1.ctx.strokeStyle = this.color;
            app_1.ctx.lineWidth = this.lineWidth;
            app_1.ctx.moveTo(this._pointList[this._pointList.length - 1].x, this._pointList[this._pointList.length - 1].y);
            for (let i = 0; i < this._pointList.length; i++) {
                app_1.ctx.lineTo(this._pointList[i].x, this._pointList[i].y);
            }
            app_1.ctx.closePath();
            app_1.ctx.stroke();
            app_1.ctx.restore();
        };
        this.SetRandVelocity = () => {
            let lvl = 1 + 0.1 * app_1.level;
            this.velocity.x = Math.random() * 50 * lvl / 45 * (Math.random() < 0.5 ? 1 : -1);
            this.velocity.y = Math.random() * 50 * lvl / 45 * (Math.random() < 0.5 ? 1 : -1);
        };
        this.SetRandVelocity();
        this.position.x = x;
        this.position.y = y;
        this.setSize(size);
        this.rotationSpeed = Math.random() * 0.06 - 0.03;
        this.color = color;
        this.lineWidth = line_width;
    }
    static SpawnAsteroid(x, y, size, color = "white", line_width = 2) {
        var temp_asteroid;
        for (let i = 0; i < app_1.asteroid_array.length; i++) {
            temp_asteroid = app_1.asteroid_array[i];
            if (temp_asteroid.active == false) {
                temp_asteroid.active = true;
                temp_asteroid.position.x = x;
                temp_asteroid.position.y = y;
                temp_asteroid.setSize(size);
                temp_asteroid.color = color;
                temp_asteroid.lineWidth = line_width;
                temp_asteroid.SetRandVelocity();
                return;
            }
        }
        app_1.asteroid_array.push(new cAsteroid(x, y, size, color, line_width));
    }
}
exports.default = cAsteroid;
