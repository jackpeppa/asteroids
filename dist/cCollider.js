"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cVector_1 = __importDefault(require("./cVector"));
const cLine_1 = __importDefault(require("./cLine"));
const cRange_1 = __importDefault(require("./cRange"));
class cCollider {
    constructor() {
        this.position = new cVector_1.default();
        this.rotation = 0;
        this._pointList = new Array();
        this._edgeList = new Array();
        this._finalEdge = new cLine_1.default();
        this.hitTest = (obj) => {
            let edge;
            for (var i = 0; i < this.edgeCount; i++) {
                edge = this.getEdge(i);
                if (obj.axisOverlap(edge, this) == false) {
                    return false;
                }
            }
            for (var i = 0; i < obj.edgeCount; i++) {
                edge = obj.getEdge(i);
                if (this.axisOverlap(edge, obj) == false) {
                    return false;
                }
            }
            return true;
        };
        this.axisOverlap = (axis, p2) => {
            let edge;
            let direction = axis.position.duplicate();
            direction.subtract(axis.endPosition);
            direction.normalize();
            direction.rotate90();
            let range;
            let axis_range = new cRange_1.default();
            for (let i = 0; i < p2.edgeCount; i++) {
                edge = p2.getEdge(i);
                range = cCollider.ProjectLine(edge, direction);
                if (i == 0) {
                    axis_range.copy(range);
                }
                else {
                    axis_range = axis_range.combine(range);
                }
            }
            let projection = new cRange_1.default();
            for (let i = 0; i < this.edgeCount; i++) {
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
        };
        this.findClosePointNum = (point) => {
            let close_dist_sq = 99999999;
            let temp_point;
            let dist_vec = new cVector_1.default();
            let close_point_num = -1;
            for (let i = 0; i < this._pointList.length; i++) {
                temp_point = this._pointList[i];
                dist_vec.copy(point);
                dist_vec.subtract(temp_point);
                if (dist_vec.magSq() < close_dist_sq) {
                    close_dist_sq = dist_vec.magSq();
                    close_point_num = i;
                }
            }
            return close_point_num;
        };
        this.getEdge = (edge_num) => {
            let p1;
            let p2;
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
            let p1_transform = p1.duplicate();
            let p2_transform = p2.duplicate();
            p1_transform.rotate(this.rotation);
            p1_transform.add(this.position);
            p2_transform.rotate(this.rotation);
            p2_transform.add(this.position);
            let edge = new cLine_1.default();
            edge.position = p1_transform;
            edge.endPosition = p2_transform;
            return edge;
        };
        this.getPoint = (point_num) => {
            return this._pointList[point_num];
        };
        this.pointCount = () => {
            return this._pointList.length;
        };
        this.clearPoints = () => {
            this._pointList = new Array();
            this._edgeList = new Array();
        };
        this.addPoint = (point) => {
            this._pointList.push(point);
        };
        this.projectEdge = (edge_num, onto) => {
            let line = this.getEdge(edge_num);
            let ontoNormalized = onto.duplicate();
            ontoNormalized.normalize();
            let range = new cRange_1.default();
            let dot1 = ontoNormalized.dot(line.position);
            let dot2 = ontoNormalized.dot(line.endPosition);
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
    static isConvex(collider) {
        let point_count = collider.pointCount();
        if (point_count < 4) {
            return true;
        }
        let point = new cVector_1.default();
        let d1 = new cVector_1.default();
        let d2 = new cVector_1.default();
        let sign = false;
        for (let i = 0; i < point_count; i++) {
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
            let dot = d1.dot(d2);
            if (i == 0) {
                sign = dot > 0;
            }
            else if (sign != (dot > 0)) {
                return false;
            }
        }
        return true;
    }
    get edgeCount() {
        return this._pointList.length;
    }
}
cCollider.ProjectLine = (line, onto) => {
    let ontoNormalized = onto.duplicate();
    ontoNormalized.normalize();
    let range = new cRange_1.default();
    let dot1 = ontoNormalized.dot(line.position);
    let dot2 = ontoNormalized.dot(line.endPosition);
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
exports.default = cCollider;
