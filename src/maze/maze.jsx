import React from 'react';
import { init, update, depth_first, end, generate, prims } from './maze';

export class Maze extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 25,
            height: 10,
            speed: 100,
            skip: 1,
            step: true
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    }

    componentDidMount() {
        init();
    }

    componentDidUpdate() {
        this.handleUpdate();
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleUpdate() {
        update(
            this.state.width,
            this.state.height,
            this.state.speed,
            this.state.step,
            this.state.skip
        )
    }

    handleCheckboxChange(e) {
        this.setState({ [e.target.name]: e.target.checked })
    }

    render() {
        return (
            <div id="outer">
                <h1>Maze</h1>

                <button onClick={generate}>Generate</button>
                <button onClick={depth_first}>Depth first</button>
                <button onClick={prims}>Prims</button>
                <button onClick={end}>Stop</button>

                <br />

                <label>
                    Width
                    <input
                        name="width"
                        type="number"
                        value={this.state.width}
                        onChange={this.handleChange} />
                </label>

                <br />

                <label>
                    Height
                    <input
                        name="height"
                        type="number"
                        value={this.state.height}
                        onChange={this.handleChange} />
                </label>

                <br />

                <label>
                    Speed
                    <input
                        name="speed"
                        type="number"
                        value={this.state.speed}
                        onChange={this.handleChange} />
                </label>

                <br />

                <label>
                    Skip
                    <input
                        name="skip"
                        type="number"
                        value={this.state.skip}
                        onChange={this.handleChange} />
                </label>

                <br />

                <label>
                    Show creation
					<input
                        name="step"
                        type="checkbox"
                        checked={this.state.step}
                        onChange={this.handleCheckboxChange} />
                </label>

                <canvas id="maze_canvas" width={window.innerWidth / 1.025} height={Math.round(window.innerHeight / 1.35)}></canvas>

            </div>
        )
    }
}