import * as React from "react";
import * as ReactDOM from "react-dom";

interface ThreeDimensionalCoordinate {
	east: number;
	north: number;
	up: number;
}

interface BlockType {
	colour: {
		hue: number;
		saturation: number;
		value: number;
	};
	label: string;
}

interface Block {
	location: ThreeDimensionalCoordinate;
	type: BlockType;
}

interface GameState {
	blocks: Block[];
}

class Game extends React.Component<{}, GameState> {
	public render(): React.ReactElement {
		return <canvas />;
	}
}

const game: Game = new Game({});
const simpleNave: BlockType = {
	colour: {
		hue: 0,
		saturation: 128,
		value: 128,
	},
	label: "Simple Nave",
};
const simpleAltar: BlockType = {
	colour: {
		hue: 0,
		saturation: 128,
		value: 128,
	},
	label: "Simple Altar",
};
const simpleChapel: Block[] = [
	{
		location: {
			east: 0,
			north: 0,
			up: 0,
		},
		type: simpleAltar,
	},
	{
		location: {
			east: -1,
			north: 0,
			up: 0,
		},
		type: simpleNave,
	},
];
game.setState({ blocks: simpleChapel });
ReactDOM.render(game.render(), document.body);
