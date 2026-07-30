import { useEffect, useRef } from "react";
import "./index.css";
import { createCards, renderCards } from "./utils/cards";
import { createDrag } from "./utils/drag";
import { createViewportTracker } from "./utils/viewport";
import GlassSurface from "./components/GlassSurface";

export function App() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const world = worldRef.current;
    if (!scene || !world) return;

    const cards = createCards(world);
    const { getView, destroy: destroyViewport } = createViewportTracker();
    const drag = createDrag(scene, () => getView().radius);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const start = performance.now();
    let lastFrame = start;
    let animId: number;

    const frame = (now: number): void => {
      const elapsed = reducedMotion.matches ? 0 : (now - start) / 1000;
      const dt = Math.min((now - lastFrame) / 1000, 0.1);
      lastFrame = now;

      drag.coast(dt);
      renderCards(cards, elapsed, drag.state.travel, getView());

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      drag.destroy();
      destroyViewport();
      world.innerHTML = "";
    };
  }, []);

  return (
    <div className="scene" ref={sceneRef}>
      <div className="world" id="world" ref={worldRef}></div>
      <div className="vignette"></div>

      <GlassSurface
        width={300}
        height={200}
        borderRadius={50}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
        }}
      >
        <h2>Glass Surface Content</h2>
      </GlassSurface>

    </div>
  );
}

export default App;
