import React, { useEffect, useRef } from "react";

/**
 * InsightOutput
 * Displays the generated analysis text and win probability gauge.
 *
 * Props:
 *  - analysis: string | null
 *  - winProbability: number | null  (0–100)
 *  - error: string | null
 *  - scenario: string               (original input, shown as context)
 */
export default function InsightOutput({
  analysis,
  winProbability,
  error,
  scenario,
}) {
  const sectionRef = useRef(null);

  // Scroll into view when new results arrive
  useEffect(() => {
    if (analysis || error) {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [analysis, error]);

  if (!analysis && !error) return null;

  const probLabel =
    winProbability >= 70
      ? "Strong Favourite"
      : winProbability >= 50
        ? "Slight Edge"
        : winProbability >= 30
          ? "Under Pressure"
          : "Long Shot";

  const probClass =
    winProbability >= 70
      ? "prob-high"
      : winProbability >= 50
        ? "prob-mid"
        : winProbability >= 30
          ? "prob-low"
          : "prob-critical";

  return (
    <section className="output-section" ref={sectionRef} aria-live="polite">
      {error ? (
        <div className="error-card" role="alert">
          <span className="error-icon">⚠</span>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Scenario echo */}
          <div className="scenario-echo">
            <span className="echo-label">Scenario</span>
            <span className="echo-text">"{scenario}"</span>
          </div>

          {/* Win probability */}
          <div className={`prob-card ${probClass}`}>
            <div className="prob-header">
              <span className="prob-title">Win Probability</span>
              <span className="prob-label-badge">{probLabel}</span>
            </div>

            <div className="prob-display">
              <span className="prob-number">{winProbability}</span>
              <span className="prob-percent">%</span>
            </div>

            {/* Gauge bar */}
            <div
              className="gauge-track"
              role="img"
              aria-label={`Win probability: ${winProbability}%`}
            >
              <div
                className="gauge-fill"
                style={{ width: `${winProbability}%` }}
              />
              <div
                className="gauge-marker"
                style={{ left: `${winProbability}%` }}
              />
            </div>

            <div className="gauge-ends">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Analysis text */}
          <div className="analysis-card">
            <div className="analysis-header">
              <span className="analysis-icon">🏏</span>
              <span className="analysis-title">Match Analysis</span>
            </div>
            <p className="analysis-text">{analysis}</p>
          </div>

          {/* Disclaimer */}
          <p className="disclaimer">
            AI-generated insight for entertainment purposes only. Predictions
            are not guarantees.
          </p>
        </>
      )}
    </section>
  );
}
