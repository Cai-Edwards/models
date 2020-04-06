let c, ctx, stop, interval, now, then, elapsed, width, height, originx, originy;
let system = [];
let trail = 'none';
let fill = false;
let show_text = false;

let largest_mass = 0;

const fps = 60;
let fpsmin = 100000;
let fpsmax = 0;

let step = 1;

class Body {

    G = 6.674e-11;

    constructor(mass, position, velocity, color) {
        this.mass = mass;
        this.position = position;
        this.velocity = velocity;
        this.trail = [];
        this.color = color;

        largest_mass = largest_mass < mass ? mass : largest_mass;
    }

    displacement(other) {
        return ((other.position[0] - this.position[0]) ** 2 + (other.position[1] - this.position[1]) ** 2) ** 0.5
    }

    force(other) {
        let disp = this.displacement(other)
        let magnitude = this.G * ((other.mass * this.mass) / disp ** 2)
        let direction = [(other.position[0] - this.position[0]) / disp, (other.position[1] - this.position[1]) / disp]

        return [magnitude * direction[0], magnitude * direction[1]]
    }

    total(bodies) {
        let final = [0, 0];

        bodies.forEach(e => {
            if (e !== this) {
                let f = this.force(e);
                final[0] += f[0];
                final[1] += f[1];
            }
        });

        return final;
    }

    apply(force) {
        this.velocity[0] = (this.velocity[0] * this.mass + force[0] * step) / this.mass;
        this.velocity[1] = (this.velocity[1] * this.mass + force[1] * step) / this.mass;
    }

    update() {
        this.position[0] += this.velocity[0] * step;
        this.position[1] += this.velocity[1] * step;

        if (this.trail.length === 20) {
            this.trail.shift();
        }

        let temp = [this.position[0], this.position[1]];
        this.trail.push(temp);

    }
}

//---------------------- Helper functions ------------------------

function randrange(lower, upper) {
    return Math.random() * (upper - lower) + lower;
}

function calculate_radius(e) {
    return Math.floor(2 ** (Math.log10(e.mass) / 3))
}

export function update_values(t, f, time, click, text) {
    trail = t;
    fill = f;
    step = time;
    show_text = text;

    if (click) {
        add_listener();
    } else {
        remove_listener();
    }

    fpsmin = 1000;
    fpsmax = 0;
}

function add_listener() {
    c.addEventListener('mousedown', handle_down);
    c.addEventListener('mouseup', handle_up);
}

function remove_listener() {
    c.removeEventListener('mousedown', handle_down);
    c.removeEventListener('mouseup', handle_up);
}

function handle_down(e) {
    originx = e.clientX;
    originy = e.clientY;

}

function handle_up(e) {

    let vel = [(e.clientX - originx) / 20, (e.clientY - originy) / 20]
    system.push(new Body(
        1e10,
        [originx, originy],
        vel,
        'rgb(0, 0, 0)'
    ))

    draw_body(system[system.length - 1]);
}

//---------------------- Initialise functions --------------------------

export function init() {
    c = document.getElementById("orbit");
    ctx = c.getContext("2d");

    width = c.width;
    height = c.height;

    stop = 1;
}

export function reset(num) {
    stop = 1;

    ctx.clearRect(0, 0, width, height);

    system = [];

    system.push(new Body(
        1e14,
        [Math.round(width / 2), Math.round(height / 2)],
        [0, 0],
        'rgb(0, 0, 0)'
    ))

    for (let i = 0; i < num; i++) {
        system.push(new Body(
            Math.random() * 1e10,
            [randrange(0, width), randrange(0, height)],
            [randrange(-5, 5), randrange(-5, 5)],
            'rgb(' + (Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255)) + ')'
        ))


        ctx.fillStyle = system[i].color;
        draw_body(system[i]);

    }
}

export function clear() {
    system = [];
    ctx.clearRect(0, 0, width, height)
}


// ----------------------- Draw functions ---------------------------

function draw_body(e) {
    ctx.beginPath();


    ctx.arc(e.position[0], e.position[1], calculate_radius(e), 0, 2 * Math.PI);

    ctx.fill();
    ctx.closePath();
}


function draw_approx_trail(e) {

    ctx.beginPath();

    ctx.moveTo(e.trail[0], e.trail[1]);


    //Code adapted from https://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas
    //Generates an approximate curve through the trail points.

    for (let i = 0; i < e.trail.length - 2; i++) {

        let xc = (e.trail[i][0] + e.trail[i + 1][0]) / 2;
        let yc = (e.trail[i][1] + e.trail[i + 1][1]) / 2;

        ctx.quadraticCurveTo(e.trail[i][0], e.trail[i][1], xc, yc);
    }

    if (e.trail.length > 1) {
        let n = e.trail.length - 2;

        ctx.quadraticCurveTo(e.trail[n][0], e.trail[n][1], e.trail[n + 1][0], e.trail[n + 1][1]);
    }

    ctx.stroke();

    if (fill === true) {
        ctx.fill();
    }

    ctx.closePath();
}

function draw_exact_trail(e) {
    ctx.beginPath();

    ctx.moveTo(e.trail[0][0], e.trail[0][1]);

    e.trail.forEach(k => {

        ctx.lineTo(k[0], k[1]);
    })

    ctx.stroke();

    if (fill === true) {
        ctx.fill();
    }

    ctx.closePath();
}

function draw_text() {

    let f = Math.round(1000 / elapsed);
    fpsmax = f > fpsmax ? f : fpsmax;
    fpsmin = f < fpsmin ? f : fpsmin;

    ctx.font = '18px serif';
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.fillText('fps: ' + f.toString(), 10, 20);
    ctx.fillText('max: ' + fpsmax.toString(), 10, 40);
    ctx.fillText('min: ' + fpsmin.toString(), 10, 60)
    ctx.fillText('bodies: ' + system.length.toString(), 10, 80)
}

//------------------------------ Loop -------------------------------

export function rend() {
    stop = stop ^ 1;
    interval = 1000 / fps
    then = Date.now();

    draw();
}

function draw() {
    if (!stop) {
        requestAnimationFrame(draw);
    }

    now = Date.now();
    elapsed = now - then;

    if (elapsed > interval) {
        then = now - (elapsed % interval);

        ctx.clearRect(0, 0, width, height);

        if (show_text) {
            draw_text();
        }


        system.forEach(e => {

            ctx.globalAlpha = 1;

            e.apply(e.total(system));
            e.update();

            ctx.strokeStyle = e.color;
            ctx.fillStyle = e.color;

            draw_body(e);

            ctx.globalAlpha = 0.8;
            ctx.lineWidth = 1;


            switch (trail) {
                case 'curve':
                    draw_approx_trail(e);
                    break;

                case 'line':
                    draw_exact_trail(e);
                    break;

                default:
                    break;
            }

        })

    }
}
