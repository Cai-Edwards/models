import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Orbits } from "./orbits/orbits.jsx";
import './main.css'
import { Quadtree } from "./quadtree/quadtree.jsx";

export class Main extends React.Component {
	render() {
		return (
			<Router>
				<Switch>

					<Route exact path="/">
						<div id='main'>
							<div class='tile' id='orbits'>
								<Link class="link" to="/orbits">
									<div class='inside'>
										<h1>Orbits</h1>
									</div>
								</Link>
							</div>

							<div class='tile' id='quadtree'>
								<Link class="link" to="/quadtree">
									<div class='inside'>
										quadtree
									</div>
								</Link>
							</div>
						</div>
					</Route>

					<Route path="/orbits">
						<Orbits />
					</Route>

					<Route path="/quadtree">
						<Quadtree />
					</Route>
				</Switch>
			</Router>

		);
	}
}
