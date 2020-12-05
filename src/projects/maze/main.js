import { Maze } from './classes.js';

let c;
let ctx;

let maze;

let pixel_width;
let pixel_height;

let canvas_height;
let canvas_width;

let step;
let rows;
let columns;
let speed;
let skip;

let frontier;
let possible_nodes;
let path;

let current_position;
let stop;

/** Initialise starting variables */
export function initialise() {
    c = document.getElementById('maze_canvas');
    ctx = c.getContext("2d");

    canvas_height = c.height;
    canvas_width = c.width;

    step = true;
    columns = 25;
    rows = 10;
    speed = 100;
    skip = 1;

    ctx.lineWidth = 1;
    ctx.fillStyle = "red";

    generate_maze();
}

/** Generate a maze and display. */
export function generate_maze() {
    stop = 1;
    maze = new Maze(rows, columns);
    maze.connect();

    pixel_width = Math.floor(canvas_width / columns);
    pixel_height = Math.floor(canvas_height / rows);

    current_position = [0, 0];
    frontier = [];
    path = [];
    possible_nodes = [];

    draw();
}

/** Update the modifiable variables*/
export function update_values(_rows, _columns, _speed, _step, _skip) {
    rows = _rows;
    columns = _columns;
    speed = _speed;
    step = _step;
    skip = _skip;
}

/** Stop animation */
export function end() {
    stop = true;
}

/** Return if item is in array
 * @param {any} val Value to search for
 * @param {Array} arr Array to search through
 * @returns {boolean} Boolean
 */
function check_in(val, arr) {
    for (let k in arr) {
        if (val === arr[k]) {
            return true;
        }
    }
    return false;
}

/** Depth first generation */
export async function depth_first() {
    stop = false;
    let n = 0;


    let current_path = [maze.nodes[0][0]];
    frontier = current_path;

    while (current_path.length !== 0) {
        if (stop) {
            return;
        }

        let current_node = current_path[current_path.length - 1];

        if (step && n % skip == 0 && current_path.length !== 0) {
            current_position = [current_node.x, current_node.y];
            n = 0;
            await draw();
        }

        current_node.visited = true;
        let connection = maze.connecting_walls(current_node, true);
        let options = [];

        connection.forEach(e => {
            if (!e.visited) {
                options.push(e);
            }
        })

        if (!options.length) {
            current_path.pop();
        } else {
            let choice = options[Math.floor(Math.random() * options.length)];

            current_node.remove_wall(choice);
            choice.remove_wall(current_node);

            current_path.push(choice);

        }

        n++;

    }

    draw();
}

/** Prim's algorithm generation */
export async function prims() {
    stop = 0;

    let current_node;
    let n = 0;

    maze.nodes[0][0].visited = true;

    frontier = [maze.nodes[0][1], maze.nodes[1][0]];

    while (frontier.length !== 0) {
        if (stop) {
            return;
        }

        let index = Math.floor(Math.random() * frontier.length);
        current_node = frontier[index];

        if (step && n % skip == 0) {
            current_position = [current_node.x, current_node.y];
            n = 0;
            await draw();
        }

        current_node.visited = true;

        let connection = maze.connecting_walls(current_node, true);
        let options = [];

        connection.forEach(e => {
            if (e.visited) {
                options.push(e);
            }
        })

        if (!options.length) {
            frontier.splice(index, 1);
        } else {
            let choice = options[Math.floor(Math.random() * options.length)];

            current_node.remove_wall(choice);
            choice.remove_wall(current_node);

            frontier.splice(index, 1);

            connection.forEach(e => {
                if (!e.visited && !check_in(e, frontier)) {
                    frontier.push(e);
                }
            })
        }

    }

    draw();

}


/** A* pathfinding algorithm */
export async function astar() {
    let current_node = maze.nodes[0][0]
    current_node.total_cost = 0
    current_node.previous_node = -1
    current_node.done = true

    let n = 0;

    let end_node = maze.nodes[maze.rows - 1][maze.columns - 1]

    let shortest;
    let newnode;
    let h;
    let cost;

    while (true) {

        if (stop) {
            return;
        }

        if (current_node == end_node) {
            let trace = end_node;
            while (trace.previous_node != -1) {
                path.unshift([trace.x, trace.y]);
                trace = trace.previous_node;
            }

            path.unshift([trace.x, trace.y]);

            draw();

            return path, end_node.g;
        }

        let nodes = [];

        let options = maze.connecting_walls(current_node, false);
        options.forEach(e => {
            if (!e.shortest_found) {
                nodes.push(e)
            }
        })

        nodes.forEach(node => {
            h = Math.abs(end_node.y - node.y) + Math.abs(end_node.x - node.x)

            cost = current_node.travel_cost + h * 2

            if (cost < node.total_cost) {
                node.total_cost = cost
                node.travel_cost = current_node.travel_cost + 1
                node.previous_node = current_node
            }

            if (!node.in_list) {
                possible_nodes.push(node);
                node.in_list = true;
            }

        })

        shortest = Infinity;
        newnode = null;

        possible_nodes.forEach(node => {
            if (!node.shortest_found) {
                if (node.total_cost <= shortest) {
                    newnode = node;
                    shortest = node.total_cost;
                }
            }
        })

        if (newnode == null) {
            return "No route";
        }

        newnode.shortest_found = true;
        current_node = newnode;

        if (step && n % skip === 0) {
            await draw();
        }

        n++;
    }

}

function draw() {

    return new Promise(resolve => {
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas_width, canvas_height)

            ctx.beginPath();
            for (let value in frontier) {
                let node = frontier[value];
                ctx.rect(node.x * pixel_width, node.y * pixel_height, pixel_width, pixel_height);
            }
            ctx.fillStyle = "aqua";
            ctx.fill();
            ctx.closePath();

            if (path.length !== 0) {
                ctx.beginPath();
                ctx.strokeStyle = "red";
                let prev = [0, 0]

                ctx.moveTo(pixel_width * (prev[0] + 0.5), pixel_height * (prev[1] + 0.5))

                path.forEach(coord => {
                    ctx.lineTo(pixel_width * (coord[0] + 0.5), pixel_height * (coord[1] + 0.5))
                })

                ctx.stroke();
                ctx.closePath();

            } else {
                ctx.beginPath();
                possible_nodes.forEach(node => {
                    if (node.shortest_found == true) {
                        ctx.rect(node.x * pixel_width, node.y * pixel_height, pixel_width, pixel_height);
                    }
                })

                ctx.fillStyle = "lime";
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                possible_nodes.forEach(e => {
                    if (e.shortest_found == false) {
                        ctx.rect(e.x * pixel_width, e.y * pixel_height, pixel_width, pixel_height);
                    }
                })

                ctx.fillStyle = "aqua";
                ctx.fill();

                ctx.closePath();
            }

            ctx.beginPath();
            ctx.strokeStyle = "black";

            let node;

            for (let row = 0; row < maze.rows; row++) {

                for (let column = 0; column < maze.columns; column++) {

                    node = maze.nodes[row][column]

                    node.connections.forEach(e => {
                        let id = e[0]
                        let wall = e[2]

                        let x = pixel_width * node.x;
                        let y = pixel_height * node.y;;

                        if (wall) {
                            switch (id) {
                                case 0:
                                    ctx.moveTo(x, y);
                                    ctx.lineTo(x + pixel_width, y);
                                    break;

                                case 1:
                                    ctx.moveTo(x + pixel_width, y);
                                    ctx.lineTo(x + pixel_width, y + pixel_height);
                                    break;

                                case 2:
                                    ctx.moveTo(x + pixel_width, y + pixel_height);
                                    ctx.lineTo(x, y + pixel_height);
                                    break;

                                case 3:
                                    ctx.moveTo(x, y + pixel_height);
                                    ctx.lineTo(x, y);
                                    break;
                            }
                        }
                    })

                }
            }

            ctx.rect(0, 0, maze.columns * pixel_width, maze.rows * pixel_height);

            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.rect(current_position[0] * pixel_width, current_position[1] * pixel_height, pixel_width, pixel_height);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.closePath();

            resolve("Drawn");
        }, speed)

    })
}
