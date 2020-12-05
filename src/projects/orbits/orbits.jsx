import React from "react";
import { init, rend, reset, update_values, clear } from './orbits';

export class Orbits extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			num: 100,
			trail: 'none',
			fill: false,
			time: 1,
			click: false,
			text: false
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
		this.handleReset = this.handleReset.bind(this);
		this.handleClear = this.handleClear.bind(this);
		this.handleRender = this.handleRender.bind(this);

	}

	componentDidMount() {
		init();
	}

	componentDidUpdate() {
		update_values(
			this.state.trail,
			this.state.fill,
			this.state.time,
			this.state.click,
			this.state.text
		);
	}

	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value })
	}

	handleReset(e) {
		reset(this.state.num);
	}

	handleClear(e) {
		clear();
	}

	handleCheckboxChange(e) {
		this.setState({ [e.target.name]: e.target.checked })
	}

	handleRender() {
		rend();
	}

	render() {
		return (
			<div id="outer">
				<div id='canvas'>
					<canvas id="orbit" width={window.innerWidth} height={window.innerHeight / 1.5}></canvas>
				</div>

				<button onClick={this.handleRender}>Stop/Start</button>

				<br />

				<label>
					Number of bodies
					<input name='num' type='number' value={this.state.num} onChange={this.handleChange} />
				</label>

				<br />

				<label>
					Trail type
					<select name='trail' value={this.state.trail} onChange={this.handleChange}>
						<option value="none">No trail</option>
						<option value="line">Lines</option>
						<option value="curve">Approximate curve</option>
					</select>
				</label>

				<br />

				<label>
					Fill curve
					<input
						name="fill"
						type="checkbox"
						checked={this.state.fill}
						onChange={this.handleCheckboxChange} />
				</label>

				<br />

				<label>
					Add planet on click.
					<input
						name="click"
						type="checkbox"
						checked={this.state.click}
						onChange={this.handleCheckboxChange} />
				</label>

				<br />

				<label>
					Show details

					<input
						name="text"
						type="checkbox"
						checked={this.state.text}
						onChange={this.handleCheckboxChange} />
				</label>

				<br />


				<label>
					Simulation speed
					<input name='time' type='number' value={this.state.time} onChange={this.handleChange} />
				</label>

				<br />


				<button onClick={this.handleReset}>Generate</button>
				<button onClick={this.handleClear}>Clear</button>

			</div>
		);
	}
}
