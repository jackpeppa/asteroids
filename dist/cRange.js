"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class cRange {
    constructor(min = 0, max = 0) {
        this.min = 0;
        this.max = 0;
        this.overlap = (other) => {
            return other.min <= this.max && this.min <= other.max;
        };
        this.sort = () => {
            if (this.min > this.max) {
                var temp = this.min;
                this.min = this.max;
                this.max = temp;
            }
        };
        this.copy = (range) => {
            this.min = range.min;
            this.max = range.max;
        };
        this.duplicate = () => {
            return new cRange(this.min, this.max);
        };
        this.combine = (range) => {
            var combined = new cRange();
            combined.min = this.min;
            combined.max = this.max;
            if (range.min < this.min) {
                combined.min = range.min;
            }
            if (range.max > this.max) {
                combined.max = range.max;
            }
            return combined;
        };
        this.extend = (value) => {
            if (value > this.max) {
                this.max = value;
            }
            else if (value < this.min) {
                this.min = value;
            }
        };
        this.clamp = (value) => {
            if (value < this.min) {
                return this.min;
            }
            if (value > this.max) {
                return this.max;
            }
            return value;
        };
        this.min = min;
        this.max = max;
    }
}
exports.default = cRange;
