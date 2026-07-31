import "./index.css";
import { MainScene } from "./components/MainScene";
import Loader from "./components/Loader";
import { useImagePreloader } from "./hooks/useImagePreloader";
import { cardImages } from "./utils/images";

export function App() {
  const { progress, ready } = useImagePreloader(cardImages);

  return (
    <div className="app-root">
      <div className={`main-scene-wrap ${ready ? "is-visible" : "is-hidden"}`}>
        <MainScene />
      </div>
      <Loader progress={progress} />
    </div>
  );
}

export default App;
