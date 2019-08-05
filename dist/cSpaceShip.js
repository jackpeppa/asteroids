"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cCollider_1 = __importDefault(require("./cCollider"));
const cVector_1 = __importDefault(require("./cVector"));
const app_1 = require("./app");
const cBullet_1 = __importDefault(require("./cBullet"));
class cSpaceShip extends cCollider_1.default {
    constructor(x, y, size, color = "white", line_width = 2) {
        super();
        this.alive = true;
        this.exploded = false;
        this.explodeTime = 1;
        this.lastFrame = 0;
        this.velocity = new cVector_1.default(0, 0);
        this.orientation = new cVector_1.default(1, 0);
        this.maxSpeedSQ = 25;
        this._maxSpeed = 5;
        this.acceleration = 0.1;
        this._drawPointList = new Array();
        this.lineWidth = 5;
        this.color = "white";
        this.size = 20;
        this.rotation = 0;
        this._tempVec = new cVector_1.default(0, 0);
        this.inAccelleration = -1;
        this.friction = 0.9;
        this.lastTimeDraw = 0;
        this.deltaTime = 0;
        this.lastTime = 0;
        this.bulletWait = 0;
        this.accelerate = () => {
            if (this.velocity.x == 0 && this.velocity.y == 0) {
                this.velocity.copy(this.orientation);
                this.velocity.multiply(this.acceleration);
            }
            this._tempVec.copy(this.orientation);
            this._tempVec.multiply(this.acceleration);
            this.velocity.add(this._tempVec);
            if (Math.abs(this.velocity.magSq()) >= this.maxSpeedSQ) {
                this.velocity.multiply(this.maxSpeed / this.velocity.magnitude());
            }
            if (Math.abs(this.velocity.magSq()) < 1 && this.inAccelleration == 0) {
                this.velocity.x = 0;
                this.velocity.y = 0;
                this.inAccelleration = -1;
            }
            else {
                this.inAccelleration = 1;
            }
        };
        this.shoot = () => {
            this.deltaTime = (new Date().getTime() - this.lastTime) / 1000;
            this.lastTime = Date.now();
            if (this.bulletWait > 0) {
                this.bulletWait -= this.deltaTime;
                return;
            }
            else {
                this.bulletWait = 0.25;
            }
            let bullet = cBullet_1.default.GetInactiveBullet();
            let endPosition = new cVector_1.default(this.size * 2, 0);
            endPosition.rotate(-this.rotation);
            if (bullet == null || bullet.active == true) {
                bullet = new cBullet_1.default(this.position.x + endPosition.x, this.position.y + endPosition.y, 3);
                app_1.bullet_array.push(bullet);
            }
            else {
                bullet.position.x = this.position.x + endPosition.x;
                bullet.position.y = this.position.y + endPosition.y;
                bullet.active = true;
            }
            bullet.launch(this.orientation, this.rotation);
        };
        this.decelerate = () => {
            if (this.velocity.x == 0 && this.velocity.y == 0) {
                this.velocity.copy(this.orientation);
                this.velocity.multiply(-this.acceleration);
            }
            this._tempVec.copy(this.orientation);
            this._tempVec.multiply(-this.acceleration);
            this.velocity.add(this._tempVec);
            if (Math.abs(this.velocity.magSq()) >= this.maxSpeedSQ) {
                this.velocity.multiply(this.maxSpeed / this.velocity.magnitude());
            }
            if (Math.abs(this.velocity.magSq()) < 1 && this.inAccelleration == 1) {
                this.velocity.x = 0;
                this.velocity.y = 0;
                this.inAccelleration = -1;
            }
            else {
                this.inAccelleration = 0;
            }
        };
        this.draw = () => {
            if (this.alive == false) {
                if (this.explodeTime > 0) {
                    this.explodeTime -= (new Date().getTime() - this.lastFrame) / 1000;
                    app_1.ctx.fillStyle = "darkred";
                    app_1.ctx.beginPath();
                    app_1.ctx.arc(this.position.x, this.position.y, 2 * this.size * 1.7, 0, Math.PI * 2, false);
                    app_1.ctx.fill();
                    app_1.ctx.fillStyle = "red";
                    app_1.ctx.beginPath();
                    app_1.ctx.arc(this.position.x, this.position.y, 2 * this.size * 1.4, 0, Math.PI * 2, false);
                    app_1.ctx.fill();
                    app_1.ctx.fillStyle = "orange";
                    app_1.ctx.beginPath();
                    app_1.ctx.arc(this.position.x, this.position.y, 2 * this.size * 1.1, 0, Math.PI * 2, false);
                    app_1.ctx.fill();
                    app_1.ctx.fillStyle = "yellow";
                    app_1.ctx.beginPath();
                    app_1.ctx.arc(this.position.x, this.position.y, 2 * this.size * 0.8, 0, Math.PI * 2, false);
                    app_1.ctx.fill();
                    app_1.ctx.fillStyle = "white";
                    app_1.ctx.beginPath();
                    app_1.ctx.arc(this.position.x, this.position.y, 2 * this.size * 0.5, 0, Math.PI * 2, false);
                    app_1.ctx.fill();
                }
                else {
                    this.exploded = true;
                }
                this.lastFrame = new Date().getTime();
                return;
            }
            this.lastFrame = new Date().getTime();
            let now = new Date().getTime();
            if ((now - this.lastTimeDraw) / 1000 > 0.2) {
                this.velocity.multiply(this.friction);
                this.lastTimeDraw = now;
            }
            this.position.add(this.velocity);
            if (this.position.x < -this.size * 2) {
                this.position.x = app_1.canvas.width + this.size * 2;
            }
            else if (this.position.x > app_1.canvas.width + this.size * 2) {
                this.position.x = -2 * this.size;
            }
            if (this.position.y < -this.size * 2) {
                this.position.y = app_1.canvas.height + this.size * 2;
            }
            else if (this.position.y > app_1.canvas.height + this.size * 2) {
                this.position.y = -2 * this.size;
            }
            app_1.ctx.save();
            app_1.ctx.translate(this.position.x, this.position.y);
            app_1.ctx.rotate(this.rotation);
            app_1.ctx.beginPath();
            app_1.ctx.strokeStyle = this.color;
            app_1.ctx.lineWidth = this.lineWidth;
            app_1.ctx.moveTo(this._drawPointList[this._drawPointList.length - 1].x, this._drawPointList[this._drawPointList.length - 1].y);
            for (var i = 0; i < this._drawPointList.length; i++) {
                app_1.ctx.lineTo(this._drawPointList[i].x, this._drawPointList[i].y);
            }
            app_1.ctx.closePath();
            app_1.ctx.stroke();
            app_1.ctx.restore();
        };
        this.turnLeft = () => {
            this.rotation -= 0.1;
            if (this.rotation < 0) {
                this.rotation += Math.PI * 2;
            }
            this.orientation.x = 1;
            this.orientation.y = 0;
            this.orientation.rotate(-this.rotation);
        };
        this.turnRight = () => {
            this.rotation += 0.1;
            this.rotation %= Math.PI * 2;
            this.orientation.x = 1;
            this.orientation.y = 0;
            this.orientation.rotate(-this.rotation);
        };
        this.position.x = x;
        this.position.y = y;
        this.size = size;
        this._pointList.push(new cVector_1.default(3 * size, 0));
        this._pointList.push(new cVector_1.default(-2 * size, -2 * size));
        this._pointList.push(new cVector_1.default(-2 * size, 2 * size));
        this._drawPointList.push(new cVector_1.default(3 * size, 0));
        this._drawPointList.push(new cVector_1.default(-2 * size, -2 * size));
        this._drawPointList.push(new cVector_1.default(-1 * size, 0));
        this._drawPointList.push(new cVector_1.default(-2 * size, 2 * size));
        this.color = color;
        this.lineWidth = line_width;
    }
    get maxSpeed() {
        return Math.sqrt(this.maxSpeedSQ);
    }
    set maxSpeed(value) {
        this._maxSpeed = value;
        this.maxSpeedSQ = value * value;
    }
}
exports.default = cSpaceShip;
