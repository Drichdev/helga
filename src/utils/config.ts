const scene = {
	strands: 2,
	perStrand: 20,
	// full rotations from top of a strand to the bottom — integer, so wrap is seamless
	turns: 2,
	// cards per second of ambient descent
	speed: 0.25,
	// strand height relative to viewport, so it runs off both edges
	spanFactor: 1.5
} as const;

const appearance = {
	palette: [
		"#7d9183",
		"#5b7ea3",
		"#c9bfa8",
		"#4f7d78",
		"#a9836a",
		"#6b7280",
		"#77805e",
		"#66757f",
		"#8a8478",
		"#96876f",
		"#5e7268",
		"#6f7d8c",
		"#847e6a",
		"#4e6a74"
	],
	// keeps adjacent strands from showing the same placeholder colors
	paletteStrandOffset: 7,
	brightnessFloor: 0.12,
	maxBlur: 5
} as const;

const image = {
	// 2x the largest breakpoint's card size, for sharpness
	width: 520,
	height: 360
} as const;

const interaction = {
	// per-frame velocity decay after release, at a 60fps reference
	friction: 0.94,
	minMomentum: 0.0005
} as const;

// discrete responsive tiers; the first entry whose minWidth fits the viewport
// wins. Radius and perspective step down with card size so each tier keeps
// the same composition and depth character.
const breakpoints = [
	{ minWidth: 1440, radius: 560, perspective: 1400, cardWidth: 260, cardHeight: 180 },
	{ minWidth: 1024, radius: 420, perspective: 1200, cardWidth: 225, cardHeight: 155 },
	{ minWidth: 640, radius: 310, perspective: 1000, cardWidth: 170, cardHeight: 118 },
	{ minWidth: 0, radius: 220, perspective: 850, cardWidth: 128, cardHeight: 88 }
] as const;

export type Breakpoint = (typeof breakpoints)[number];

export const config = { scene, appearance, image, interaction, breakpoints } as const;
