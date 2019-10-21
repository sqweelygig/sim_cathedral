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
