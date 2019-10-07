import * as React from "react";
import * as Three from "three";
import { Cube } from "../controllers/game";

export interface PerspectiveProps {
	cubes: Cube[];
}

export class Perspective extends React.Component<PerspectiveProps> {
	private mount: HTMLDivElement;
	private camera: Three.PerspectiveCamera;
	private readonly scene: Three.Scene = new Three.Scene();
	private readonly renderer: Three.WebGLRenderer = new Three.WebGLRenderer();
	private readonly sun: Three.DirectionalLight = new Three.DirectionalLight(
		0xaa7755,
	);
	private readonly mouse: Three.Vector2 = new Three.Vector2();
	private readonly mouseRay = new Three.Raycaster();
	private readonly cursor: Three.Mesh = new Three.Mesh(
		new Three.BoxGeometry(1, 1, 1),
		new Three.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }),
	);
	private readonly cubes: Three.Mesh[] = [];
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

		this.camera = new Three.PerspectiveCamera(75, width / height);

		this.renderer.shadowMap.enabled = true;
		this.renderer.setSize(width, height);

		this.scene.background = new Three.Color(0x669999);

		const glow = new Three.AmbientLight(0x5588aa);
		this.scene.add(glow);

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

		this.props.cubes.forEach((cubeProps) => {
			const cube = new Three.Mesh(
				new Three.BoxGeometry(1, 1, 1),
				new Three.MeshLambertMaterial({
					color: cubeProps.type.colour,
				}),
			);
			this.maxX = Math.max(this.maxX, cubeProps.location.east + 0.5);
			this.minX = Math.min(this.minX, cubeProps.location.east - 0.5);
			this.maxZ = Math.max(this.maxZ, cubeProps.location.north + 0.5);
			this.minZ = Math.min(this.minZ, cubeProps.location.north - 0.5);
			this.maxY = Math.max(this.maxY, cubeProps.location.up + 1);
			this.minY = Math.min(this.minY, cubeProps.location.up);
			cube.position.y = cubeProps.location.up + 0.5;
			cube.position.x = cubeProps.location.east;
			cube.position.z = cubeProps.location.north;
			cube.castShadow = true;
			cube.receiveShadow = true;
			this.scene.add(cube);
			this.cubes.push(cube);
		});

		this.animate();
		this.mount.appendChild(this.renderer.domElement);
	}

	public componentWillUnmount(): void {
		cancelAnimationFrame(this.nextFrame);
		this.mount.removeChild(this.renderer.domElement);
	}

	public render(): React.ReactElement {
		return (
			<div
				style={{ width: "100vw", height: "100vh" }}
				ref={this.setMount.bind(this)}
				onMouseMove={this.onMouseMove.bind(this)}
			/>
		);
	}

	private onMouseMove(event: MouseEvent) {
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}

	private setMount(mount: HTMLDivElement | null): void {
		if (mount) {
			this.mount = mount;
		}
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
		const centreX = (this.maxX + this.minX) / 2;
		const centreY = (this.maxY + this.minY) / 2;
		const centreZ = (this.maxZ + this.minZ) / 2;
		const cameraTheta = rightNow / 4000;
		this.camera.position.x = cameraDistance * Math.sin(cameraTheta) + centreX;
		this.camera.position.y = this.maxY + 0.25;
		this.camera.position.z = cameraDistance * Math.cos(cameraTheta) + centreZ;
		this.camera.lookAt(centreX, centreY, centreZ);

		this.mouseRay.setFromCamera(this.mouse, this.camera);
		const intersections = this.mouseRay.intersectObjects(this.cubes);
		if (intersections.length > 0 && intersections[0].face) {
			const position = intersections[0].object.position;
			const normal = intersections[0].face.normal;
			this.cursor.position.x = position.x + normal.x;
			this.cursor.position.y = position.y + normal.y;
			this.cursor.position.z = position.z + normal.z;
			this.scene.add(this.cursor);
		} else {
			this.scene.remove(this.cursor);
		}

		this.renderer.render(this.scene, this.camera);
		this.nextFrame = window.requestAnimationFrame(() => {
			this.animate();
		});
	}
}
