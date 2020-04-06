class Quad {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    insert(point) {
        if (!this.boundary.contains(point)) {
            return;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point)
        } else {
            if (!this.divided) {
                this.divide();
                this.divided = true;
            }

            this.ne.insert(point);
            this.nw.insert(point);
            this.se.insert(point);
            this.sw.insert(point);

        }
    }

    divide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        this.ne = new Quad(new Rect(x - (w / 2), y - (h / 2), w / 2, h / 2), this.capacity);
        this.nw = new Quad(new Rect(x + (w / 2), y - (h / 2), w / 2, h / 2), this.capacity);
        this.se = new Quad(new Rect(x - (w / 2), y + (h / 2), w / 2, h / 2), this.capacity);
        this.sw = new Quad(new Rect(x + (w / 2), y + (h / 2), w / 2, h / 2), this.capacity);
    }

    draw() {

        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        ctx.beginPath();
        ctx.rect(x - w, y - h, w * 2, h * 2)
        ctx.closePath();


        this.points.forEach(p => {
            ctx.beginPath();

            ctx.arc(p.x, p.y, 1, 0, Math.PI * 2)

            ctx.closePath();
        })
        ctx.stroke();

        if (this.divided) {
            this.ne.draw();
            this.nw.draw();
            this.se.draw();
            this.sw.draw();
        }
        ctx.stroke();

    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(p) {
        return (p.x > this.x - this.w && p.x < this.x + this.w &&
            p.y > this.y - this.h && p.y < this.y + this.h)
    }
}

export function init(height) {
    c = document.getElementById("quad");
    ctx = c.getContext("2d");

    boundary = new Rect(height / 2, height / 2, height / 2, height / 2);


    window.addEventListener("click", add_point)

    draw();
}

function add_point(e) {
    system.push(new Point(e.clientX, e.clientY));
}

function draw() {

    tree = new Quad(boundary, 1)

    system.forEach(e => {
        tree.insert(e);
    })

    tree.draw();


    requestAnimationFrame(draw);
}

let boundary, tree, c, ctx
let system = [];