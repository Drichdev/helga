import { config } from "./config";
import { helixAngle, helixTransform, depthFilter, depthOf } from "./helix";
import { wrap } from "./math";
import type { Viewport } from "./viewport";



const { strands, perStrand, speed } = config.scene;
const { palette, paletteStrandOffset } = config.appearance;

export type Card = {
	el: HTMLDivElement;
	base: number;
	phase: number;
};

const imageUrl = (strand: number, index: number): string =>
	`https://picsum.photos/seed/helix-${strand}-${index}/${config.image.width}/${config.image.height}`;

const placeholderColor = (strand: number, index: number): string =>
	palette[(index + strand * paletteStrandOffset) % palette.length]!;

const createCard = (strand: number, index: number): Card => {
	const el = document.createElement("div");
	el.className = "card";
	el.style.backgroundColor = placeholderColor(strand, index);
	el.style.backgroundImage = `url(${imageUrl(strand, index)})`;
	return { el, base: index, phase: (strand / strands) * 2 * Math.PI };
};

export const createCards = (world: HTMLElement): Card[] => {
	world.innerHTML = "";
	const cards: Card[] = [];
	for (let strand = 0; strand < strands; strand++) {
		for (let index = 0; index < perStrand; index++) {
			const card = createCard(strand, index);
			world.appendChild(card.el);
			cards.push(card);
		}
	}
	return cards;
};

export const renderCards = (cards: Card[], elapsed: number, travel: number, view: Viewport): void => {
	for (const card of cards) {
		// progress along the strand, 0 (top, offscreen) .. 1 (bottom, offscreen)
		const progress = wrap(card.base + elapsed * speed + travel, perStrand) / perStrand;
		const angle = helixAngle(progress, card.phase);
		const y = (progress - 0.5) * view.span;
		card.el.style.transform = helixTransform(angle, y, view.radius);
		card.el.style.filter = depthFilter(depthOf(angle));
	}
};
