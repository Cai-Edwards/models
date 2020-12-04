let c, ctx, height, width, maze, o, prev, cursor_pos, stop, step, sizex, sizey, w, h, speed, frontier, skip, path, start, ends, possible;

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
        let cy = current.y;

        let possible = current.walls & ~current.edges;
        let n = [];

        if ((possible & 0b1000) && (!this.grid[cy - 1][cx].travelled)) { n.push("n") };

        if ((possible & 0b0100) && (!this.grid[cy][cx + 1].travelled)) { n.push("e") };

        if ((possible & 0b0010) && (!this.grid[cy + 1][cx].travelled)) { n.push("s") };

        if ((possible & 0b0001) && (!this.grid[cy][cx - 1].travelled)) { n.push("w") };

        return n;
    };

    connections(current) {
        let cx = current.x;
        let cy = current.y;

        let possible = ~current.walls & ~current.edges;
        let n = [];

        if ((possible & 0b1000) && (!this.grid[cy - 1][cx].done)) { n.push(this.grid[cy - 1][cx]) };

        if ((possible & 0b0100) && (!this.grid[cy][cx + 1].done)) { n.push(this.grid[cy][cx + 1]) };

        if ((possible & 0b0010) && (!this.grid[cy + 1][cx].done)) { n.push(this.grid[cy + 1][cx]) };

        if ((possible & 0b0001) && (!this.grid[cy][cx - 1].done)) { n.push(this.grid[cy][cx - 1]) };

        return n;
    }

    find_travelled(current) {
        let cx = current.x;
        let cy = current.y;

        let n = [];

        if ((~current.edges & 0b1000) && (this.grid[cy - 1][cx].travelled)) { n.push("n") };

        if ((~current.edges & 0b0100) && (this.grid[cy][cx + 1].travelled)) { n.push("e") };

        if ((~current.edges & 0b0010) && (this.grid[cy + 1][cx].travelled)) { n.push("s") };

        if ((~current.edges & 0b0001) && (this.grid[cy][cx - 1].travelled)) { n.push("w") };

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
        this.travel = 100000;
        this.done = false;
        this.inlist = false;
        this.prev = null;
        this.g = 0;
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
    frontier = [];
    skip = 1;
    path = [];
    start = [0, 0]
    ends = [0, 0]
    possible = []


    ctx.lineWidth = 1;
    ctx.fillStyle = "red";

    generate();
}

export function generate() {
    maze = new Maze(sizex, sizey);
    w = Math.floor(width / maze.width);
    h = Math.floor(height / maze.height);
    cursor_pos = [0, 0]
    frontier = [];
    path = [];
    possible = [];

    draw();
}

export function update(x, y, p, s, k) {
    sizex = x;
    sizey = y;
    speed = p;
    step = s;
    skip = k;
}

export function end() {
    stop = 1;
}

export async function depth_first() {
    stop = 0;
    let n = 0;


    let nodes = [maze.grid[0][0]];
    frontier = nodes;

    while (nodes.length !== 0) {

        if (stop) {
            return;
        }



        let current = nodes[nodes.length - 1];


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

        if (step && n % skip === 0 && nodes.length !== 0) {
            let k = nodes[nodes.length - 1]
            cursor_pos = [k.x, k.y];
            n = 0;
            await draw();
        }

        n++;

    }

    draw();
    console.log(astar());

}

export async function prims() {
    stop = 0;
    let fr;
    let current;
    let n = 0;

    frontier = [maze.grid[0][1], maze.grid[1][0]];
    maze.grid[0][0].travelled = true;

    while (frontier.length !== 0) {

        if (stop) {
            return;
        }

        let idx = Math.floor(Math.random() * frontier.length);
        current = frontier[idx];
        cursor_pos = [current.x, current.y];

        current.travelled = true;

        let ava = maze.find_travelled(current);
        let dir = ava[Math.floor(Math.random() * ava.length)];

        if (!dir) {
            frontier.splice(idx, 1);
        } else {
            switch (dir) {
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



            frontier.splice(idx, 1);

            let to_add = maze.available(current);

            for (let i = 0; i < to_add.length; i++) {
                switch (to_add[i]) {
                    case "n":
                        fr = maze.grid[current.y - 1][current.x];
                        if (!check_in(fr, frontier)) {
                            frontier.push(fr);
                        }

                        break;

                    case "e":
                        fr = maze.grid[current.y][current.x + 1];

                        if (!check_in(fr, frontier)) {
                            frontier.push(fr);
                        }
                        break;

                    case "s":
                        fr = maze.grid[current.y + 1][current.x];

                        if (!check_in(fr, frontier)) {
                            frontier.push(fr);
                        }
                        break;

                    case "w":
                        fr = maze.grid[current.y][current.x - 1];

                        if (!check_in(fr, frontier)) {
                            frontier.push(fr);
                        }
                        break;
                }
            }
        }

        if (step && n % skip === 0) {
            await draw();
        }

        n++;
    }

    draw();
    console.log(maze)
    console.log(astar());
}

async function astar() {
    let current_node = maze.grid[0][0]
    current_node.travel = 0
    current_node.g = 0
    current_node.prev = -1
    current_node.done = true

    let end_node = maze.grid[maze.height - 1][maze.width - 1]
    
    let shortest;
    let newnode;
    let manhatten;
    let cost;

    while (true) {
        let nodes = maze.connections(current_node)

        nodes.forEach(node => {
            manhatten = Math.abs(end_node.y - node.y) + Math.abs(end_node.x - node.x)
            cost = current_node.g + manhatten * 10
            node.g = current_node.g + 1

            if (cost < node.travel) {
                node.travel = cost
                node.prev = current_node
            }
            
            if (!node.inlist) {
                possible.push(node);
                node.inlist = true;
            }
            
        })

        shortest = 10000000000;
        newnode = null;

        possible.forEach(node => {
            if (!node.done) {
                if (node.travel <= shortest) {
                    newnode = node;
                }
            }
        })
        
        if (current_node == end_node) {
            let trace = end_node;
            while (trace.prev != -1) {
                path.unshift([trace.x, trace.y]);
                trace = trace.prev;
            }

            path.unshift([trace.x, trace.y]);

            console.log(path)
            await draw();
            return path, end_node.g;
        }
        
        newnode.done = true;
        current_node = newnode;

        await draw();
    }

}

function check_in(val, arr) {
    for (let k in arr) {
        if (val === arr[k]) {
            return true;
        }
    }
    return false;
}

function draw() {

    return new Promise(resolve => {
        setTimeout(() => {
            ctx.clearRect(0, 0, width, height)

            ctx.beginPath();
            for (let val in frontier) {
                val = frontier[val];
                ctx.rect(val.x * w, val.y * h, w, h);
            }
            ctx.fillStyle = "aqua";
            ctx.fill();
            ctx.closePath();

            if (path.length !== 0) {
                ctx.beginPath();
                ctx.strokeStyle = "red";
                let prev = [0, 0]

                ctx.moveTo((prev[0] * w) + w/2, (prev[1] * h) + h/2)

                path.forEach(e => {
                    ctx.lineTo((e[0] * w) + w/2, (e[1] * h) + h/2)
                })

                ctx.stroke();
                ctx.closePath();

            } else {
                ctx.beginPath();
                possible.forEach(e => {
                    if (e.done == true) {
                        ctx.rect(e.x * w, e.y * h, w, h);
                    }
                })

                ctx.fillStyle = "lime";
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                possible.forEach(e => {
                    if (e.done == false) {
                        ctx.rect(e.x * w, e.y * h, w, h);
                    }
                })

                ctx.fillStyle = "aqua";
                ctx.fill();

                ctx.closePath();
            }

            

            ctx.beginPath();
            ctx.strokeStyle = "black";

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
            ctx.rect(cursor_pos[0] * w, cursor_pos[1] * h, w, h);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.closePath();

            

            resolve("Drawn");
        }, speed)

    })
}
