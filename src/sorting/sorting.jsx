import React from 'react';
import { update, reset, init, bubble_sort, selection_sort, quick_sort } from './sorting';

export class Sorting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            num: 100,
            speed: 10,
            skip: 1,
            width: 3
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        init();
        this.handleUpdate();
        reset();
    }

    componentDidUpdate() {
        this.handleUpdate();
    }

    handleUpdate() {
        update(
            this.state.num,
            this.state.speed,
            this.state.skip,
            this.state.width
        );
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleReset(e) {
        reset();
    }

    render() {
        return (
            <div id="outer">
                <h1>Sorting Algorithms</h1>
                <button onClick={this.handleReset}>Reset</button>

                <br />

                <button onClick={bubble_sort}>Bubble Sort</button>
                <button onClick={selection_sort}>Selection Sort</button>

                <br />

                <label>
                    Number
                    <input type="number" value={this.state.num} name="num" onChange={this.handleChange}></input>
                </label>

                <br />

                <label>
                    Width
                    <input type="number" value={this.state.width} name="width" onChange={this.handleChange}></input>
                </label>

                <br />

                <label>
                    Speed
                    <input type="number" value={this.state.speed} name="speed" onChange={this.handleChange} />
                </label>

                <label>
                    Skip
                    <input type="number" value={this.state.skip} name="skip" onChange={this.handleChange} />
                </label>

                <canvas id="sorting_canvas" width={window.innerWidth} height={this.state.num * (this.state.width + 2)}></canvas>
            </div>
        )
    }
}