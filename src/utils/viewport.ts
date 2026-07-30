import { config } from "./config";

export type Viewport = {
	span: number;
	radius: number;
};

const pickBreakpoint = () =>
	config.breakpoints.find((bp) => window.innerWidth >= bp.minWidth) ??
	config.breakpoints[config.breakpoints.length - 1]!;

// tracks the strand span and active breakpoint, pushing the CSS-facing
// values (card size, perspective) onto the root as custom properties
export const createViewportTracker = (): { getView: () => Viewport; destroy: () => void } => {
	const view: Viewport = { span: 0, radius: 0 };

	const apply = (): void => {
		const bp = pickBreakpoint();
		view.span = window.innerHeight * config.scene.spanFactor;
		view.radius = bp.radius;

		const root = document.documentElement.style;
		root.setProperty("--card-width", `${bp.cardWidth}px`);
		root.setProperty("--card-height", `${bp.cardHeight}px`);
		root.setProperty("--perspective", `${bp.perspective}px`);
	};

	apply();
	window.addEventListener("resize", apply);
	return {
		getView: () => view,
		destroy: () => window.removeEventListener("resize", apply),
	};
};
