import React from 'react';
import { init } from './quadtree';

export class Quadtree extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        init(window.innerHeight);
    }

    render() {
        return (
            <div>
                <canvas id="quad" width={window.innerHeight} height={window.innerHeight}></canvas>
            </div>

        )
    }
}