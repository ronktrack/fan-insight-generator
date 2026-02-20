import React, { useRef, useEffect } from "react";

/**
 * ScenarioInput
 * Controlled input component for entering a match scenario.
 *
 * Props:
 *  - value: string          — current input value
 *  - onChange: fn(string)   — called when user types
 *  - onSubmit: fn()         — called when user clicks Analyse or presses Enter
 *  - isLoading: boolean     — disables controls while processing
 */
export default function ScenarioInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}) {
  const textareaRef = useRef(null);

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  function handleKeyDown(e) {
    // Ctrl/Cmd + Enter submits
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  }

  const EXAMPLES = [
    "India needs 20 runs in 6 balls, 2 wickets left",
    "Australia chasing 280, 220/4 after 40 overs",
    "Last over thriller, 12 runs needed, 1 wicket left",
    "England vs NZ, final 5 overs, 45 to win, 6 wickets in hand",
  ];

  function loadExample(example) {
    onChange(example);
    textareaRef.current?.focus();
  }

  return (
    <section className="input-section">
      <div className="input-label-row">
        <label htmlFor="scenario-input" className="input-label">
          Match Scenario
        </label>
        <span className="input-hint">Ctrl + Enter to analyse</span>
      </div>

      <textarea
        id="scenario-input"
        ref={textareaRef}
        className="scenario-textarea"
        placeholder="Describe the match situation…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        rows={3}
        maxLength={400}
        aria-label="Match scenario input"
      />

      <div className="char-count">{value.length} / 400</div>

      <div className="examples-row">
        <span className="examples-label">Try:</span>
        <div className="examples-list">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              className="example-chip"
              onClick={() => loadExample(ex)}
              disabled={isLoading}
              type="button"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <button
        className={`analyse-btn ${isLoading ? "loading" : ""}`}
        onClick={onSubmit}
        disabled={isLoading || value.trim().length < 5}
        type="button"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Analysing…
          </>
        ) : (
          <>
            <span className="btn-icon" aria-hidden="true">
              ⚡
            </span>
            Analyse Match
          </>
        )}
      </button>
    </section>
  );
}
