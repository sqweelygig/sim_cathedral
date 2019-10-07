import * as React from "react";
import * as ReactDOM from "react-dom";
import { Perspective } from "../views/perspective";

export interface Location {
	east: number;
	south: number;
	up: number;
}

export interface CubeType {
	colour: number;
	label: string;
}

export interface Cube {
	location: Location;
	type: CubeType;
}

const simpleChapel: Cube[] = [
	{
		location: {
			east: 0,
			south: 0,
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
			south: 0,
			up: 0,
		},
		type: {
			colour: 0x444400,
			label: "Simple Nave",
		},
	},
];
const game = <Perspective cubes={simpleChapel} />;
ReactDOM.render(game, document.body);
