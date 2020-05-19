import React from 'react';
import './chisquared.css';
import { expected_frequencies, chi_sq } from './chisquared';
import { chi2dist } from './pvalue';

export class ChiSquared extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: 2,
            columns: 2,
            inputs: [],
            values: [],
            lookup: {},
            horizontal: [],
            horizontalv: [],
            vertical: [],
            verticalv: [],
            sumh: [],
            sumv: [],
            total: [],
            freq: [],
            enough: false,
            warning: true,
            chi: 0,
            sig: 0.05
        }

        this.handleChange = this.handleChange.bind(this);
        this.update = this.update.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.dataChange = this.dataChange.bind(this);
        this.renderData = this.renderData.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.headerChange = this.headerChange.bind(this);
        this.renderLeft = this.renderLeft.bind(this);
        this.leftChange = this.leftChange.bind(this);
        this.init = this.init.bind(this);
        this.footerSum = this.footerSum.bind(this);
        this.totalUpdate = this.totalUpdate.bind(this);
        this.expectedBody = this.expectedBody.bind(this);
        this.expectedHeader = this.expectedHeader.bind(this);
    }

    componentDidUpdate() {

    }

    async componentDidMount() {
        await this.init();
        await this.update();
        await this.totalUpdate();
    }

    init() {
        let r = this.state.rows;
        let c = this.state.columns;
        let h = [];
        let hv = [];
        let z = [];
        let zv = [];

        for (let i = 0; i < r; i++) {
            let hn = `horizontal-${i}`;
            h.push(hn);
            hv.push("");
            this.state.lookup[hn] = i;
        }

        for (let j = 0; j < c; j++) {
            let zn = `vertical-${j}`;
            z.push(zn)
            zv.push("")

            this.state.lookup[zn] = j;
        }

        this.state.horizontal = h;
        this.state.horizontalv = hv;
        this.state.vertical = z;
        this.state.verticalv = zv;

        this.forceUpdate();

    }

    update() {
        let r = this.state.rows;
        let c = this.state.columns;
        let v = [];
        let l = [];
        let h = this.state.horizontal;
        let hv = this.state.horizontalv;
        let z = this.state.vertical;
        let zv = this.state.verticalv;

        if (r > this.state.horizontal.length) {
            let hn = `horizontal-${r - 1}`;

            h.push(hn);
            hv.push("");

            this.state.lookup[hn] = r - 1;
        }

        if (r < this.state.horizontal.length) {
            h.pop();
            hv.pop();
        }

        if (c > this.state.vertical.length) {
            let zn = `vertical-${c - 1}`;

            z.push(zn);
            zv.push("");

            this.state.lookup[zn] = c - 1;
        }

        if (c < this.state.vertical.length) {
            z.pop();
            zv.pop();
        }

        for (let i = 0; i < r; i++) {
            v.push([]);
            l.push([]);

            for (let k = 0; k < c; k++) {
                v[i].push(0);

                let n = `input-${i}-${k}`;
                l[i].push(n);

                this.state.lookup[n] = [i, k];
            }
        }


        this.setState({
            values: v,
            inputs: l,
            horizontal: h,
            horizontalv: hv,
            vertical: z,
            verticalv: zv
        })

    }

    async handleChange(e) {
        await this.setState({ [e.target.name]: parseInt(e.target.value) })

        this.update();
        this.totalUpdate();
    }

    dataChange(e) {
        let name = e.target.name;
        let r = this.state.lookup[name][0];
        let c = this.state.lookup[name][1];

        this.state.values[r][c] = parseFloat(e.target.value);

        this.totalUpdate();

        const a = expected_frequencies(this.state.sumh, this.state.sumv, this.state.total);
        const b = chi_sq(a[0], this.state.values);

        this.setState({ freq: a[0], enough: a[1], warning: a[2], chi: b });
    }

    totalUpdate() {
        this.state.sumh = [];
        this.state.sumv = [];

        for (let i = 0; i < this.state.horizontal.length; i++) {
            this.state.sumh.push(this.state.values[i].reduce((a, b) => a + b, 0))
        }

        for (let col = 0; col < this.state.vertical.length; col++) {
            let sum = 0

            for (let row = 0; row < this.state.horizontal.length; row++) {
                sum += this.state.values[row][col];
            }

            this.state.sumv.push(sum)
        }

        this.state.total = this.state.sumh.reduce((a, b) => a + b, 0);

        this.forceUpdate();
    }


    renderTable() {
        let num = -1;
        return (
            this.state.inputs.map((inp) => {
                num++;
                return (
                    <tr>
                        {this.renderLeft(num)}
                        {this.renderData(inp)}
                        <td>
                            {this.state.sumh[num]}
                        </td>
                    </tr>
                )
            })
        )
    }

    renderHeader() {
        return (
            <tr>
                <td>Chi Squared</td>
                {
                    this.state.vertical.map(name => {
                        let pos = this.state.lookup[name];
                        let n = `Category ${pos + 1}`

                        return (
                            <td>
                                <input
                                    name={name}
                                    type="text"
                                    placeholder={n}
                                    value={this.state.verticalv[pos]}
                                    onChange={this.headerChange}
                                />
                            </td>
                        )
                    })
                }

                <td>Total</td>
            </tr>

        )
    }

    headerChange(e) {
        this.update();

        let name = e.target.name;
        let pos = this.state.lookup[name];

        this.state.verticalv[pos] = (e.target.value);

        this.forceUpdate();

    }

    renderLeft(num) {
        let name = this.state.horizontal[num];
        let n = `Category ${num + 1}`

        return (
            <td>
                <input
                    name={name}
                    type="text"
                    placeholder={n}
                    value={this.state.horizontalv[num]}
                    onChange={this.leftChange}
                />
            </td>
        )
    }

    leftChange(e) {
        this.update();

        let name = e.target.name;
        let pos = this.state.lookup[name];

        this.state.horizontalv[pos] = (e.target.value);

        this.forceUpdate();
    }

    footerSum() {
        return (
            <tr>
                <td>Total</td>

                {this.state.sumv.map(v => {
                    return (
                        <td>{v}</td>
                    )
                })}

                <td>{this.state.total}</td>
            </tr>
        )
    }

    renderData(inp) {
        return (
            inp.map(data => {

                let r = this.state.lookup[data][0];
                let c = this.state.lookup[data][1];

                return (<td>
                    <input
                        name={data}
                        key={data}
                        type="number"
                        step="any"
                        min="0"
                        value={this.state.values[r][c]}
                        onChange={this.dataChange}
                    />
                </td>)

            })
        )
    }

    expectedHeader() {
        return (
            <tr>
                <td>Expected Frequencies</td>

                {this.state.verticalv.map(val => {
                    return (
                        <td className="category">{val}</td>
                    )
                })}
            </tr>
        )
    }

    expectedBody() {

        let num = -1

        return (
            this.state.freq.map(row => {
                num++;
                return (<tr>
                    <td className="category">{this.state.horizontalv[num]}</td>

                    {row.map(val => {
                        return <td>{+val.toFixed(9)}</td>
                    })}
                </tr>)
            })
        )
    }

    render() {
        let en;
        let war;
        let result;
        let df = (this.state.columns - 1) * (this.state.rows - 1);
        const p = 1 - chi2dist(df, this.state.chi);

        if (!this.state.enough) {
            en = <h2>Not enough data fields filled in.</h2>
        } else {
            en = <h2></h2>
        }

        if (this.state.warning) {
            war = <h3 id="warning">WARNING: Some expected frequencies are below 5.</h3>
        } else {
            war = <h1></h1>
        }

        if (p < this.state.sig) {
            result = <h3>There is sufficient evidence to reject H0</h3>
        } else {
            result = <h3>There is insufficient evidence to reject H0</h3>
        }

        return (
            <div id="outer">
                <div id="input-boxes">
                    <label>
                        Rows
                        <input
                            name="rows"
                            type="number"
                            value={this.state.rows}
                            min="1"
                            onChange={this.handleChange} />
                    </label>

                    <p />

                    <label>
                        Columns
                        <input
                            name="columns"
                            type="number"
                            value={this.state.columns}
                            min="1"
                            onChange={this.handleChange} />
                    </label>

                    <p />

                    <label>
                        Significance level
                        <input
                            name="sig"
                            type="number"
                            value={this.state.sig}
                            min="0"
                            max="1"
                            step="any"
                            onChange={this.handleChange} />
                    </label>
                </div>


                <p />

                <table id="base">
                    <tbody>
                        {this.renderHeader()}
                        {this.renderTable()}
                        {this.footerSum()}
                    </tbody>
                </table>

                <br />

                {en}

                <br />

                <table>
                    <tbody>
                        {this.expectedHeader()}
                        {this.expectedBody()}
                    </tbody>
                </table>

                {war}

                <h3>χ2 = {this.state.chi}</h3>

                <h3>Degrees of freedom - {df}</h3>

                <h3>P value - {p}</h3>

                {result}
            </div>
        )
    }
}