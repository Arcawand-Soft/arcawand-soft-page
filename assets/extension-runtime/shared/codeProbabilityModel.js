(function initCodeProbabilityModel(global) {
  const CONFIG = Object.freeze({
    languagePrior: -3.35,
    patternWeight: 1.55,
    keywordWeight: 0.72,
    familyWeight: 0.72,
    familyCeiling: 2.2,
    minimumCodeProbability: 0.46,
    textMarginRatio: 1.18,
    maximumFrequency: 24,
    maximumKeywordFrequency: 12
  });

  function evidenceFromCounts(patternCounts, keywordCounts) {
    const distinctFamilies = patternCounts.filter((count) => count > 0).length;
    const frequencyEvidence = patternCounts.reduce((sum, count) => (
      sum + Math.log1p(Math.min(Math.max(0, count), CONFIG.maximumFrequency)) * CONFIG.patternWeight
    ), 0);
    const keywordEvidence = keywordCounts.reduce((sum, count) => (
      sum + Math.log1p(Math.min(Math.max(0, count), CONFIG.maximumKeywordFrequency)) * CONFIG.keywordWeight
    ), 0);
    return {
      distinctFamilies,
      logit: CONFIG.languagePrior
        + frequencyEvidence
        + keywordEvidence
        + Math.min(CONFIG.familyCeiling, distinctFamilies * CONFIG.familyWeight)
    };
  }

  function normalize(candidates) {
    const maxLogit = Math.max(...candidates.map((candidate) => candidate.logit));
    const weighted = candidates.map((candidate) => Object.assign({}, candidate, {
      weight: Math.exp(Math.max(-40, candidate.logit - maxLogit))
    }));
    const totalWeight = weighted.reduce((sum, candidate) => sum + candidate.weight, 0) || 1;
    return weighted.map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      score: candidate.logit,
      probability: candidate.weight / totalWeight,
      evidenceFamilies: candidate.evidenceFamilies || 0
    })).sort((left, right) => right.probability - left.probability);
  }

  function decide(probabilities, context = {}) {
    const best = probabilities[0];
    const textCandidate = probabilities.find((candidate) => candidate.id === "dev-general");
    const isCode = Boolean(best)
      && best.id !== "dev-general"
      && best.probability >= CONFIG.minimumCodeProbability
      && best.probability >= (textCandidate?.probability || 0) * CONFIG.textMarginRatio
      && (best.evidenceFamilies >= 1 || context.definitive || context.hinted);
    return { best, textCandidate, isCode };
  }

  global.MCP = Object.assign(global.MCP || {}, {
    CodeProbabilityModel: Object.freeze({ CONFIG, evidenceFromCounts, normalize, decide })
  });
})(globalThis);
