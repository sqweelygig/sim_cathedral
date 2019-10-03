import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Three from "three";

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

		this.renderer.setSize(width, height);
		this.mount.appendChild(this.renderer.domElement);

		this.scene.background = new Three.Color(0x0000ff);

		const sun = new Three.DirectionalLight(0xffffff);
		this.scene.add(sun);

		const grass = new Three.Mesh(
			new Three.CircleGeometry(2.5),
			new Three.MeshLambertMaterial({
				color: 0x008800,
			}),
		);
		grass.rotateX(-Math.PI / 2);
		this.scene.add(grass);

		const block = new Three.Mesh(
			new Three.BoxGeometry(1, 1, 1),
			new Three.MeshLambertMaterial({
				color: 0x442200,
			}),
		);
		block.position.y = 0.5;
		this.scene.add(block);

		this.animate();
	}

	public componentWillUnmount(): void {
		cancelAnimationFrame(this.frameId);
		this.mount.removeChild(this.renderer.domElement);
	}

	public render(): React.ReactElement {
		const adoptMount = (mount: HTMLDivElement | null) => {
			if (mount) {
				this.mount = mount;
			}
		};
		const fillView = { width: "100vw", height: "100vh" };
		return <div style={fillView} ref={adoptMount} />;
	}

	private animate(): void {
		const rightNow = new Date().getTime();
		const radius = 2;
		const frequency = 1 / 2000;
		this.camera.position.x = radius * Math.sin(rightNow * frequency);
		this.camera.position.y = 1.2;
		this.camera.position.z = radius * Math.cos(rightNow * frequency);
		this.camera.lookAt(0, 1.2, 0);
		this.renderer.render(this.scene, this.camera);
		this.frameId = window.requestAnimationFrame(() => {
			this.animate();
		});
	}
}

const simpleChapel: Block[] = [
	{
		location: {
			east: 0,
			north: 0,
			up: 0,
		},
		type: {
			colour: {
				hue: 0,
				saturation: 128,
				value: 128,
			},
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
			colour: {
				hue: 0,
				saturation: 128,
				value: 128,
			},
			label: "Simple Nave",
		},
	},
];
const game = <Game blocks={simpleChapel} />;
ReactDOM.render(game, document.body);
