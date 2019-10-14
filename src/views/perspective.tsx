import * as React from "react";
import * as Three from "three";
import { Cube, Location } from "../controllers/game";

export interface PerspectiveProps {
	cubes: Cube[];
	addCube: (location: Location) => void;
}

export class Perspective extends React.Component<PerspectiveProps> {
	private static throttle(n: number, limit = 1): number {
		return Math.min(Math.max(n, -Math.abs(limit)), Math.abs(limit));
	}

	private mount: HTMLDivElement;
	private camera = new Three.PerspectiveCamera(75, 1);
	private readonly scene = new Three.Scene();
	private readonly renderer = new Three.WebGLRenderer();
	private readonly sun = new Three.DirectionalLight(0xaa7755);
	private readonly mouse = new Three.Vector2();
	private readonly mouseRay = new Three.Raycaster();
	private readonly cursor = new Three.Mesh(
		new Three.BoxGeometry(1, 1, 1),
		new Three.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }),
	);
	private renderedCubes: Three.Mesh[] = [];
	private cathedralHeight = 0;
	private readonly centre = {
		x: 0,
		y: 0,
		z: 0,
	};
	private longestAxis = 0;
	private cameraDistance = 1;
	private readonly cameraTarget = {
		x: 0,
		y: 0.5,
		z: 0,
	};

	public componentDidMount(): void {
		this.setScene();
		this.lightScene();
		this.updateCubes();
		this.configureRender();
	}

	public componentDidUpdate(): void {
		this.updateCubes();
	}

	public componentWillUnmount(): void {
		this.renderer.setAnimationLoop(null);
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
		this.camera.position.y = 1.25;
		this.renderer.shadowMap.enabled = true;
		this.renderer.setAnimationLoop(this.animationLoop.bind(this));
		this.mount.appendChild(this.renderer.domElement);
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
			new Three.CircleGeometry(32, 256),
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
		const max = {
			x: 0,
			y: 0,
			z: 0,
		};
		const min = {
			x: 0,
			y: 0,
			z: 0,
		};
		this.renderedCubes = this.props.cubes.map((cubeToRender) => {
			const renderedCube = new Three.Mesh(
				new Three.BoxGeometry(1, 1, 1),
				new Three.MeshLambertMaterial({
					color: cubeToRender.type.colour,
				}),
			);
			max.x = Math.max(max.x, cubeToRender.location.east + 0.5);
			max.z = Math.max(max.z, cubeToRender.location.south + 0.5);
			min.x = Math.min(min.x, cubeToRender.location.east - 0.5);
			min.z = Math.min(min.z, cubeToRender.location.south - 0.5);
			max.y = Math.max(max.y, cubeToRender.location.up + 1);
			min.y = Math.min(min.y, cubeToRender.location.up);
			renderedCube.position.y = cubeToRender.location.up + 0.5;
			renderedCube.position.x = cubeToRender.location.east;
			renderedCube.position.z = cubeToRender.location.south;
			renderedCube.castShadow = true;
			renderedCube.receiveShadow = true;
			this.scene.add(renderedCube);
			return renderedCube;
		});
		this.centre.x = (max.x + min.x) / 2;
		this.centre.z = (max.z + min.z) / 2;
		this.centre.y = (max.y + min.y) / 2;
		this.cathedralHeight = max.y;
		this.longestAxis = Math.max(max.x - min.x, max.z - min.z, max.y - min.y);
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

	private adjustLighting(rightNow = new Date().getTime()): void {
		const perDay = 60 * 60 * 24 * 1000;
		const sinceMidnight = rightNow % perDay;
		const solarTheta = (sinceMidnight * 2 * Math.PI) / perDay;
		this.sun.position.x = Math.sin(solarTheta);
		this.sun.position.y = -Math.cos(solarTheta) / Math.sqrt(2);
		this.sun.position.z = this.sun.position.y;
	}

	private adjustCamera(rightNow = new Date().getTime()): void {
		const rotation = (2 * Math.PI * rightNow) / (20 * 1e3);
		const target = this.cameraTarget;
		const position = this.camera.position;
		target.x += Perspective.throttle(this.centre.x - target.x, 0.01);
		target.y += Perspective.throttle(this.centre.y - target.y, 0.01);
		target.z += Perspective.throttle(this.centre.z - target.z, 0.01);
		const distance = this.cameraDistance;
		const zoom = this.longestAxis - distance;
		this.cameraDistance += Perspective.throttle(zoom, 0.01);
		position.x = this.cameraDistance * Math.sin(rotation) + target.x;
		position.z = this.cameraDistance * Math.cos(rotation) + target.z;
		position.y += Perspective.throttle(
			0.25 + this.cathedralHeight - position.y,
			0.01,
		);
		this.camera.lookAt(target.x, target.y, target.z);
		const height = this.mount.clientHeight;
		const width = this.mount.clientWidth;
		const shortestAspect = Math.min(height, width);
		this.renderer.setSize(shortestAspect, shortestAspect);
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

	private animationLoop(): void {
		const rightNow = new Date().getTime();
		this.adjustLighting(rightNow);
		this.adjustCamera(rightNow);
		this.adjustCursor();
		this.renderer.render(this.scene, this.camera);
	}
}
