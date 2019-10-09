import * as React from "react";
import * as Three from "three";
import { Cube, Location } from "../controllers/game";

export interface PerspectiveProps {
	cubes: Cube[];
	addCube: (location: Location) => void;
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
	private renderedCubes: Three.Mesh[] = [];
	private nextFrame: number;
	private maxX: number = 0;
	private maxY: number = 0;
	private maxZ: number = 0;
	private minX: number = 0;
	private minY: number = 0;
	private minZ: number = 0;

	public componentDidMount(): void {
		this.configureRender();
		this.setScene();
		this.lightScene();
		this.updateCubes();
		this.initialiseAnimation();
		this.mount.appendChild(this.renderer.domElement);
	}

	public componentDidUpdate(): void {
		this.updateCubes();
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
				onClick={this.onMouseClick.bind(this)}
			/>
		);
	}

	private configureRender(): void {
		const width = this.mount.clientWidth;
		const height = this.mount.clientHeight;
		this.camera = new Three.PerspectiveCamera(75, width / height);
		this.renderer.shadowMap.enabled = true;
		this.renderer.setSize(width, height);
	}

	private lightScene(): void {
		const glow = new Three.AmbientLight(0x5588aa);
		this.scene.add(glow);
		this.sun.castShadow = true;
		this.scene.add(this.sun);
	}

	private setScene(): void {
		this.scene.background = new Three.Color(0x5588aa);
		const grass = new Three.Mesh(
			new Three.CircleGeometry(32, 64),
			new Three.MeshLambertMaterial({
				color: 0x008800,
			}),
		);
		grass.rotateX(-Math.PI / 2);
		grass.receiveShadow = true;
		this.scene.add(grass);
	}

	private updateCubes(): void {
		// TODO This is overkill, but optimisation now is premature
		this.renderedCubes.forEach((renderedCube) => {
			this.scene.remove(renderedCube);
		});
		this.renderedCubes = this.props.cubes.map((cubeToRender) => {
			const renderedCube = new Three.Mesh(
				new Three.BoxGeometry(1, 1, 1),
				new Three.MeshLambertMaterial({
					color: cubeToRender.type.colour,
				}),
			);
			this.maxX = Math.max(this.maxX, cubeToRender.location.east + 0.5);
			this.minX = Math.min(this.minX, cubeToRender.location.east - 0.5);
			this.maxZ = Math.max(this.maxZ, cubeToRender.location.south + 0.5);
			this.minZ = Math.min(this.minZ, cubeToRender.location.south - 0.5);
			this.maxY = Math.max(this.maxY, cubeToRender.location.up + 1);
			this.minY = Math.min(this.minY, cubeToRender.location.up);
			renderedCube.position.y = cubeToRender.location.up + 0.5;
			renderedCube.position.x = cubeToRender.location.east;
			renderedCube.position.z = cubeToRender.location.south;
			renderedCube.castShadow = true;
			renderedCube.receiveShadow = true;
			this.scene.add(renderedCube);
			return renderedCube;
		});
	}

	private onMouseMove(event: MouseEvent) {
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}

	private onMouseClick() {
		this.props.addCube({
			east: this.cursor.position.x,
			south: this.cursor.position.z,
			up: this.cursor.position.y - 0.5,
		});
	}

	private setMount(mount: HTMLDivElement | null): void {
		if (mount) {
			this.mount = mount;
		}
	}

	private adjustLighting(rightNow: number = new Date().getTime()): void {
		const perDay = 60 * 60 * 24 * 1000;
		const sinceMidnight = rightNow % perDay;
		const solarTheta = (sinceMidnight * 2 * Math.PI) / perDay;
		this.sun.position.x = Math.sin(solarTheta);
		this.sun.position.y = -Math.cos(solarTheta) / Math.sqrt(2);
		this.sun.position.z = this.sun.position.y;
	}

	private adjustCamera(rightNow: number = new Date().getTime()): void {
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
	}

	private adjustCursor(): void {
		this.mouseRay.setFromCamera(this.mouse, this.camera);
		const intersections = this.mouseRay.intersectObjects(this.renderedCubes);
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
	}

	private initialiseAnimation(): void {
		const rightNow = new Date().getTime();
		this.adjustLighting(rightNow);
		this.adjustCamera(rightNow);
		this.adjustCursor();
		this.renderer.render(this.scene, this.camera);
		this.nextFrame = window.requestAnimationFrame(
			this.initialiseAnimation.bind(this),
		);
	}
}
