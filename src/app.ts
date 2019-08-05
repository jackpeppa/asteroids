
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let width: number;
let heigth: number;
let dimensionWindow: number = 0;


let asteroid_array: Array<cAsteroid> = new Array<cAsteroid>();
let bullet_array: Array<cBullet> = new Array<cBullet>();
let space_ship: cSpaceShip;
let score: number = 0;
let bestScore =0;

let deltaAsteroidTime : number =0;
let lastAsteroidTime : number =0;
let asteroidWait : number=0.1;

let level: number = 1;

function resetAll(): void {
    asteroid_array = new Array<cAsteroid>();
    bullet_array = new Array<cBullet>();

    deltaAsteroidTime =0;
    lastAsteroidTime=0;
    asteroidWait =0.1;

    if(score>bestScore){
        bestScore=score;
    }
    score =0;

    space_ship = new cSpaceShip(width / 2, heigth / 2, dimensionWindow/2 );

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

function gameLoop(): void {
    
    if (space_ship.exploded == true)
        resetAll();
    if(lastAsteroidTime==0){
        deltaAsteroidTime=0;
    }else{
    deltaAsteroidTime = (new Date().getTime() - lastAsteroidTime) / 1000;
    }
    lastAsteroidTime = Date.now();
    if (asteroidWait > 0) {
        //console.log(deltaAsteroidTime);
        asteroidWait -= deltaAsteroidTime;
    }

    if (asteroidWait <= 0) {
        asteroid_array.push(new cAsteroid(3000, 3000, dimensionWindow));
        if(score<100)
        {
            asteroidWait=50; //spawno ogni 50 secondi
        }else{
        asteroidWait = 10000/(score);//con score di 1000 spawno ogni 10 secondi
        }
    }
    requestAnimationFrame(gameLoop);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let bullet: cBullet;
    let asteroid: cAsteroid;

    keyInput.inputLoop();
    space_ship.draw();

    for (let i: number = 0; i < bullet_array.length; i++) {
        bullet = bullet_array[i];
        bullet.draw();
    }

    for (let i = 0; i < asteroid_array.length; i++) {
        asteroid = asteroid_array[i];
        if (asteroid.active == false) {
            continue;
        }

        asteroid.draw();
        if(space_ship.alive==true){
            if (space_ship.hitTest(asteroid) == true) {
                
                space_ship.alive = false;
            }
        }

        for (var j: number = 0; j < bullet_array.length; j++) {
            bullet = bullet_array[j];
            if (bullet.active == false || bullet.exploding==true) {
                continue;
            }

            //collisione proiettile-asteroide
            if (bullet.hitTest(asteroid) == true) {
                let asteroid_pos: cVector = asteroid.position.duplicate();
                let asteroid_size: number = asteroid.getSize();
                score += 10;
                asteroid.active = false;
                bullet.exploding = true;

                if (asteroid_size >= dimensionWindow/3) {

                    cAsteroid.SpawnAsteroid(asteroid_pos.x + Math.random() * asteroid_size - asteroid_size / 2,
                        asteroid_pos.y + Math.random() * asteroid_size - asteroid_size / 2,
                        asteroid_size / 2);

                    cAsteroid.SpawnAsteroid(asteroid_pos.x + Math.random() * asteroid_size - asteroid_size / 2,
                        asteroid_pos.y + Math.random() * asteroid_size - asteroid_size / 2,
                        asteroid_size / 2);
                }
            }
        }
    }

    //draw punteggio
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = (dimensionWindow*3) + "px dejavu sans mono";
    ctx.fillText('score: '+ score.toString(), width - dimensionWindow*3 / 2 , dimensionWindow*3);

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = (dimensionWindow*3) + "px dejavu sans mono";
    ctx.fillText('best: '+ bestScore.toString(), dimensionWindow*3 / 2 , dimensionWindow*3);

}

function callback(): void {
    console.log("the callback");
}


let keyInput: cKeyboardInput;

window.onload = () => {
    canvas = <HTMLCanvasElement>document.getElementById('cnvs');
    width = window.innerWidth;
    heigth = window.innerHeight;
    canvas.width = width;
    canvas.height = heigth;
    ctx = canvas.getContext("2d");

    dimensionWindow = Math.ceil((heigth + width) / 100);

    resetAll();

    gameLoop();

}


//------------------------------------------------entità geometriche-------------------

interface iShape {
    draw(): void;
    position: cVector;
    color: string;
    lineWidth: number;
} 

class cLine {
    public position: cVector = new cVector();
    public endPosition: cVector = new cVector(1, 1);
    constructor() {
    }
}

class cVector {
    public x: number = 0;
    public y: number = 0;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
    //norma
    public magnitude = (): number => {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    //norma senza radice(meno costoso)
    public magSq = (): number => {
        return this.x * this.x + this.y * this.y;
    }

    public normalize = (magnitude: number = 1): cVector => {
        let len: number = Math.sqrt(this.x * this.x + this.y * this.y);
        this.x /= len;
        this.y /= len;
        return this;
    }

    public zero = (): void => {
        this.x = 0;
        this.y = 0;
    }

    public copy = (point: cVector): void => {
        this.x = point.x;
        this.y = point.y;
    }

    public duplicate = (): cVector => {
        let dup: cVector = new cVector(this.x, this.y);
        return dup;
    }

    public rotate = (radians: number): void => {
        let cos: number = Math.cos(radians);
        let sin: number = Math.sin(radians);
        let x: number = (cos * this.x) + (sin * this.y);
        let y: number = (cos * this.y) - (sin * this.x);
        this.x = x;
        this.y = y;
    }

    public rotate90 = (): void => {
        let x: number = -this.y;
        let y: number = this.x;
        this.x = x;
        this.y = y;
    }

    public getAngle = (): number => {
        return Math.atan2(this.x, this.y);
    }

    public multiply = (value: number): void => {
        this.x *= value;
        this.y *= value;
    }

    public add = (value: cVector): void => {
        this.x += value.x;
        this.y += value.y;
    }

    public subtract = (value: cVector): void => {
        this.x -= value.x;
        this.y -= value.y;
    }
    
    //prodotto vettoriale
    public dot = (vec: cVector): number => {
        return this.x * vec.x + this.y * vec.y;
    }

    public project = (onto: cVector): cVector => {
        var mult: cVector = onto.duplicate();
        var d: number = onto.magSq();

        if (d != 0) {
            mult.multiply(this.dot(onto) / d);
            return mult;
        }
        return mult;
    }
}

class cRange {
    public min: number = 0;
    public max: number = 0;

    constructor(min: number = 0, max: number = 0) {
        this.min = min;
        this.max = max;
    }

    //guarda se due range si sovrappongono
    public overlap = (other: cRange): boolean => {
        return other.min <= this.max && this.min <= other.max;
    }

    //ordina minimo e massimo
    public sort = (): void => {
        if (this.min > this.max) {
            let temp: number = this.min;
            this.min = this.max;
            this.max = temp;

        }
    }

    public copy = (range: cRange): void => {
        this.min = range.min;
        this.max = range.max;
    }

    public duplicate = (): cRange => {
        return new cRange(this.min, this.max);
    }

    public combine = (range: cRange): cRange => {
        let combined: cRange = new cRange();
        combined.min = this.min;
        combined.max = this.max;
        if (range.min < this.min) {
            combined.min = range.min;
        }

        if (range.max > this.max) {
            combined.max = range.max;
        }
        return combined;
    }

    public extend = (value: number): void => {
        if (value > this.max) {
            this.max = value;
        }
        else if (value < this.min) {
            this.min = value;
        }
    }
    //vedo se il valore è interno lo restituisco, altrimenti restituisco min o max
    public clamp = (value: number): number => {
        if (value < this.min) {
            return this.min;
        }
        if (value > this.max) {
            return this.max;
        }
        return value;
    }
}

//-------------------------classe collisioni---------------------------

class cCollider {
    public position: cVector = new cVector();
    public rotation: number = 0;
    protected _pointList: Array<cVector> = new Array<cVector>();
    protected _edgeList: Array<cLine> = new Array<cLine>();
    protected _finalEdge: cLine = new cLine();

    public hitTest = (obj: cCollider): boolean => {
        let edge: cLine;
        
        for (let i: number = 0; i < this.edgeCount; i++) {
            edge = this.getEdge(i);
            if (obj.axisOverlap(edge, this) == false) {
                return false;
            }
        }

        for (let i: number = 0; i < obj.edgeCount; i++) {
            edge = obj.getEdge(i);
            if (this.axisOverlap(edge, obj) == false) {
                return false;
            }
        }
        
        return true;
    }
    

    public static isConvex(collider: cCollider): boolean {
        let point_count: number = collider.pointCount();
        if (point_count < 4) {
            return true;
        }

        let point: cVector = new cVector();
        let d1: cVector = new cVector();
        let d2: cVector = new cVector();
        let sign: boolean = false;

        for (let i: number = 0; i < point_count; i++) {
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
            let dot: number = d1.dot(d2);

            if (i == 0) {
                sign = dot > 0;
            }
            else if (sign != (dot > 0)) {
                return false;
            }

        }

        return true;
    }

    public axisOverlap = (axis: cLine, p2: cCollider): boolean => {
        let edge: cLine;

        let direction: cVector = axis.position.duplicate();
        direction.subtract(axis.endPosition);
        direction.normalize();
        direction.rotate90();

        let range: cRange;

        let axis_range: cRange = new cRange();
        for (let i: number = 0; i < p2.edgeCount; i++) {
            edge = p2.getEdge(i);
            range = cCollider.ProjectLine(edge, direction);
            if (i == 0) {
                axis_range.copy(range);
            }
            else {
                axis_range = axis_range.combine(range);
            }
        }

        

        let projection: cRange = new cRange();

        for (let i: number = 0; i < this.edgeCount; i++) {
            edge = this.getEdge(i);
            range = cCollider.ProjectLine(edge, direction);
            if (i == 0) {
                projection.copy(range);
            }
            else {
                projection = projection.combine(range);
            }
        }

        return axis_range.overlap(projection);
    }

    public findClosePointNum = (point: cVector): number => {
        let close_dist_sq: number = 99999999;
        let temp_point: cVector;
        let dist_vec: cVector = new cVector();
        let close_point_num = -1;

        for (let i: number = 0; i < this._pointList.length; i++) {
            temp_point = this._pointList[i];
            dist_vec.copy(point);
            dist_vec.subtract(temp_point);

            if (dist_vec.magSq() < close_dist_sq) {
                close_dist_sq = dist_vec.magSq();
                close_point_num = i;
            }
        }
        return close_point_num;
    }
    public static ProjectLine = (line: cLine, onto: cVector): cRange => {
        let ontoNormalized: cVector = onto.duplicate();
        ontoNormalized.normalize();

        let range: cRange = new cRange();
        let dot1: number = ontoNormalized.dot(line.position);
        let dot2: number = ontoNormalized.dot(line.endPosition);

        if (dot2 > dot1) {
            range.min = dot1;
            range.max = dot2;
        }
        else {
            range.min = dot2;
            range.max = dot1;
        }

        return range;

    }

    public getEdge = (edge_num: number): cLine => {
        let p1: cVector;
        let p2: cVector;

        if (edge_num < this._pointList.length - 1) {
            p1 = this.getPoint(edge_num);
            p2 = this.getPoint(edge_num + 1);
        }
        else {
            p1 = this.getPoint(edge_num);
            p2 = this.getPoint(0);
        }

        if (p1 == null || p2 == null) {
            return null;
        }

        let p1_transform: cVector = p1.duplicate();
        let p2_transform: cVector = p2.duplicate();

        p1_transform.rotate(this.rotation);
        p1_transform.add(this.position);

        p2_transform.rotate(this.rotation);
        p2_transform.add(this.position);

        let edge: cLine = new cLine();
        edge.position = p1_transform;
        edge.endPosition = p2_transform;
        return edge;
    }

    public getPoint = (point_num: number): cVector => {
        return this._pointList[point_num];
    }

    public pointCount = (): number => {
        return this._pointList.length;
    }

    get edgeCount(): number {
        return this._pointList.length;
    }

    public clearPoints = (): void => {
        this._pointList = new Array<cVector>();
        this._edgeList = new Array<cLine>();
    }

    public addPoint = (point: cVector): void => {
        this._pointList.push(point);
    }
    public projectEdge = (edge_num: number, onto: cVector): cRange => {
        let line: cLine = this.getEdge(edge_num);
        let ontoNormalized: cVector = onto.duplicate();
        ontoNormalized.normalize();

        let range: cRange = new cRange();
        let dot1: number = ontoNormalized.dot(line.position);
        let dot2: number = ontoNormalized.dot(line.endPosition);

        if (dot2 > dot1) {
            range.min = dot1;
            range.max = dot2;
        }
        else {
            range.min = dot2;
            range.max = dot1;
        }

        return range;
    }
}

//----------------------------entità gioco-------------------------------
class cAsteroid extends cCollider implements iShape {
    public active: boolean = true;
    public lineWidth: number = 5;
    public color: string = "white";
    private _size: number = 20; 
    public rotation: number = 0;
    public rotationSpeed: number = 0;
    public velocity: cVector = new cVector();

    public setSize = (size: number): void => {
        this._size = size;
        let xrand: number = 0;
        let yrand: number = 0;

        //nomero random nell'intorno (-size/2,size/2)
        xrand = Math.round(Math.random() * size - size / 2);
        //lo stesso per il punto y
        yrand = Math.round(Math.random() * size - size / 2);

        //nomero random nell'intorno (-size/2,size/2) per farli tutti diversi
        xrand = Math.round(10);
        //lo stesso per il punto y
        yrand = Math.round(10);

        //disegno ottagoni (punti random nel range -size/2,size/2 moltiplicati per formare un poligono)
        do {
            while (this._pointList.length > 0) {
                this._pointList.pop();
            }
            this._pointList.push(new cVector(xrand, yrand + 3 * size));

            xrand = Math.round(Math.random() * size - size / 2);
            yrand = Math.round(Math.random() * size - size / 2);

            this._pointList.push(new cVector(xrand + 3 * size, yrand + size));

            xrand = Math.round(Math.random() * size - size / 2);
            yrand = Math.round(Math.random() * size - size / 2);

            this._pointList.push(new cVector(xrand + 3 * size, yrand - size));
            
            xrand = Math.round(Math.random() * size - size / 2);
            yrand = Math.round(Math.random() * size - size / 2);
            

            this._pointList.push(new cVector(xrand + size, yrand - 3 * size));
 
            xrand = Math.round(Math.random() * size - size / 2);
            yrand = Math.round(Math.random() * size - size / 2);

            this._pointList.push(new cVector(xrand - size, yrand - 3 * size));
 
            xrand = Math.round(Math.random() * size - size / 2);
            yrand = Math.round(Math.random() * size - size / 2);

            this._pointList.push(new cVector(xrand - 3 * size, yrand - size));
 
            xrand = Math.round(Math.random() * size - size / 2);
            yrand = Math.round(Math.random() * size - size / 2);

            this._pointList.push(new cVector(xrand - 3 * size, yrand + size));
 
            xrand = Math.round(Math.random() * size - size / 2);
            yrand = Math.round(Math.random() * size - size / 2);

            this._pointList.push(new cVector(xrand - size, yrand + 3 * size));
            

        } while (cCollider.isConvex(this) == false); //finché viene una figura convessa riprovo
    }

    public getSize = (): number => {
        return this._size;
    }

    //posizione,dimensione....
    public static SpawnAsteroid(x: number, y: number, size: number, color: string = "white", line_width: number = 2) {
        var temp_asteroid: cAsteroid;
        for (let i: number = 0; i < asteroid_array.length; i++) {
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
    }
    
    public draw = (): void => {
        this.position.add(this.velocity);

        //se esce dal bordo spawno dall'altra parte
        if (this.position.x < -this._size * 4) {
            this.position.x = canvas.width + this._size * 4;
        }
        else if (this.position.x > canvas.width + this._size * 4) {
            this.position.x = -4 * this._size;
        }

        if (this.position.y < -this._size * 4) {
            this.position.y = canvas.height + this._size * 4;
        }
        else if (this.position.y > canvas.height + this._size * 4) {
            this.position.y = -4 * this._size;
        }

        this.rotation += this.rotationSpeed;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(-this.rotation);
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;

        ctx.moveTo(this._pointList[this._pointList.length - 1].x, this._pointList[this._pointList.length - 1].y);

        //disegno i poligoni
        for (let i: number = 0; i < this._pointList.length; i++) {
            ctx.lineTo(this._pointList[i].x, this._pointList[i].y);
        }

        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }


    public SetRandVelocity = (): void => {
        let lvl = 1 + 0.1 * level;
        //random*velocità max*lvl/fps*direzione
        this.velocity.x = Math.random() * 50 *lvl / 45 * (Math.random() < 0.5 ? 1 : -1);
        this.velocity.y = Math.random() * 50 *lvl / 45 * (Math.random() < 0.5 ? 1 : -1);
    }

    constructor(x: number, y: number, size: number, color: string = "white", line_width: number = 2) {
        super();
        this.SetRandVelocity();
        this.position.x = x;
        this.position.y = y;
        this.setSize(size);

        this.rotationSpeed = Math.random() * 0.06 - 0.03;
        this.color = color;
        this.lineWidth = line_width;
    }
}


class cBullet extends cCollider implements iShape {
    public active: boolean = true;
    public lineWidth: number = 5;
    private _size: number = 0;
    private _halfSize: number = 0;
    public color: string = "red";
    public exploding : boolean=false;
    public explodeTime : number = 0.3;
    public lastFrame: number =0;

    public lineWidthAnimVal: number = 0;
    public widthUp: boolean = true;

    public velocity: cVector = new cVector();
    public speed: number = 10;

    public launch = (orientation: cVector, rotation: number): void => {
        this.velocity.copy(orientation);
        this.velocity.multiply(this.speed);
        this.rotation = rotation;
    }

    public draw = (): void => {
        if (this.active == false) {
            return;
        }

        if(this.exploding==true)
        {
            if(this.explodeTime>0){
                this.explodeTime-=(new Date().getTime()-this.lastFrame)/1000;
                ctx.fillStyle = "orangered";
                ctx.beginPath();
                ctx.arc(this.position.x, this.position.y, 5*this._size * 0.75, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.fillStyle = "salmon";
                ctx.beginPath();
                ctx.arc(this.position.x, this.position.y, 5*this._size* 0.5, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.fillStyle = "pink";
                ctx.beginPath();
                ctx.arc(this.position.x, this.position.y, 5*this._size * 0.25, 0, Math.PI * 2, false);
                ctx.fill();
            }
            else{
                this.active=false;
                this.exploding=false;
                this.explodeTime=0.3;
            }
                this.lastFrame=new Date().getTime();
                return;
        }   
        
        this.lastFrame=new Date().getTime();

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

        if (this.position.x < -10 || this.position.x > canvas.width || this.position.y < -10 || this.position.y > canvas.height) { 
            this.active = false;
        }

        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth + this.lineWidthAnimVal;
        ctx.rect(-this._halfSize, -this._halfSize, this._size, this._size);

        ctx.stroke();
        ctx.restore();
    }

    public constructor(x: number, y: number, size: number, color: string = "red", lineWidth: number = 5) {
        super();
        this.position.x = x;
        this.position.y = y;
        this.setSize(size);
        this.color = color;
        this.lineWidth = lineWidth;
    }

    public setSize = (size: number): void => {
        this._size = size;
        this._halfSize = size / 2;
        while (this._pointList.length > 0) {
            this._pointList.pop();
        }
        this._pointList.push(new cVector(-this._halfSize, -this._halfSize));
        this._pointList.push(new cVector(this._halfSize, -this._halfSize));
        this._pointList.push(new cVector(this._halfSize, this._halfSize));
        this._pointList.push(new cVector(-this._halfSize, this._halfSize));
    }

    public static GetInactiveBullet(): cBullet {
        var bullet: cBullet = null;
        for (var i: number = 0; i < bullet_array.length; i++) {
            bullet = bullet_array[i];
            if (bullet.active == false) {
                break;
            }
        }
        return bullet;
    }
}

class cSpaceShip extends cCollider implements iShape {
    public alive: boolean = true;
    public exploded:boolean=false;
    public explodeTime : number = 1;
    public lastFrame: number =0;
    public velocity: cVector = new cVector(0, 0);
    public orientation: cVector = new cVector(1, 0);
    public maxSpeedSQ: number = 25;
    private _maxSpeed: number = 5;
    public acceleration: number = 0.1;
    protected _drawPointList: Array<cVector> = new Array<cVector>();

    public lineWidth: number = 5;
    public color: string = "white";
    public size: number = 20;
    public rotation: number = 0;

    private _tempVec: cVector = new cVector(0, 0);

    private inAccelleration: number = -1;
    private friction: number = 0.9;
    private lastTimeDraw: number = 0;

    private deltaTime: number = 0;
    private lastTime: number = 0;
    private bulletWait: number = 0;

    public accelerate = (): void => {
        if (this.velocity.x == 0 && this.velocity.y == 0) {
            this.velocity.copy(this.orientation);
            this.velocity.multiply(this.acceleration);
        }

        this._tempVec.copy(this.orientation);
        this._tempVec.multiply(this.acceleration);
        this.velocity.add(this._tempVec);
        //se è troppo veloce diminuisco
        if (Math.abs(this.velocity.magSq()) >= this.maxSpeedSQ) {
            this.velocity.multiply(this.maxSpeed / this.velocity.magnitude());
        }

        //this.velocity.multiply(0.9);

        if (Math.abs(this.velocity.magSq()) < 1 && this.inAccelleration == 0) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.inAccelleration = -1;
        }
        else {
            this.inAccelleration = 1;
        }
        
    }

    public shoot = (): void => {

        this.deltaTime = (new Date().getTime() - this.lastTime) / 1000;
        this.lastTime = Date.now();
        if (this.bulletWait > 0) {
            this.bulletWait -= this.deltaTime;
            return;
        }
        else{
        this.bulletWait = 0.25;
        }
        
        let bullet: cBullet = cBullet.GetInactiveBullet();
        let endPosition: cVector = new cVector(this.size * 2, 0);
        endPosition.rotate(-this.rotation);


        if (bullet == null || bullet.active == true) {
            bullet = new cBullet(this.position.x + endPosition.x, this.position.y + endPosition.y, 3);
            bullet_array.push(bullet);
        }
        else {
            bullet.position.x = this.position.x + endPosition.x;
            bullet.position.y = this.position.y + endPosition.y;
            bullet.active = true;
        }
        bullet.launch(this.orientation, this.rotation);
    }

    public decelerate = (): void => {
        if (this.velocity.x == 0 && this.velocity.y == 0) {
            this.velocity.copy(this.orientation);
            this.velocity.multiply(-this.acceleration);
        }

        this._tempVec.copy(this.orientation);
        this._tempVec.multiply(-this.acceleration);
        this.velocity.add(this._tempVec);
        //se è troppo veloce diminuisco
        if (Math.abs(this.velocity.magSq()) >= this.maxSpeedSQ) {
            this.velocity.multiply(this.maxSpeed / this.velocity.magnitude());
        }

        //this.velocity.multiply(0.9);
        
        if (Math.abs(this.velocity.magSq()) < 1 && this.inAccelleration == 1) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.inAccelleration = -1;
        }
        else {
            this.inAccelleration = 0;
        }
        
    }

    get maxSpeed(): number {
        return Math.sqrt(this.maxSpeedSQ);
    }

    set maxSpeed(value: number) {
        this._maxSpeed = value;
        this.maxSpeedSQ = value * value;
    }

    public draw = (): void => {

        
        if (this.alive == false) {
            if(this.explodeTime>0){
            this.explodeTime-=(new Date().getTime()-this.lastFrame)/1000;
            ctx.fillStyle = "darkred";
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 2*this.size * 1.7, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 2*this.size * 1.4, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = "orange";
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 2*this.size * 1.1, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = "yellow";
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 2*this.size * 0.8, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, 2*this.size * 0.5, 0, Math.PI * 2, false);
            ctx.fill();
            }
            else{
                this.exploded=true;
            }
            this.lastFrame=new Date().getTime();
            return;
        }
        this.lastFrame=new Date().getTime();
        
        let now: number = new Date().getTime();

        if ((now - this.lastTimeDraw) / 1000 > 0.2) {
            this.velocity.multiply(this.friction);
            this.lastTimeDraw = now;
        }

        this.position.add(this.velocity);

        //se esce dai bordi
        if (this.position.x < -this.size * 2) {
            this.position.x = canvas.width + this.size * 2;
        }
        else if (this.position.x > canvas.width + this.size * 2) {
            this.position.x = -2 * this.size;
        }

        if (this.position.y < -this.size * 2) {
            this.position.y = canvas.height + this.size * 2;
        }
        else if (this.position.y > canvas.height + this.size * 2) {
            this.position.y = -2 * this.size;
        }

        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();

        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;

        ctx.moveTo(this._drawPointList[this._drawPointList.length - 1].x,
            this._drawPointList[this._drawPointList.length - 1].y);

        for (var i: number = 0; i < this._drawPointList.length; i++) {
            ctx.lineTo(this._drawPointList[i].x, this._drawPointList[i].y);
        }

        ctx.closePath();

        ctx.stroke();
        ctx.restore();

       
    }

    public turnLeft = (): void => {
        this.rotation -= 0.1;
        if (this.rotation < 0) {
            this.rotation += Math.PI * 2;
        }
        this.orientation.x = 1;
        this.orientation.y = 0;
        this.orientation.rotate(-this.rotation);
    }

    public turnRight = (): void => {
        this.rotation += 0.1;
        this.rotation %= Math.PI * 2;
        this.orientation.x = 1;
        this.orientation.y = 0;
        this.orientation.rotate(-this.rotation);
    }

    constructor(x: number, y: number, size: number, color: string = "white", line_width: number = 2) {
        super();
        this.position.x = x;
        this.position.y = y;
        this.size = size;

        this._pointList.push(new cVector(3 * size, 0));
        this._pointList.push(new cVector(-2 * size, -2 * size));
        // this._pointList.push(new cVector(-1 * size, 0));
        this._pointList.push(new cVector(-2 * size, 2 * size));

        this._drawPointList.push(new cVector(3 * size, 0));
        this._drawPointList.push(new cVector(-2 * size, -2 * size));
        this._drawPointList.push(new cVector(-1 * size, 0));
        this._drawPointList.push(new cVector(-2 * size, 2 * size));

        this.color = color;
        this.lineWidth = line_width;
    }

}


//--------------------input-output da tastiera---------------
class cKeyboardInput {
    //hashmap di funzioni callback
    public keyCallback: { [keycode: number]: () => void; } = {};
    //hashmap per vedere se il tasto è premuto
    public keyDown: { [keycode: number]: boolean; } = {};
    constructor() {
        document.addEventListener('keydown', this.keyboardDown);
        document.addEventListener('keyup', this.keyboardUp);
    }

    public addKeycodeCallback = (keycode: number, f: () => void): void => {
        this.keyCallback[keycode] = f;
        this.keyDown[keycode] = false;
    }

    public keyboardDown = (event: KeyboardEvent): void => {
        if (this.keyCallback[event.keyCode] != null) {
            event.preventDefault();
        }
        this.keyDown[event.keyCode] = true;
    }

    public keyboardUp = (event: KeyboardEvent): void => {
        this.keyDown[event.keyCode] = false;
    }

    //controlla se i tasti sono premuti e in tal caso chiama la callback
    public inputLoop = (): void => {
        for (let key in this.keyDown) {
            let is_down: boolean = this.keyDown[key];

            if (is_down) {
                let callback: () => void = this.keyCallback[key];
                if (callback != null) {
                    callback();
                }
            }
        }
    }
}
