import { Dictionary } from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Dialogue, DialogueProps } from "./elements/dialogue";
import { Perspective } from "./elements/perspective";
import { Toolbar } from "./elements/toolbar";
import { Cube, Location } from "./types/matrix";

interface GameState {
	cubes: Cube[];
	decisions: Dictionary<string>;
	openDialogue?: DialogueProps;
}

const simpleNave = {
	colour: { red: 0x44, green: 0x44, blue: 0x00 },
	label: "Simple Nave",
};

const simpleAltar = {
	colour: { red: 0x44, green: 0x22, blue: 0x00 },
	label: "Simple Altar",
};

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
			decisions: {},
			openDialogue: {
				actions: {
					close: this.encloseDialogueCloser(),
					select: this.encloseDecisionSelector("miracle"),
				},
				header: "Miracle!",
				options: ["water", "healing"],
				text:
					"The earliest part of a cathedral's story, a miracle committed on the very location.  This will alter how you cathedral is viewed throughout history, and give options that other cathedrals may not.",
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
				key="render-layer"
			/>,
			<div className={"layer with-toolbar"} key="interface-layer">
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

	private encloseDecisionSelector(
		decision: string,
	): (selection: string) => void {
		return (selection: string) => {
			const merge: Dictionary<string> = {};
			merge[decision] = selection;
			this.setState((state) => ({
				decisions: { ...state.decisions, ...merge },
				openDialogue: undefined,
			}));
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
