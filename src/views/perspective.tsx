import * as React from "react";
import * as Three from "three";
import { Block } from "../controllers/game";

export interface PerspectiveProps {
	blocks: Block[];
}

export class Perspective extends React.Component<PerspectiveProps> {
	private mount: HTMLDivElement;
	private scene: Three.Scene;
	private camera: Three.PerspectiveCamera;
	private renderer: Three.WebGLRenderer;
	private sun: Three.DirectionalLight;
	private nextFrame: number;
	private maxX: number = 0;
	private maxY: number = 0;
	private maxZ: number = 0;
	private minX: number = 0;
	private minY: number = 0;
	private minZ: number = 0;

	public constructor(props: PerspectiveProps) {
		super(props);
	}

	public componentDidMount(): void {
		const width = this.mount.clientWidth;
		const height = this.mount.clientHeight;

		this.scene = new Three.Scene();
		this.camera = new Three.PerspectiveCamera(75, width / height);
		this.renderer = new Three.WebGLRenderer();
		this.renderer.shadowMap.enabled = true;

		this.renderer.setSize(width, height);
		this.scene.background = new Three.Color(0x669999);
		const glow = new Three.AmbientLight(0x5588aa);
		this.scene.add(glow);

		this.sun = new Three.DirectionalLight(0xaa7755);
		this.sun.castShadow = true;
		this.scene.add(this.sun);

		const grass = new Three.Mesh(
			new Three.CircleGeometry(32, 64),
			new Three.MeshLambertMaterial({
				color: 0x008800,
			}),
		);
		grass.rotateX(-Math.PI / 2);
		grass.receiveShadow = true;
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
			cube.castShadow = true;
			cube.receiveShadow = true;
			this.scene.add(cube);
		});

		this.animate();
		this.mount.appendChild(this.renderer.domElement);
	}

	public componentWillUnmount(): void {
		cancelAnimationFrame(this.nextFrame);
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
		const perDay = 60 * 60 * 24 * 1000;
		const sinceMidnight = rightNow % perDay;

		const solarTheta = (sinceMidnight * 2 * Math.PI) / perDay;
		this.sun.position.x = Math.sin(solarTheta);
		this.sun.position.y = -Math.cos(solarTheta) / Math.sqrt(2);
		this.sun.position.z = this.sun.position.y;

		const cameraDistance = Math.max(
			this.maxX - this.minX,
			this.maxZ - this.minZ,
			this.maxY - this.minY,
		);
		const frequency = 1 / 4000;
		const centreX = (this.maxX + this.minX) / 2;
		const centreY = (this.maxY + this.minY) / 2;
		const centreZ = (this.maxZ + this.minZ) / 2;
		const cameraTheta = rightNow * frequency;
		this.camera.position.x = cameraDistance * Math.sin(cameraTheta) + centreX;
		this.camera.position.y = this.maxY + 0.25;
		this.camera.position.z = cameraDistance * Math.cos(cameraTheta) + centreZ;
		this.camera.lookAt(centreX, centreY, centreZ);

		this.renderer.render(this.scene, this.camera);
		this.nextFrame = window.requestAnimationFrame(() => {
			this.animate();
		});
	}
}
