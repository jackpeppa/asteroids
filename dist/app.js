"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var canvas;
var ctx;
var width;
var heigth;
var dimensionWindow = 0;
var asteroid_array = new Array();
var bullet_array = new Array();
var space_ship;
var score = 0;
var bestScore = 0;
var deltaAsteroidTime = 0;
var lastAsteroidTime = 0;
var asteroidWait = 0.1;
var level = 1;
function resetAll() {
    asteroid_array = new Array();
    bullet_array = new Array();
    deltaAsteroidTime = 0;
    lastAsteroidTime = 0;
    asteroidWait = 0.1;
    if (score > bestScore) {
        bestScore = score;
    }
    score = 0;
    space_ship = new cSpaceShip(width / 2, heigth / 2, dimensionWindow / 2);
    asteroid_array.push(new cAsteroid(3000, 3000, dimensionWindow));
    asteroid_array.push(new cAsteroid(3000, 3000, dimensionWindow));
    asteroid_array.push(new cAsteroid(3000, 3000, dimensionWindow));
    asteroid_array.push(new cAsteroid(3000, 3000, dimensionWindow));
    asteroid_array.push(new cAsteroid(3000, 3000, dimensionWindow));
    keyInput = new cKeyboardInput();
    keyInput.addKeycodeCallback(37, space_ship.turnLeft);
    keyInput.addKeycodeCallback(65, space_ship.turnLeft);
    keyInput.addKeycodeCallback(38, space_ship.accelerate);
    keyInput.addKeycodeCallback(87, space_ship.accelerate);
    keyInput.addKeycodeCallback(39, space_ship.turnRight);
    keyInput.addKeycodeCallback(68, space_ship.turnRight);
    keyInput.addKeycodeCallback(40, space_ship.decelerate);
    keyInput.addKeycodeCallback(83, space_ship.decelerate);
    keyInput.addKeycodeCallback(32, space_ship.shoot);
}
function gameLoop() {
    if (space_ship.exploded == true)
        resetAll();
    if (lastAsteroidTime == 0) {
        deltaAsteroidTime = 0;
    }
    else {
        deltaAsteroidTime = (new Date().getTime() - lastAsteroidTime) / 1000;
    }
    lastAsteroidTime = Date.now();
    if (asteroidWait > 0) {
        asteroidWait -= deltaAsteroidTime;
    }
    if (asteroidWait <= 0) {
        asteroid_array.push(new cAsteroid(3000, 3000, dimensionWindow));
        if (score < 100) {
            asteroidWait = 50;
        }
        else {
            asteroidWait = 10000 / (score);
        }
    }
    requestAnimationFrame(gameLoop);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var bullet;
    var asteroid;
    keyInput.inputLoop();
    space_ship.draw();
    for (var i = 0; i < bullet_array.length; i++) {
        bullet = bullet_array[i];
        bullet.draw();
    }
    for (var i = 0; i < asteroid_array.length; i++) {
        asteroid = asteroid_array[i];
        if (asteroid.active == false) {
            continue;
        }
        asteroid.draw();
        if (space_ship.alive == true) {
            if (space_ship.hitTest(asteroid) == true) {
                space_ship.alive = false;
            }
        }
        for (var j = 0; j < bullet_array.length; j++) {
            bullet = bullet_array[j];
            if (bullet.active == false || bullet.exploding == true) {
                continue;
            }
            if (bullet.hitTest(asteroid) == true) {
                var asteroid_pos = asteroid.position.duplicate();
                var asteroid_size = asteroid.getSize();
                score += 10;
                asteroid.active = false;
                bullet.exploding = true;
                if (asteroid_size >= dimensionWindow / 3) {
                    cAsteroid.SpawnAsteroid(asteroid_pos.x + Math.random() * asteroid_size - asteroid_size / 2, asteroid_pos.y + Math.random() * asteroid_size - asteroid_size / 2, asteroid_size / 2);
                    cAsteroid.SpawnAsteroid(asteroid_pos.x + Math.random() * asteroid_size - asteroid_size / 2, asteroid_pos.y + Math.random() * asteroid_size - asteroid_size / 2, asteroid_size / 2);
                }
            }
        }
    }
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = (dimensionWindow * 3) + "px dejavu sans mono";
    ctx.fillText('score: ' + score.toString(), width - dimensionWindow * 3 / 2, dimensionWindow * 3);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = (dimensionWindow * 3) + "px dejavu sans mono";
    ctx.fillText('best: ' + bestScore.toString(), dimensionWindow * 3 / 2, dimensionWindow * 3);
}
function callback() {
    console.log("the callback");
}
var keyInput;
window.onload = function () {
    canvas = document.getElementById('cnvs');
    width = window.innerWidth;
    heigth = window.innerHeight;
    canvas.width = width;
    canvas.height = heigth;
    ctx = canvas.getContext("2d");
    dimensionWindow = Math.ceil((heigth + width) / 100);
    resetAll();
    gameLoop();
};
var cLine = (function () {
    function cLine() {
        this.position = new cVector();
        this.endPosition = new cVector(1, 1);
    }
    return cLine;
}());
var cVector = (function () {
    function cVector(x, y) {
        var _this = this;
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = 0;
        this.y = 0;
        this.magnitude = function () {
            return Math.sqrt(_this.x * _this.x + _this.y * _this.y);
        };
        this.magSq = function () {
            return _this.x * _this.x + _this.y * _this.y;
        };
        this.normalize = function (magnitude) {
            if (magnitude === void 0) { magnitude = 1; }
            var len = Math.sqrt(_this.x * _this.x + _this.y * _this.y);
            _this.x /= len;
            _this.y /= len;
            return _this;
        };
        this.zero = function () {
            _this.x = 0;
            _this.y = 0;
        };
        this.copy = function (point) {
            _this.x = point.x;
            _this.y = point.y;
        };
        this.duplicate = function () {
            var dup = new cVector(_this.x, _this.y);
            return dup;
        };
        this.rotate = function (radians) {
            var cos = Math.cos(radians);
            var sin = Math.sin(radians);
            var x = (cos * _this.x) + (sin * _this.y);
            var y = (cos * _this.y) - (sin * _this.x);
            _this.x = x;
            _this.y = y;
        };
        this.rotate90 = function () {
            var x = -_this.y;
            var y = _this.x;
            _this.x = x;
            _this.y = y;
        };
        this.getAngle = function () {
            return Math.atan2(_this.x, _this.y);
        };
        this.multiply = function (value) {
            _this.x *= value;
            _this.y *= value;
        };
        this.add = function (value) {
            _this.x += value.x;
            _this.y += value.y;
        };
        this.subtract = function (value) {
            _this.x -= value.x;
            _this.y -= value.y;
        };
        this.dot = function (vec) {
            return _this.x * vec.x + _this.y * vec.y;
        };
        this.project = function (onto) {
            var mult = onto.duplicate();
            var d = onto.magSq();
            if (d != 0) {
                mult.multiply(_this.dot(onto) / d);
                return mult;
            }
            return mult;
        };
        this.x = x;
        this.y = y;
    }
    return cVector;
}());
var cRange = (function () {
    function cRange(min, max) {
        var _this = this;
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 0; }
        this.min = 0;
        this.max = 0;
        this.overlap = function (other) {
            return other.min <= _this.max && _this.min <= other.max;
        };
        this.sort = function () {
            if (_this.min > _this.max) {
                var temp = _this.min;
                _this.min = _this.max;
                _this.max = temp;
            }
        };
        this.copy = function (range) {
            _this.min = range.min;
            _this.max = range.max;
        };
        this.duplicate = function () {
            return new cRange(_this.min, _this.max);
        };
        this.combine = function (range) {
            var combined = new cRange();
            combined.min = _this.min;
            combined.max = _this.max;
            if (range.min < _this.min) {
                combined.min = range.min;
            }
            if (range.max > _this.max) {
                combined.max = range.max;
            }
            return combined;
        };
        this.extend = function (value) {
            if (value > _this.max) {
                _this.max = value;
            }
            else if (value < _this.min) {
                _this.min = value;
            }
        };
        this.clamp = function (value) {
            if (value < _this.min) {
                return _this.min;
            }
            if (value > _this.max) {
                return _this.max;
            }
            return value;
        };
        this.min = min;
        this.max = max;
    }
    return cRange;
}());
var cCollider = (function () {
    function cCollider() {
        var _this = this;
        this.position = new cVector();
        this.rotation = 0;
        this._pointList = new Array();
        this._edgeList = new Array();
        this._finalEdge = new cLine();
        this.hitTest = function (obj) {
            var edge;
            for (var i = 0; i < _this.edgeCount; i++) {
                edge = _this.getEdge(i);
                if (obj.axisOverlap(edge, _this) == false) {
                    return false;
                }
            }
            for (var i = 0; i < obj.edgeCount; i++) {
                edge = obj.getEdge(i);
                if (_this.axisOverlap(edge, obj) == false) {
                    return false;
                }
            }
            return true;
        };
        this.axisOverlap = function (axis, p2) {
            var edge;
            var direction = axis.position.duplicate();
            direction.subtract(axis.endPosition);
            direction.normalize();
            direction.rotate90();
            var range;
            var axis_range = new cRange();
            for (var i = 0; i < p2.edgeCount; i++) {
                edge = p2.getEdge(i);
                range = cCollider.ProjectLine(edge, direction);
                if (i == 0) {
                    axis_range.copy(range);
                }
                else {
                    axis_range = axis_range.combine(range);
                }
            }
            var projection = new cRange();
            for (var i = 0; i < _this.edgeCount; i++) {
                edge = _this.getEdge(i);
                range = cCollider.ProjectLine(edge, direction);
                if (i == 0) {
                    projection.copy(range);
                }
                else {
                    projection = projection.combine(range);
                }
            }
            return axis_range.overlap(projection);
        };
        this.findClosePointNum = function (point) {
            var close_dist_sq = 99999999;
            var temp_point;
            var dist_vec = new cVector();
            var close_point_num = -1;
            for (var i = 0; i < _this._pointList.length; i++) {
                temp_point = _this._pointList[i];
                dist_vec.copy(point);
                dist_vec.subtract(temp_point);
                if (dist_vec.magSq() < close_dist_sq) {
                    close_dist_sq = dist_vec.magSq();
                    close_point_num = i;
                }
            }
            return close_point_num;
        };
        this.getEdge = function (edge_num) {
            var p1;
            var p2;
            if (edge_num < _this._pointList.length - 1) {
                p1 = _this.getPoint(edge_num);
                p2 = _this.getPoint(edge_num + 1);
            }
            else {
                p1 = _this.getPoint(edge_num);
                p2 = _this.getPoint(0);
            }
            if (p1 == null || p2 == null) {
                return null;
            }
            var p1_transform = p1.duplicate();
            var p2_transform = p2.duplicate();
            p1_transform.rotate(_this.rotation);
            p1_transform.add(_this.position);
            p2_transform.rotate(_this.rotation);
            p2_transform.add(_this.position);
            var edge = new cLine();
            edge.position = p1_transform;
            edge.endPosition = p2_transform;
            return edge;
        };
        this.getPoint = function (point_num) {
            return _this._pointList[point_num];
        };
        this.pointCount = function () {
            return _this._pointList.length;
        };
        this.clearPoints = function () {
            _this._pointList = new Array();
            _this._edgeList = new Array();
        };
        this.addPoint = function (point) {
            _this._pointList.push(point);
        };
        this.projectEdge = function (edge_num, onto) {
            var line = _this.getEdge(edge_num);
            var ontoNormalized = onto.duplicate();
            ontoNormalized.normalize();
            var range = new cRange();
            var dot1 = ontoNormalized.dot(line.position);
            var dot2 = ontoNormalized.dot(line.endPosition);
            if (dot2 > dot1) {
                range.min = dot1;
                range.max = dot2;
            }
            else {
                range.min = dot2;
                range.max = dot1;
            }
            return range;
        };
    }
    cCollider.isConvex = function (collider) {
        var point_count = collider.pointCount();
        if (point_count < 4) {
            return true;
        }
        var point = new cVector();
        var d1 = new cVector();
        var d2 = new cVector();
        var sign = false;
        for (var i = 0; i < point_count; i++) {
            point.copy(collider.getPoint(i));
            if (i < point_count - 2) {
                d1.copy(collider.getPoint(i + 1));
                d2.copy(collider.getPoint(i + 2));
                d2.subtract(d1);
                d1.subtract(point);
            }
            else if (i < point_count - 1) {
                d1.copy(collider.getPoint(i + 1));
                d2.copy(collider.getPoint(0));
                d2.subtract(d1);
                d1.subtract(point);
            }
            else {
                d1.copy(collider.getPoint(0));
                d2.copy(collider.getPoint(1));
                d2.subtract(d1);
                d1.subtract(point);
            }
            d2.rotate90();
            var dot = d1.dot(d2);
            if (i == 0) {
                sign = dot > 0;
            }
            else if (sign != (dot > 0)) {
                return false;
            }
        }
        return true;
    };
    Object.defineProperty(cCollider.prototype, "edgeCount", {
        get: function () {
            return this._pointList.length;
        },
        enumerable: true,
        configurable: true
    });
    cCollider.ProjectLine = function (line, onto) {
        var ontoNormalized = onto.duplicate();
        ontoNormalized.normalize();
        var range = new cRange();
        var dot1 = ontoNormalized.dot(line.position);
        var dot2 = ontoNormalized.dot(line.endPosition);
        if (dot2 > dot1) {
            range.min = dot1;
            range.max = dot2;
        }
        else {
            range.min = dot2;
            range.max = dot1;
        }
        return range;
    };
    return cCollider;
}());
var cAsteroid = (function (_super) {
    __extends(cAsteroid, _super);
    function cAsteroid(x, y, size, color, line_width) {
        if (color === void 0) { color = "white"; }
        if (line_width === void 0) { line_width = 2; }
        var _this = _super.call(this) || this;
        _this.active = true;
        _this.lineWidth = 5;
        _this.color = "white";
        _this._size = 20;
        _this.rotation = 0;
        _this.rotationSpeed = 0;
        _this.velocity = new cVector();
        _this.setSize = function (size) {
            _this._size = size;
            var xrand = 0;
            var yrand = 0;
            xrand = Math.round(Math.random() * size - size / 2);
            yrand = Math.round(Math.random() * size - size / 2);
            xrand = Math.round(10);
            yrand = Math.round(10);
            do {
                while (_this._pointList.length > 0) {
                    _this._pointList.pop();
                }
                _this._pointList.push(new cVector(xrand, yrand + 3 * size));
                xrand = Math.round(Math.random() * size - size / 2);
                yrand = Math.round(Math.random() * size - size / 2);
                _this._pointList.push(new cVector(xrand + 3 * size, yrand + size));
                xrand = Math.round(Math.random() * size - size / 2);
                yrand = Math.round(Math.random() * size - size / 2);
                _this._pointList.push(new cVector(xrand + 3 * size, yrand - size));
                xrand = Math.round(Math.random() * size - size / 2);
                yrand = Math.round(Math.random() * size - size / 2);
                _this._pointList.push(new cVector(xrand + size, yrand - 3 * size));
                xrand = Math.round(Math.random() * size - size / 2);
                yrand = Math.round(Math.random() * size - size / 2);
                _this._pointList.push(new cVector(xrand - size, yrand - 3 * size));
                xrand = Math.round(Math.random() * size - size / 2);
                yrand = Math.round(Math.random() * size - size / 2);
                _this._pointList.push(new cVector(xrand - 3 * size, yrand - size));
                xrand = Math.round(Math.random() * size - size / 2);
                yrand = Math.round(Math.random() * size - size / 2);
                _this._pointList.push(new cVector(xrand - 3 * size, yrand + size));
                xrand = Math.round(Math.random() * size - size / 2);
                yrand = Math.round(Math.random() * size - size / 2);
                _this._pointList.push(new cVector(xrand - size, yrand + 3 * size));
            } while (cCollider.isConvex(_this) == false);
        };
        _this.getSize = function () {
            return _this._size;
        };
        _this.draw = function () {
            _this.position.add(_this.velocity);
            if (_this.position.x < -_this._size * 4) {
                _this.position.x = canvas.width + _this._size * 4;
            }
            else if (_this.position.x > canvas.width + _this._size * 4) {
                _this.position.x = -4 * _this._size;
            }
            if (_this.position.y < -_this._size * 4) {
                _this.position.y = canvas.height + _this._size * 4;
            }
            else if (_this.position.y > canvas.height + _this._size * 4) {
                _this.position.y = -4 * _this._size;
            }
            _this.rotation += _this.rotationSpeed;
            ctx.save();
            ctx.translate(_this.position.x, _this.position.y);
            ctx.rotate(-_this.rotation);
            ctx.beginPath();
            ctx.strokeStyle = _this.color;
            ctx.lineWidth = _this.lineWidth;
            ctx.moveTo(_this._pointList[_this._pointList.length - 1].x, _this._pointList[_this._pointList.length - 1].y);
            for (var i = 0; i < _this._pointList.length; i++) {
                ctx.lineTo(_this._pointList[i].x, _this._pointList[i].y);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        };
        _this.SetRandVelocity = function () {
            var lvl = 1 + 0.1 * level;
            _this.velocity.x = Math.random() * 50 * lvl / 45 * (Math.random() < 0.5 ? 1 : -1);
            _this.velocity.y = Math.random() * 50 * lvl / 45 * (Math.random() < 0.5 ? 1 : -1);
        };
        _this.SetRandVelocity();
        _this.position.x = x;
        _this.position.y = y;
        _this.setSize(size);
        _this.rotationSpeed = Math.random() * 0.06 - 0.03;
        _this.color = color;
        _this.lineWidth = line_width;
        return _this;
    }
    cAsteroid.SpawnAsteroid = function (x, y, size, color, line_width) {
        if (color === void 0) { color = "white"; }
        if (line_width === void 0) { line_width = 2; }
        var temp_asteroid;
        for (var i = 0; i < asteroid_array.length; i++) {
            temp_asteroid = asteroid_array[i];
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
        asteroid_array.push(new cAsteroid(x, y, size, color, line_width));
    };
    return cAsteroid;
}(cCollider));
var cBullet = (function (_super) {
    __extends(cBullet, _super);
    function cBullet(x, y, size, color, lineWidth) {
        if (color === void 0) { color = "red"; }
        if (lineWidth === void 0) { lineWidth = 5; }
        var _this = _super.call(this) || this;
        _this.active = true;
        _this.lineWidth = 5;
        _this._size = 0;
        _this._halfSize = 0;
        _this.color = "red";
        _this.exploding = false;
        _this.explodeTime = 0.3;
        _this.lastFrame = 0;
        _this.lineWidthAnimVal = 0;
        _this.widthUp = true;
        _this.velocity = new cVector();
        _this.speed = 10;
        _this.launch = function (orientation, rotation) {
            _this.velocity.copy(orientation);
            _this.velocity.multiply(_this.speed);
            _this.rotation = rotation;
        };
        _this.draw = function () {
            if (_this.active == false) {
                return;
            }
            if (_this.exploding == true) {
                if (_this.explodeTime > 0) {
                    _this.explodeTime -= (new Date().getTime() - _this.lastFrame) / 1000;
                    ctx.fillStyle = "orangered";
                    ctx.beginPath();
                    ctx.arc(_this.position.x, _this.position.y, 5 * _this._size * 0.75, 0, Math.PI * 2, false);
                    ctx.fill();
                    ctx.fillStyle = "salmon";
                    ctx.beginPath();
                    ctx.arc(_this.position.x, _this.position.y, 5 * _this._size * 0.5, 0, Math.PI * 2, false);
                    ctx.fill();
                    ctx.fillStyle = "pink";
                    ctx.beginPath();
                    ctx.arc(_this.position.x, _this.position.y, 5 * _this._size * 0.25, 0, Math.PI * 2, false);
                    ctx.fill();
                }
                else {
                    _this.active = false;
                    _this.exploding = false;
                    _this.explodeTime = 0.3;
                }
                _this.lastFrame = new Date().getTime();
                return;
            }
            _this.lastFrame = new Date().getTime();
            if (_this.widthUp == true) {
                _this.lineWidthAnimVal += 0.1;
                if (_this.lineWidthAnimVal >= 2) {
                    _this.widthUp = false;
                }
            }
            else {
                _this.lineWidthAnimVal -= 0.1;
                if (_this.lineWidthAnimVal <= -2) {
                    _this.widthUp = true;
                }
            }
            _this.position.x += _this.velocity.x;
            _this.position.y += _this.velocity.y;
            if (_this.position.x < -10 || _this.position.x > canvas.width || _this.position.y < -10 || _this.position.y > canvas.height) {
                _this.active = false;
            }
            ctx.save();
            ctx.translate(_this.position.x, _this.position.y);
            ctx.rotate(_this.rotation);
            ctx.beginPath();
            ctx.strokeStyle = _this.color;
            ctx.lineWidth = _this.lineWidth + _this.lineWidthAnimVal;
            ctx.rect(-_this._halfSize, -_this._halfSize, _this._size, _this._size);
            ctx.stroke();
            ctx.restore();
        };
        _this.setSize = function (size) {
            _this._size = size;
            _this._halfSize = size / 2;
            while (_this._pointList.length > 0) {
                _this._pointList.pop();
            }
            _this._pointList.push(new cVector(-_this._halfSize, -_this._halfSize));
            _this._pointList.push(new cVector(_this._halfSize, -_this._halfSize));
            _this._pointList.push(new cVector(_this._halfSize, _this._halfSize));
            _this._pointList.push(new cVector(-_this._halfSize, _this._halfSize));
        };
        _this.position.x = x;
        _this.position.y = y;
        _this.setSize(size);
        _this.color = color;
        _this.lineWidth = lineWidth;
        return _this;
    }
    cBullet.GetInactiveBullet = function () {
        var bullet = null;
        for (var i = 0; i < bullet_array.length; i++) {
            bullet = bullet_array[i];
            if (bullet.active == false) {
                break;
            }
        }
        return bullet;
    };
    return cBullet;
}(cCollider));
var cSpaceShip = (function (_super) {
    __extends(cSpaceShip, _super);
    function cSpaceShip(x, y, size, color, line_width) {
        if (color === void 0) { color = "white"; }
        if (line_width === void 0) { line_width = 2; }
        var _this = _super.call(this) || this;
        _this.alive = true;
        _this.exploded = false;
        _this.explodeTime = 1;
        _this.lastFrame = 0;
        _this.velocity = new cVector(0, 0);
        _this.orientation = new cVector(1, 0);
        _this.maxSpeedSQ = 25;
        _this._maxSpeed = 5;
        _this.acceleration = 0.1;
        _this._drawPointList = new Array();
        _this.lineWidth = 5;
        _this.color = "white";
        _this.size = 20;
        _this.rotation = 0;
        _this._tempVec = new cVector(0, 0);
        _this.inAccelleration = -1;
        _this.friction = 0.9;
        _this.lastTimeDraw = 0;
        _this.deltaTime = 0;
        _this.lastTime = 0;
        _this.bulletWait = 0;
        _this.accelerate = function () {
            if (_this.velocity.x == 0 && _this.velocity.y == 0) {
                _this.velocity.copy(_this.orientation);
                _this.velocity.multiply(_this.acceleration);
            }
            _this._tempVec.copy(_this.orientation);
            _this._tempVec.multiply(_this.acceleration);
            _this.velocity.add(_this._tempVec);
            if (Math.abs(_this.velocity.magSq()) >= _this.maxSpeedSQ) {
                _this.velocity.multiply(_this.maxSpeed / _this.velocity.magnitude());
            }
            if (Math.abs(_this.velocity.magSq()) < 1 && _this.inAccelleration == 0) {
                _this.velocity.x = 0;
                _this.velocity.y = 0;
                _this.inAccelleration = -1;
            }
            else {
                _this.inAccelleration = 1;
            }
        };
        _this.shoot = function () {
            _this.deltaTime = (new Date().getTime() - _this.lastTime) / 1000;
            _this.lastTime = Date.now();
            if (_this.bulletWait > 0) {
                _this.bulletWait -= _this.deltaTime;
                return;
            }
            else {
                _this.bulletWait = 0.25;
            }
            var bullet = cBullet.GetInactiveBullet();
            var endPosition = new cVector(_this.size * 2, 0);
            endPosition.rotate(-_this.rotation);
            if (bullet == null || bullet.active == true) {
                bullet = new cBullet(_this.position.x + endPosition.x, _this.position.y + endPosition.y, 3);
                bullet_array.push(bullet);
            }
            else {
                bullet.position.x = _this.position.x + endPosition.x;
                bullet.position.y = _this.position.y + endPosition.y;
                bullet.active = true;
            }
            bullet.launch(_this.orientation, _this.rotation);
        };
        _this.decelerate = function () {
            if (_this.velocity.x == 0 && _this.velocity.y == 0) {
                _this.velocity.copy(_this.orientation);
                _this.velocity.multiply(-_this.acceleration);
            }
            _this._tempVec.copy(_this.orientation);
            _this._tempVec.multiply(-_this.acceleration);
            _this.velocity.add(_this._tempVec);
            if (Math.abs(_this.velocity.magSq()) >= _this.maxSpeedSQ) {
                _this.velocity.multiply(_this.maxSpeed / _this.velocity.magnitude());
            }
            if (Math.abs(_this.velocity.magSq()) < 1 && _this.inAccelleration == 1) {
                _this.velocity.x = 0;
                _this.velocity.y = 0;
                _this.inAccelleration = -1;
            }
            else {
                _this.inAccelleration = 0;
            }
        };
        _this.draw = function () {
            if (_this.alive == false) {
                if (_this.explodeTime > 0) {
                    _this.explodeTime -= (new Date().getTime() - _this.lastFrame) / 1000;
                    ctx.fillStyle = "darkred";
                    ctx.beginPath();
                    ctx.arc(_this.position.x, _this.position.y, 2 * _this.size * 1.7, 0, Math.PI * 2, false);
                    ctx.fill();
                    ctx.fillStyle = "red";
                    ctx.beginPath();
                    ctx.arc(_this.position.x, _this.position.y, 2 * _this.size * 1.4, 0, Math.PI * 2, false);
                    ctx.fill();
                    ctx.fillStyle = "orange";
                    ctx.beginPath();
                    ctx.arc(_this.position.x, _this.position.y, 2 * _this.size * 1.1, 0, Math.PI * 2, false);
                    ctx.fill();
                    ctx.fillStyle = "yellow";
                    ctx.beginPath();
                    ctx.arc(_this.position.x, _this.position.y, 2 * _this.size * 0.8, 0, Math.PI * 2, false);
                    ctx.fill();
                    ctx.fillStyle = "white";
                    ctx.beginPath();
                    ctx.arc(_this.position.x, _this.position.y, 2 * _this.size * 0.5, 0, Math.PI * 2, false);
                    ctx.fill();
                }
                else {
                    _this.exploded = true;
                }
                _this.lastFrame = new Date().getTime();
                return;
            }
            _this.lastFrame = new Date().getTime();
            var now = new Date().getTime();
            if ((now - _this.lastTimeDraw) / 1000 > 0.2) {
                _this.velocity.multiply(_this.friction);
                _this.lastTimeDraw = now;
            }
            _this.position.add(_this.velocity);
            if (_this.position.x < -_this.size * 2) {
                _this.position.x = canvas.width + _this.size * 2;
            }
            else if (_this.position.x > canvas.width + _this.size * 2) {
                _this.position.x = -2 * _this.size;
            }
            if (_this.position.y < -_this.size * 2) {
                _this.position.y = canvas.height + _this.size * 2;
            }
            else if (_this.position.y > canvas.height + _this.size * 2) {
                _this.position.y = -2 * _this.size;
            }
            ctx.save();
            ctx.translate(_this.position.x, _this.position.y);
            ctx.rotate(_this.rotation);
            ctx.beginPath();
            ctx.strokeStyle = _this.color;
            ctx.lineWidth = _this.lineWidth;
            ctx.moveTo(_this._drawPointList[_this._drawPointList.length - 1].x, _this._drawPointList[_this._drawPointList.length - 1].y);
            for (var i = 0; i < _this._drawPointList.length; i++) {
                ctx.lineTo(_this._drawPointList[i].x, _this._drawPointList[i].y);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        };
        _this.turnLeft = function () {
            _this.rotation -= 0.1;
            if (_this.rotation < 0) {
                _this.rotation += Math.PI * 2;
            }
            _this.orientation.x = 1;
            _this.orientation.y = 0;
            _this.orientation.rotate(-_this.rotation);
        };
        _this.turnRight = function () {
            _this.rotation += 0.1;
            _this.rotation %= Math.PI * 2;
            _this.orientation.x = 1;
            _this.orientation.y = 0;
            _this.orientation.rotate(-_this.rotation);
        };
        _this.position.x = x;
        _this.position.y = y;
        _this.size = size;
        _this._pointList.push(new cVector(3 * size, 0));
        _this._pointList.push(new cVector(-2 * size, -2 * size));
        _this._pointList.push(new cVector(-2 * size, 2 * size));
        _this._drawPointList.push(new cVector(3 * size, 0));
        _this._drawPointList.push(new cVector(-2 * size, -2 * size));
        _this._drawPointList.push(new cVector(-1 * size, 0));
        _this._drawPointList.push(new cVector(-2 * size, 2 * size));
        _this.color = color;
        _this.lineWidth = line_width;
        return _this;
    }
    Object.defineProperty(cSpaceShip.prototype, "maxSpeed", {
        get: function () {
            return Math.sqrt(this.maxSpeedSQ);
        },
        set: function (value) {
            this._maxSpeed = value;
            this.maxSpeedSQ = value * value;
        },
        enumerable: true,
        configurable: true
    });
    return cSpaceShip;
}(cCollider));
var cKeyboardInput = (function () {
    function cKeyboardInput() {
        var _this = this;
        this.keyCallback = {};
        this.keyDown = {};
        this.addKeycodeCallback = function (keycode, f) {
            _this.keyCallback[keycode] = f;
            _this.keyDown[keycode] = false;
        };
        this.keyboardDown = function (event) {
            if (_this.keyCallback[event.keyCode] != null) {
                event.preventDefault();
            }
            _this.keyDown[event.keyCode] = true;
        };
        this.keyboardUp = function (event) {
            _this.keyDown[event.keyCode] = false;
        };
        this.inputLoop = function () {
            for (var key in _this.keyDown) {
                var is_down = _this.keyDown[key];
                if (is_down) {
                    var callback_1 = _this.keyCallback[key];
                    if (callback_1 != null) {
                        callback_1();
                    }
                }
            }
        };
        document.addEventListener('keydown', this.keyboardDown);
        document.addEventListener('keyup', this.keyboardUp);
    }
    return cKeyboardInput;
}());
