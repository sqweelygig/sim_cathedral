import * as React from "react";
import * as ReactDOM from "react-dom";
import { Dialogue } from "../views/dialogue";
import { Perspective } from "../views/perspective";
import { Toolbar } from "../views/toolbar";

export interface Location {
	east: number;
	south: number;
	up: number;
}

export interface Cube {
	location: Location;
	type: CubeType;
}

interface CubeType {
	colour: number;
	label: string;
}

interface GameState {
	cubes: Cube[];
}

const simpleNave = { colour: 0x444400, label: "Simple Nave" };

const simpleAltar = { colour: 0x442200, label: "Simple Altar" };

class Game extends React.Component<{}, GameState> {
	constructor(props: {}) {
		super(props);
		// TODO: Game state to be streamed to/from server.
		this.state = {
			cubes: [
				{
					location: {
						east: 0,
						south: 0,
						up: 0,
					},
					type: simpleAltar,
				},
				{
					location: {
						east: -1,
						south: 0,
						up: 0,
					},
					type: simpleNave,
				},
			],
		};
	}

	public render(): React.ReactElement[] {
		return [
			<Perspective
				cubes={this.state.cubes}
				addCube={this.addCube.bind(this)}
				extraClasses={["layer fill"]}
			/>,
			<div className={"layer with-toolbar"}>
				<Toolbar />
				<Dialogue
					header="Miracle"
					text="First choice, founding miracle"
					options={[]}
				/>
			</div>,
		];
	}

	private addCube(location: Location): void {
		const cubes = this.state.cubes.concat([{ location, type: simpleNave }]);
		this.setState({
			cubes,
		});
	}
}

ReactDOM.render(<Game />, document.body);
