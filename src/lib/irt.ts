/**
 * Item Response Theory (IRT) Engine
 * Implements the 3-Parameter Logistic (3PL) Model:
 * P(theta) = c + (1 - c) / (1 + exp(-a * (theta - b)))
 * 
 * Where:
 * theta = student ability (-3.0 to +3.0)
 * a = item discrimination (slope)
 * b = item difficulty (threshold)
 * c = guessing parameter (asymptote)
 */

export interface IRTQuestion {
  id: string;
  body: string;
  type: 'mcq' | 'short_answer' | 'code' | 'essay';
  options?: string[];
  correctAnswer: string;
  difficulty: number;      // 'b' parameter: difficulty (-3.0 to +3.0)
  discrimination: number;  // 'a' parameter: discrimination (0.5 to 2.5)
  guessing: number;        // 'c' parameter: guessing chance (0.0 to 0.5)
  bloomLevel: 'remembering' | 'understanding' | 'applying' | 'analyzing' | 'evaluating' | 'creating';
}

/**
 * Calculates the probability of a correct response under 3PL
 */
export function calculateProbability(theta: number, a: number, b: number, c: number): number {
  return c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
}

/**
 * Calculates the Fisher Information of a question at a given ability level (theta)
 */
export function calculateInformation(theta: number, a: number, b: number, c: number): number {
  const p = calculateProbability(theta, a, b, c);
  if (p <= c || p >= 1.0) return 0;
  
  const numerator = Math.pow(a, 2) * (1 - p) * Math.pow(p - c, 2);
  const denominator = Math.pow(1 - c, 2) * p;
  
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Updates the student's estimated ability (theta) and confidence using a Bayesian gradient step
 * returns theta in range [-3.0, 3.0] and confidence in range [0.0, 1.0]
 */
export function updateAbility(
  theta: number,
  confidence: number,
  isCorrect: boolean,
  a: number,
  b: number,
  c: number
): { newTheta: number; newConfidence: number } {
  const p = calculateProbability(theta, a, b, c);
  const u = isCorrect ? 1 : 0;
  
  // Variance is inversely proportional to confidence: var = 1.0 - confidence
  const currentConf = Math.min(Math.max(confidence, 0.05), 0.95);
  const variance = 1.0 - currentConf;

  // Derivative of log-likelihood for 3PL model
  // dL/dTheta = a * (P - c) / (P * (1 - c)) * (u - P)
  const dL_dTheta = (a * (p - c) * (u - p)) / (p * (1 - c));
  
  // Update theta
  let newTheta = theta + variance * dL_dTheta;
  newTheta = Math.min(Math.max(newTheta, -3.0), 3.0);

  // Update confidence based on the information provided by the question
  const info = calculateInformation(newTheta, a, b, c);
  const newVariance = 1 / ((1 / variance) + info);
  
  let newConfidence = 1.0 - newVariance;
  // Ensure confidence slowly goes up and is bounded between 0.1 and 0.98
  newConfidence = Math.min(Math.max(newConfidence, confidence + 0.02), 0.98);

  return { newTheta, newConfidence };
}

/**
 * Selects the question that maximizes the Fisher Information at the student's estimated ability level
 */
export function selectNextQuestion(theta: number, questions: IRTQuestion[], attemptedIds: string[]): IRTQuestion | null {
  const available = questions.filter(q => !attemptedIds.includes(q.id));
  if (available.length === 0) return null;

  let bestQuestion: IRTQuestion | null = null;
  let maxInfo = -1;

  for (const q of available) {
    const info = calculateInformation(theta, q.discrimination, q.difficulty, q.guessing);
    if (info > maxInfo) {
      maxInfo = info;
      bestQuestion = q;
    }
  }

  return bestQuestion;
}

/**
 * Helper to convert theta ability scale [-3.0, 3.0] to visual score [0, 1000]
 */
export function thetaToScore(theta: number): number {
  // Map -3.0 to 0, 0 to 500, +3.0 to 1000
  const normalized = (theta + 3.0) / 6.0;
  return Math.round(Math.min(Math.max(normalized * 1000, 0), 1000));
}

/**
 * Helper to convert visual score [0, 1000] back to theta [-3.0, 3.0]
 */
export function scoreToTheta(score: number): number {
  const normalized = score / 1000;
  return normalized * 6.0 - 3.0;
}
