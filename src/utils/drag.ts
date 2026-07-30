import { config } from "./config";

const { perStrand, turns } = config.scene;
const { friction, minMomentum } = config.interaction;

// converts px of horizontal drag into strand progress (in cards) such that
// front cards track the pointer at roughly 1:1 at the current helix radius
const sensitivityFor = (radius: number): number =>
	(1 / radius) * (perStrand / (turns * 2 * Math.PI));

type DragState = {
	travel: number;
	velocity: number;
	dragging: boolean;
	lastX: number;
	lastMoveTime: number;
};

export type Drag = {
	state: DragState;
	coast: (dt: number) => void;
	destroy: () => void;
};

// Dragging scrubs the spiral along its own path of motion: it advances every
// card's strand progress, so they corkscrew exactly as they do when drifting.
export const createDrag = (surface: HTMLElement, getRadius: () => number): Drag => {
	const state: DragState = {
		travel: 0,
		velocity: 0,
		dragging: false,
		lastX: 0,
		lastMoveTime: 0
	};

	const onDown = (e: PointerEvent): void => {
		state.dragging = true;
		state.velocity = 0;
		state.lastX = e.clientX;
		state.lastMoveTime = e.timeStamp;
		surface.setPointerCapture(e.pointerId);
	};

	const onMove = (e: PointerEvent): void => {
		if (!state.dragging) return;
		const dx = e.clientX - state.lastX;
		const dt = (e.timeStamp - state.lastMoveTime) / 1000;
		state.lastX = e.clientX;
		state.lastMoveTime = e.timeStamp;
		const dTravel = dx * sensitivityFor(getRadius());
		state.travel += dTravel;
		if (dt > 0) state.velocity = dTravel / dt;
	};

	const onUp = (): void => {
		state.dragging = false;
	};

	surface.addEventListener("pointerdown", onDown);
	surface.addEventListener("pointermove", onMove);
	surface.addEventListener("pointerup", onUp);
	surface.addEventListener("pointercancel", onUp);

	const destroy = (): void => {
		surface.removeEventListener("pointerdown", onDown);
		surface.removeEventListener("pointermove", onMove);
		surface.removeEventListener("pointerup", onUp);
		surface.removeEventListener("pointercancel", onUp);
	};

	const coast = (dt: number): void => {
		if (state.dragging || state.velocity === 0) return;
		state.travel += state.velocity * dt;
		state.velocity *= Math.pow(friction, dt * 60);
		if (Math.abs(state.velocity) < minMomentum) state.velocity = 0;
	};

	return { state, coast, destroy };
};
