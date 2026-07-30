import "$src/style.css";
import { createCards, renderCards } from "./cards";
import { createDrag } from "./drag";
import { createViewportTracker } from "./viewport";



const scene = document.querySelector<HTMLElement>(".scene");
const world = document.getElementById("world");
if (!scene || !world) throw new Error("Missing .scene or #world root element");

const cards = createCards(world);
const viewportTracker = createViewportTracker();
const drag = createDrag(scene, () => viewportTracker.getView().radius);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const start = performance.now();
let lastFrame = start;

const frame = (now: number): void => {
	const elapsed = reducedMotion.matches ? 0 : (now - start) / 1000;
	const dt = Math.min((now - lastFrame) / 1000, 0.1);
	lastFrame = now;

	drag.coast(dt);
	renderCards(cards, elapsed, drag.state.travel, viewportTracker.getView());

	requestAnimationFrame(frame);
};

requestAnimationFrame(frame);
