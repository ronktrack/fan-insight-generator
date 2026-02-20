import React, { useState, useCallback } from "react";
import ScenarioInput from "./components/ScenarioInput";
import InsightOutput from "./components/InsightOutput";
import { analyzeScenario } from "./logic/analysisEngine";
import "./index.css";

/**
 * App — root component.
 * Owns all shared state and coordinates between Input and Output.
 */
export default function App() {
  const [scenario, setScenario] = useState("");
  const [result, setResult] = useState({
    analysis: null,
    winProbability: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submittedScenario, setSubmittedScenario] = useState("");

  // Simulate a short async "thinking" delay for UX realism
  const handleAnalyse = useCallback(async () => {
    if (!scenario.trim() || isLoading) return;

    setIsLoading(true);
    setResult({ analysis: null, winProbability: null, error: null });

    await new Promise((res) => setTimeout(res, 900));

    const output = analyzeScenario(scenario);
    setSubmittedScenario(scenario);
    setResult(output);
    setIsLoading(false);
  }, [scenario, isLoading]);

  return (
    <div className="app-wrapper">
      {/* Background decorative elements */}
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-glow" aria-hidden="true" />

      <main className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="header-badge">LIVE ANALYSIS</div>
          <h1 className="app-title">
            Fan Insight
            <span className="title-accent"> Generator</span>
          </h1>
          <p className="app-subtitle">
            Describe any cricket match scenario and get an instant AI-powered
            analysis with win probability.
          </p>
        </header>

        {/* Input Component */}
        <ScenarioInput
          value={scenario}
          onChange={setScenario}
          onSubmit={handleAnalyse}
          isLoading={isLoading}
        />

        {/* Output Component */}
        <InsightOutput
          analysis={result.analysis}
          winProbability={result.winProbability}
          error={result.error}
          scenario={submittedScenario}
        />
      </main>

      <footer className="app-footer">
        Built with React · Fan Insight Generator
      </footer>
    </div>
  );
}
