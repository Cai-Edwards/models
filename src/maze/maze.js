let c, ctx, height, width, maze, o, prev, cursor_pos, stop, step, sizex, sizey, w, h, speed;

class Maze {
    constructor(w, h) {
        this.width = w;
        this.height = h;
        this.grid = [];
        this.make();
    }

    make() {
        for (let y = 0; y < this.height; y++) {
            this.grid.push([]);

            for (let x = 0; x < this.width; x++) {
                let edges = 0b0000;

                edges |= (y === 0) ? 0b1000 : 0;
                edges |= (x === 0) ? 0b0001 : 0;
                edges |= (this.height - 1 === y) ? 0b0010 : 0;
                edges |= (this.width - 1 === x) ? 0b0100 : 0;

                this.grid[y].push(new Node(0b1111, edges, x, y));
            }
        }
    }

    available(current) {
        let cx = current.x;
        let cy = current.y

        let possible = current.walls & ~current.edges;
        let n = [];

        if ((possible & 0b1000) && (!this.grid[cy - 1][cx].travelled)) { n.push("n") };

        if ((possible & 0b0100) && (!this.grid[cy][cx + 1].travelled)) { n.push("e") };

        if ((possible & 0b0010) && (!this.grid[cy + 1][cx].travelled)) { n.push("s") };

        if ((possible & 0b0001) && (!this.grid[cy][cx - 1].travelled)) { n.push("w") };

        return n;
    };
}

class Node {
    constructor(walls, edges, x, y) {
        this.walls = walls;
        this.edges = edges;
        this.x = x;
        this.y = y;
        this.travelled = false;
    }
}

export function init() {
    c = document.getElementById('maze_canvas');
    ctx = c.getContext("2d");
    height = c.height;
    width = c.width;
    step = 1;
    sizex = 25;
    sizey = 10;
    speed = 100;
    cursor_pos = (0, 0)

    ctx.lineWidth = 1;
    ctx.fillStyle = "red";

    generate();

}

export function generate() {
    maze = new Maze(sizex, sizey);
    w = Math.floor(width / maze.width);
    h = Math.floor(height / maze.height);

    draw();
}

export function update(x, y, p, s) {
    sizex = x;
    sizey = y;
    speed = p;
    step = s;
}

export function end() {
    stop = 1;
}

export async function depth_first() {
    stop = 0;

    let nodes = [maze.grid[0][0]];

    while (nodes.length !== 0) {

        if (stop) {
            return;
        }

        let current = nodes[nodes.length - 1];
        cursor_pos = (current.x, current.y);

        current.travelled = true;

        let dir = maze.available(current);

        if (!dir.length) {
            nodes.pop();
        } else {
            let choice = dir[Math.floor(Math.random() * dir.length)];

            switch (choice) {
                case "n":
                    current.walls &= 0b0111;
                    o = maze.grid[current.y - 1][current.x];
                    o.walls &= 0b1101;
                    break;

                case "e":
                    current.walls &= 0b1011;
                    o = maze.grid[current.y][current.x + 1];
                    o.walls &= 0b1110;
                    break;

                case "s":
                    current.walls &= 0b1101;
                    o = maze.grid[current.y + 1][current.x];
                    o.walls &= 0b0111;
                    break;

                case "w":
                    current.walls &= 0b1110;
                    o = maze.grid[current.y][current.x - 1];
                    o.walls &= 0b1011;
                    break;
            }

            nodes.push(o);


        }

        if (step) {
            await draw();
        }

    }

    draw();

}


function draw() {

    return new Promise(resolve => {
        setTimeout(() => {
            ctx.clearRect(0, 0, width, height)
            ctx.beginPath();



            for (let row of maze.grid) {
                for (let node of row) {
                    let x = w * node.x;
                    let y = h * node.y;

                    if (node.walls & 0b1000) {
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + w, y);
                    }

                    if (node.walls & 0b0100) {
                        ctx.moveTo(x + w, y);
                        ctx.lineTo(x + w, y + h);
                    }

                    if (node.walls & 0b0010) {
                        ctx.moveTo(x + w, y + h);
                        ctx.lineTo(x, y + h);
                    }

                    if (node.walls & 0b0001) {
                        ctx.moveTo(x, y + h);
                        ctx.lineTo(x, y);
                    }
                }
            }

            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.rect(cursor_pos[0], cursor_pos[1], w, h);
            ctx.fill();
            ctx.closePath();

            resolve("Drawn");
        }, speed)

    })


}

