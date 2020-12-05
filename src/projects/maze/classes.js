/**Maze Class*/
export class Maze {
    /** 
    * @param {Int} rows number of rows
    * @param {Int} columns number of columns
    */
    constructor(rows, columns) {
        this.columns = columns;
        this.rows = rows;

        this.nodes = [];
        this.generate();
    }

    /**Generate the maze structure and insert generic nodes.*/
    generate() {

        for (let row = 0; row < this.rows; row++) {
            this.nodes.push([]);

            for (let column = 0; column < this.columns; column++) {
                this.nodes[row].push(new Node(column, row));
            }
        }
    }

    /** Assign all the connections each node has */
    connect() {
        let current;

        for (let row = 0; row < this.rows; row++) {

            for (let column = 0; column < this.columns; column++) {
                current = this.nodes[row][column];
                let id = 0;

                //North
                if (row !== 0) {
                    current.connections.push([id, this.nodes[row - 1][column], true]);
                }

                id++;

                //East
                if (column !== this.columns - 1) {
                    current.connections.push([id, this.nodes[row][column + 1], true]);
                }

                id++;

                //South
                if (row !== this.rows - 1) {
                    current.connections.push([id, this.nodes[row + 1][column], true]);
                }

                id++;

                //West
                if (column !== 0) {
                    current.connections.push([id, this.nodes[row][column - 1], true]);
                }

            }
        }
    }

    /** Return all existing/nonexistant walls adjactent to current node
     * @param {Node} current_node The targeted node
     * @param {Boolean} state If the wall exists or not
     * @returns {Array<Node>} Adjacent nodes with a wall inbetween 
     */
    connecting_walls(current_node, state) {
        const nodes = [];
        current_node.connections.forEach(e => {
            if (e[2] == state) {
                nodes.push(e[1]);
            }
        })

        return nodes;
    }


}

export class Node {
    constructor(x, y) {

        this.x = x;
        this.y = y;

        /** [id, node, wall] */
        this.connections = [];

        //Maze generation
        this.visited = false;

        //Pathfinding
        this.travel_cost = 0;
        this.shortest_found = false;
        this.in_list = false;
        this.previous_node = null;
        this.total_cost = Infinity;
    }

    remove_wall(node) {
        this.connections.forEach(option => {
            if (option[1] == node) {
                option[2] = false;
                return;
            }
        })
    }
}