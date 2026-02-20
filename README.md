# 🏏 Fan Insight Generator

> An AI-powered cricket match scenario analyser built with React + Vite.

Describe any cricket situation in plain English — _"India needs 20 runs in 6 balls, 2 wickets left"_ — and get an instant structured analysis with a win probability gauge and contextual match commentary.

---

## ✨ Features

- **Natural language input** — type any match scenario freely
- **Win Probability gauge** — animated percentage with contextual colour coding
- **Match Analysis text** — paragraph-style commentary that adapts to the scenario
- **Quick example chips** — one-click scenario presets
- **Component-separated architecture** — clean separation of Input, Output, and Logic
- **Fully responsive** — works on mobile and desktop

---

## 📁 Project Structure

```
fan-insight-generator/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ScenarioInput.jsx    ← Controlled input, examples, submit button
│   │   └── InsightOutput.jsx    ← Probability gauge + analysis display
│   ├── logic/
│   │   └── analysisEngine.js   ← Pure functions: parser, probability calc, text gen
│   ├── App.jsx                  ← Root component — state management & coordination
│   ├── main.jsx                 ← React DOM entry point
│   └── index.css                ← Global styles & design system
├── index.html
├── package.json
└── vite.config.js
```

### Component Responsibilities

| File                | Role                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `App.jsx`           | Owns all shared state (`scenario`, `result`, `isLoading`). Wires Input → Logic → Output.                                       |
| `ScenarioInput.jsx` | Presentational + controlled. Receives `value`, `onChange`, `onSubmit` via props. No business logic.                            |
| `InsightOutput.jsx` | Purely display. Renders probability gauge and analysis text from props.                                                        |
| `analysisEngine.js` | Pure functions only. `parseScenario`, `calculateWinProbability`, `generateAnalysis`, `analyzeScenario`. Zero React dependency. |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/fan-insight-generator.git
cd fan-insight-generator

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build       # outputs to /dist
npm run preview     # preview the production build locally
```

### Deploy to Vercel (recommended)

```bash
npm i -g vercel
vercel
```

Or connect the GitHub repo to [vercel.com](https://vercel.com) for automatic deployments.

---

## 🧠 How the Analysis Engine Works

The engine lives entirely in `src/logic/analysisEngine.js` as pure, framework-agnostic functions:

1. **`parseScenario(input)`** — regex + keyword extraction to pull out `runs`, `balls`, `wickets`, `overs`, and boolean flags (`isBatting`, `isHighPressure`, `hasMomentum`, `isCollapseRisk`).

2. **`calculateWinProbability(scenario)`** — rule-based model:
   - Base probability derived from Required Run Rate (RRR = runs/balls × 6)
   - Adjusted by wickets in hand (±10–18 points)
   - Modified by context flags (momentum, pressure, collapse risk)
   - Clamped to [3, 97] to avoid 0% / 100% overconfidence

3. **`generateAnalysis(scenario, winProb)`** — template-driven text generation:
   - Picks from pools of opening/closing sentences (seeded by scenario content)
   - Generates a run-rate sentence that adapts its language to how achievable the target is
   - Adds wicket context, momentum notes, and a win-probability narrative sentence
   - Returns a single flowing paragraph

4. **`analyzeScenario(input)`** — main entry point; validates input, calls all three functions, returns `{ analysis, winProbability, error }`.

---

## 🤖 GenAI Usage Documentation

_(Required section as per assignment brief)_

### Tools Used

- **Claude (claude.ai)** — used as the primary AI assistant throughout development.

### How Prompts Were Structured

Prompts were goal-oriented and detailed, specifying:

- The target deliverable (e.g., "a pure-function JS module that parses cricket scenarios")
- Constraints (no external APIs, mocked logic is fine, must be testable)
- Architecture requirements (component separation, prop drilling vs state lift)
- Aesthetic direction (dark scoreboard theme, Barlow Condensed + Lora fonts)

Example prompt pattern used:

> _"Write a React component called `ScenarioInput` that is fully controlled — it receives `value`, `onChange`, `onSubmit`, and `isLoading` as props and contains no internal state. Include example chips that populate the textarea. Keyboard shortcut: Ctrl+Enter to submit."_

### What Was AI-Assisted vs Written Independently

| Part                                          | Origin                                                                      |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| Directory structure & architecture design     | Human-directed, AI scaffolded                                               |
| `analysisEngine.js` — overall structure       | Human-designed (pure functions requirement)                                 |
| `analysisEngine.js` — RRR probability formula | Human-authored rule table; AI helped tune edge cases                        |
| `analysisEngine.js` — text generation pools   | Human wrote scenario-specific sentences; AI suggested phrasing improvements |
| `ScenarioInput.jsx` & `InsightOutput.jsx`     | AI-generated from detailed prop specs; reviewed and adjusted                |
| `App.jsx` state management                    | Human-authored; AI verified hook usage correctness                          |
| `index.css` — design system variables         | Human-directed aesthetic; AI generated implementation                       |
| `index.css` — animations & gauge styling      | AI-generated with human adjustments to timing curves                        |
| `README.md`                                   | Human-structured; AI assisted with wording                                  |

### How AI Output Was Validated and Improved

1. **Logic correctness** — the probability formula was manually verified against known cricket scenarios (e.g., 20 off 6 balls should give ~15–25%, not 50%). Values were adjusted by hand.

2. **Text quality** — generated commentary sentences were read aloud for naturalness and edited to remove generic phrasing. Several AI-suggested lines were replaced entirely.

3. **Component isolation** — verified that `ScenarioInput` and `InsightOutput` contain zero business logic by reading each file independently and confirming they only use props.

4. **Edge cases tested manually**:
   - Empty input → shows error card
   - Single word input → shows error
   - No numbers in scenario → falls back to base 50% with generic commentary
   - Very high RRR (30+ per over) → clamps to ~3–8%
   - Very low RRR (3 per over) → clamps to ~85–97%

5. **CSS cross-browser check** — tested in Chrome, Firefox, and Safari. Fixed `resize: vertical` on textarea and `overflow: visible` on gauge track for Safari.

---

## 📜 License

MIT — free to use, modify, and distribute.
