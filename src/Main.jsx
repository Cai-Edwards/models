import React from "react";
import { HashRouter, Switch, Route, Link } from "react-router-dom";
import './main.css'
import { Orbits } from "./orbits/orbits.jsx";
import { Quadtree } from "./quadtree/quadtree.jsx";
import { Maze } from "./maze/maze.jsx";
import { Sorting } from "./sorting/sorting.jsx";

export class Main extends React.Component {
	render() {
		return (
			<HashRouter basename="/">
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

							<div class='tile' id='sorting'>
								<Link class="link" to="/sorting">
									<div class='inside'>
										Sorting
									</div>
								</Link>
							</div>

							<div class='tile' id='maze'>
								<Link class="link" to="/maze">
									<div class='inside'>
										Maze
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

					<Route path="/maze">
						<Maze />
					</Route>

					<Route path="/sorting">
						<Sorting />
					</Route>

				</Switch>
			</HashRouter>

		);
	}
}
