import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Three from "three";

// TODO typedef
// tslint:disable-next-line:no-var-requires
const OrbitControls: any = require("three-orbit-controls")(Three);

interface Location {
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
	location: Location;
	type: BlockType;
}

interface GameProps {
	blocks: Block[];
}

class Game extends React.Component<GameProps> {
	private mount: HTMLDivElement;
	private scene: Three.Scene;
	private camera: Three.PerspectiveCamera;
	private renderer: Three.WebGLRenderer;
	// TODO: typedef
	private controls: any;
	private cube: Three.Mesh;
	private frameId: number;

	public constructor(props: GameProps) {
		super(props);
	}

	public componentDidMount(): void {
		const width = this.mount.clientWidth;
		const height = this.mount.clientHeight;

		this.scene = new Three.Scene();
		this.camera = new Three.PerspectiveCamera(75, width / height);
		this.renderer = new Three.WebGLRenderer();
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		this.renderer.setSize(width, height);
		this.mount.appendChild(this.renderer.domElement);

		this.controls.rotateSpeed = 1.0;
		this.controls.zoomSpeed = 1.2;
		this.controls.panSpeed = 0.8;

		this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 4;

		const geometry = new Three.BoxGeometry(1, 1, 1);
		const material = new Three.MeshBasicMaterial({
			color: 0xff00ff,
		});
		this.cube = new Three.Mesh(geometry, material);
		this.scene.add(this.cube);

		this.animate();
	}

	public componentWillUnmount(): void {
		cancelAnimationFrame(this.frameId);
		this.mount.removeChild(this.renderer.domElement);
	}

	public render(): React.ReactElement {
		return (
			<div>
				<div
					id="boardCanvas"
					style={{ width: "80vw", height: "40vw" }}
					ref={(mount) => {
						if (mount) {
							this.mount = mount;
						}
					}}
				/>
			</div>
		);
	}

	private animate(): void {
		this.camera.rotateY(0.1);
		this.renderer.render(this.scene, this.camera);
		this.frameId = window.requestAnimationFrame(() => {
			this.animate();
		});
	}
}

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
const game = <Game blocks={simpleChapel} />;
ReactDOM.render(game, document.body);
