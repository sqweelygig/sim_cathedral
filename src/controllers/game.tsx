import * as React from "react";
import * as ReactDOM from "react-dom";
import { Perspective } from "../views/perspective";

export interface Location {
	east: number;
	north: number;
	up: number;
}

export interface BlockType {
	colour: number;
	label: string;
}

export interface Block {
	location: Location;
	type: BlockType;
}

const simpleChapel: Block[] = [
	{
		location: {
			east: 0,
			north: 0,
			up: 0,
		},
		type: {
			colour: 0x442200,
			label: "Simple Altar",
		},
	},
	{
		location: {
			east: -1,
			north: 0,
			up: 0,
		},
		type: {
			colour: 0x444400,
			label: "Simple Nave",
		},
	},
];
const game = <Perspective blocks={simpleChapel} />;
ReactDOM.render(game, document.body);
