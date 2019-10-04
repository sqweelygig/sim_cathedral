import * as React from "react";
import * as Three from "three";
import { Block } from "../controllers/game";

interface GameProps {
	blocks: Block[];
}

export class Perspective extends React.Component<GameProps> {
	private mount: HTMLDivElement;
	private scene: Three.Scene;
	private camera: Three.PerspectiveCamera;
	private renderer: Three.WebGLRenderer;
	private frameId: number;
	private maxX: number = 0;
	private maxY: number = 0;
	private maxZ: number = 0;
	private minX: number = 0;
	private minY: number = 0;
	private minZ: number = 0;

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

		const sun = new Three.DirectionalLight(0xffffff, 0.5);
		this.scene.add(sun);

		const glow = new Three.AmbientLight(0xffffff, 0.5);
		this.scene.add(glow);

		const grass = new Three.Mesh(
			new Three.CircleGeometry(32, 64),
			new Three.MeshLambertMaterial({
				color: 0x008800,
			}),
		);
		grass.rotateX(-Math.PI / 2);
		this.scene.add(grass);

		this.props.blocks.forEach((block) => {
			const cube = new Three.Mesh(
				new Three.BoxGeometry(1, 1, 1),
				new Three.MeshLambertMaterial({
					color: block.type.colour,
				}),
			);
			this.maxX = Math.max(this.maxX, block.location.east + 0.5);
			this.minX = Math.min(this.minX, block.location.east - 0.5);
			this.maxZ = Math.max(this.maxZ, block.location.north + 0.5);
			this.minZ = Math.min(this.minZ, block.location.north - 0.5);
			this.maxY = Math.max(this.maxY, block.location.up + 1);
			this.minY = Math.min(this.minY, block.location.up);
			cube.position.y = block.location.up + 0.5;
			cube.position.x = block.location.east;
			cube.position.z = block.location.north;
			this.scene.add(cube);
		});

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
		const radius = Math.max(
			this.maxX - this.minX,
			this.maxZ - this.minZ,
			this.maxY - this.minY,
		);
		const frequency = 1 / 2000;
		const centreX = (this.maxX + this.minX) / 2;
		const centreY = (this.maxY + this.minY) / 2;
		const centreZ = (this.maxZ + this.minZ) / 2;
		this.camera.position.x = radius * Math.sin(rightNow * frequency) + centreX;
		this.camera.position.y = this.maxY + 0.25;
		this.camera.position.z = radius * Math.cos(rightNow * frequency) + centreZ;
		this.camera.lookAt(centreX, centreY, centreZ);
		this.renderer.render(this.scene, this.camera);
		this.frameId = window.requestAnimationFrame(() => {
			this.animate();
		});
	}
}
