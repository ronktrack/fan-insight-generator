/**
 * analysisEngine.js
 * Core logic for parsing match scenarios and generating insights.
 * Pure functions — no side effects, easily testable.
 */

// ─── Keyword extraction helpers ────────────────────────────────────────────────

function extractNumbers(text) {
  const matches = text.match(/\d+/g);
  return matches ? matches.map(Number) : [];
}

function containsAny(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

// ─── Scenario parser ───────────────────────────────────────────────────────────

export function parseScenario(input) {
  const text = input.toLowerCase();
  const numbers = extractNumbers(text);

  const runs =
    numbers.find((n, i) => text.includes(`${n} run`) || (i === 0 && n < 500)) ??
    null;

  const balls =
    numbers.find(
      (n) => text.includes(`${n} ball`) || text.includes(`${n} delivery`),
    ) ?? null;

  const wickets =
    numbers.find(
      (n) => text.includes(`${n} wicket`) || text.includes(`${n} wkt`),
    ) ?? null;

  const overs = numbers.find((n) => text.includes(`${n} over`)) ?? null;

  const isBatting = containsAny(text, [
    "needs",
    "need",
    "chasing",
    "require",
    "target",
  ]);
  const isHighPressure = containsAny(text, [
    "final",
    "last over",
    "super over",
    "final ball",
    "must win",
  ]);
  const hasMomentum = containsAny(text, [
    "on fire",
    "momentum",
    "six off every",
    "smashing",
    "dominant",
  ]);
  const isCollapseRisk = containsAny(text, [
    "collapse",
    "panic",
    "tail",
    "last wicket",
    "last pair",
  ]);

  return {
    runs,
    balls,
    wickets,
    overs,
    isBatting,
    isHighPressure,
    hasMomentum,
    isCollapseRisk,
    raw: text,
  };
}

// ─── Win probability calculator ────────────────────────────────────────────────

export function calculateWinProbability(scenario) {
  const {
    runs,
    balls,
    wickets,
    isBatting,
    isHighPressure,
    hasMomentum,
    isCollapseRisk,
  } = scenario;

  // Default base
  let prob = 50;

  if (runs !== null && balls !== null) {
    const rrr = balls > 0 ? (runs / balls) * 6 : Infinity; // Required run rate

    if (rrr <= 6) prob = 78;
    else if (rrr <= 9) prob = 62;
    else if (rrr <= 12) prob = 44;
    else if (rrr <= 15) prob = 28;
    else if (rrr <= 18) prob = 16;
    else prob = 8;
  }

  // Wickets in hand adjustment
  if (wickets !== null) {
    if (wickets >= 7) prob += 12;
    else if (wickets >= 4) prob += 5;
    else if (wickets === 2) prob -= 10;
    else if (wickets === 1) prob -= 18;
  }

  // Context modifiers
  if (!isBatting) prob = 100 - prob; // Flip for bowling team
  if (isHighPressure) prob -= 5;
  if (hasMomentum) prob += 8;
  if (isCollapseRisk) prob -= 12;

  // Clamp to [3, 97]
  return Math.max(3, Math.min(97, Math.round(prob)));
}

// ─── Analysis text generator ───────────────────────────────────────────────────

const openingLines = [
  "This is a knife-edge finish.",
  "The pressure is absolutely immense right now.",
  "All eyes are on the middle — this is what cricket is made of.",
  "The crowd is on its feet. Every delivery could be the last.",
  "We're in the business end of this match, and nerves will decide it.",
];

const closingLines = [
  "Experience and composure will be the deciding factors.",
  "Expect fireworks — or heartbreak — in these final moments.",
  "History is waiting to be written on this pitch.",
  "Cricket's magic lives in exactly these moments.",
  "One moment of brilliance could change everything.",
];

function pick(arr, seed) {
  return arr[seed % arr.length];
}

export function generateAnalysis(scenario, winProb) {
  const {
    runs,
    balls,
    wickets,
    isBatting,
    isHighPressure,
    hasMomentum,
    isCollapseRisk,
    raw,
  } = scenario;
  const seed = raw.length + (runs ?? 0) + (balls ?? 0);

  const lines = [];

  // Opening
  lines.push(pick(openingLines, seed));

  // Run-rate analysis
  if (runs !== null && balls !== null) {
    const rrr = ((runs / balls) * 6).toFixed(1);
    const rpo = (runs / (balls / 6)).toFixed(1);

    if (balls <= 6) {
      lines.push(
        `With just ${balls} ball${balls > 1 ? "s" : ""} remaining and ${runs} runs needed, the required rate is a staggering ${rrr} per over — a near-impossible ask that will demand back-to-back maximums.`,
      );
    } else {
      lines.push(
        `${runs} runs off ${balls} balls translates to a required run rate of ${rrr} — ${
          parseFloat(rrr) > 12
            ? "a Herculean target that even the best finishers would struggle with"
            : parseFloat(rrr) > 9
              ? "challenging but achievable with clean hitting and no panic"
              : "a gettable target if the batting side keeps their heads"
        }.`,
      );
    }
  } else if (runs !== null) {
    lines.push(
      `With ${runs} runs on the board, the context of the match defines everything — pitch conditions, match format, and batting depth all play critical roles.`,
    );
  }

  // Wicket analysis
  if (wickets !== null) {
    if (wickets <= 1) {
      lines.push(
        `Crucially, the batting side has only ${wickets} wicket${wickets !== 1 ? "s" : ""} remaining. ${
          isCollapseRisk
            ? "A late-order collapse has already exposed the tail, and the pressure on the last pair will be immense."
            : "The last wicket partnership is a volatile commodity — one good delivery ends it all."
        }`,
      );
    } else if (wickets <= 3) {
      lines.push(
        `${wickets} wickets in hand gives them some buffer, but a quick breakthrough could send the tail crumbling. The fielding side will be hunting for the danger batter aggressively.`,
      );
    } else {
      lines.push(
        `With ${wickets} wickets available, the batting side has the luxury of intent — they can play their shots without fear of immediate collapse.`,
      );
    }
  }

  // Momentum / pressure context
  if (isHighPressure) {
    lines.push(
      "The high-stakes nature of this game amplifies every error — a misfield, a dropped catch, or a wide could swing the momentum catastrophically.",
    );
  }

  if (hasMomentum) {
    lines.push(
      "Momentum is firmly with the batting side right now. A batter in this kind of form can make the required rate feel irrelevant — momentum is its own weapon.",
    );
  }

  // Win probability narrative
  if (winProb >= 70) {
    lines.push(
      `At ${winProb}% win probability, the batting side are clear favourites — but in cricket, nothing is guaranteed until that final run is scored.`,
    );
  } else if (winProb >= 50) {
    lines.push(
      `The ${winProb}% win probability reflects a genuine contest. This match is on a razor's edge, and both sides have real reasons to believe.`,
    );
  } else if (winProb >= 30) {
    lines.push(
      `A ${winProb}% chance is daunting, but cricket has seen bigger upsets. They'll need something extraordinary — a big over, or a rapid collapse from the opposition.`,
    );
  } else {
    lines.push(
      `At just ${winProb}%, this is a long shot — but sport loves a miracle. Stranger things have happened on a cricket pitch.`,
    );
  }

  // Closer
  lines.push(pick(closingLines, seed + 1));

  return lines.join(" ");
}

// ─── Main entry point ──────────────────────────────────────────────────────────

export function analyzeScenario(input) {
  if (!input || input.trim().length < 5) {
    return {
      analysis: null,
      winProbability: null,
      error: "Please enter a match scenario with enough detail to analyze.",
    };
  }

  const scenario = parseScenario(input);
  const winProbability = calculateWinProbability(scenario);
  const analysis = generateAnalysis(scenario, winProbability);

  return { analysis, winProbability, error: null };
}
