import * as React from "react";
import * as ReactDOM from "react-dom";
import { Dialogue, DialogueProps } from "../views/dialogue";
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
	openDialogue?: DialogueProps;
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
			openDialogue: {
				actions: {
					close: this.encloseDialogueCloser(),
					select: this.encloseDialogueCloser(),
				},
				header: "Miracle",
				options: ["water", "healing"],
				text: "First choice, founding miracle, blah, blah, blah.",
			},
		};
	}

	public render(): React.ReactElement[] {
		const dialogue = this.state.openDialogue
			? Dialogue(this.state.openDialogue)
			: null;
		return [
			<Perspective
				cubes={this.state.cubes}
				addCube={this.encloseCubeAdder()}
				extraClasses={["layer"]}
			/>,
			<div className={"layer with-toolbar"}>
				<Toolbar />
				{dialogue}
			</div>,
		];
	}

	private encloseDialogueCloser(): () => void {
		return () => {
			this.setState({
				openDialogue: undefined,
			});
		};
	}

	private encloseCubeAdder(): (location: Location) => void {
		return (location: Location) => {
			this.setState((state) => ({
				cubes: state.cubes.concat([{ location, type: simpleNave }]),
			}));
		};
	}
}

ReactDOM.render(<Game />, document.body);
