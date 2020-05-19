let width, height;

class Vector {
    constructor(x, y) {
        this.v = [x, y]
    }

    add(other) {
        this.v = [this.v[0] + other.v[0], this.v[1] + other.v[1]];
    }

    sub(other) {
        this.v = [this.v[0] - other.v[0], this.v[1] - other.v[1]];
    }

    mult(other) {
        this.v = [this.v[0] * other.v[0], this.v[1] * other.v[1]];
    }

    div(other) {
        this.v = [this.v[0] / other.v[0], this.v[1] / other.v[1]];
    }
}

class Grid {
    constructor() {
        this.w = 1;
        this.h = 1;

        this.grid = [];
    }

    increase() {
        this.w *= 2
        this.h *= 2
    }

    decrease() {
        this.w = Math.ceil(this.w / 2)
        this.h = Math.ceil(this.h / 2)
    }

    update(point) {
        absx = Math.floor(point.pos[0] / this.w);
        absy = Math.floor(point.pos[1] / this.h);

        relx = point.pos[0] % (width / this.w);
        rely = point.pos[1] % (height / this.h);


    }
}

class Point {
    constructor(pos, vel, rad) {
        this.pos = pos;
        this.vel = vel;
        this.rad = rad;
    }


}

function init() {
    width = window.innerWidth;
    height = window.innerHeight;
}