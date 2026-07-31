import { useEffect, useState } from "react";
import "./Loader.css";

interface LoaderProps {
  progress: number;
}

export default function Loader({ progress }: LoaderProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const clamped = Math.max(0, Math.min(100, Math.round(progress)));

  // Animation fluide du compteur
  useEffect(() => {
    if (displayProgress >= clamped) return;

    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev >= clamped) {
          clearInterval(interval);
          return prev;
        }

        return prev + 1;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [clamped, displayProgress]);

  // Lorsque tout est chargé
  useEffect(() => {
    if (clamped === 100) {
      const timeout = setTimeout(() => {
        setCompleted(true);
      }, 600);

      return () => clearTimeout(timeout);
    }
  }, [clamped]);

  return (
    <div className={`loader-overlay ${completed ? "loader-hide" : ""}`}>
      <div className="loader-inner">
        {/* Pourcentage */}
        <div className="loader-count">
          <span className="loader-number">{displayProgress}</span>
          <span className="loader-percent">%</span>
        </div>

        {/* Barre de progression */}
        <div className="loader-progress">
          <div
            className="loader-progress-fill"
            style={{
              width: `${displayProgress}%`,
            }}
          />
        </div>

        {/* Texte */}
        {/* <div className="loader-status">Chargement des ressources...</div> */}
      </div>
    </div>
  );
}
