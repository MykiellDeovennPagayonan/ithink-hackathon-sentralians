export interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  participants: number;
  completionRate: number;
  createdBy: string;
  latexEquation: string;
  instructions?: string; // New field for additional instructions like "Find:", "Solve for:", etc.
  correctSolution?: string;
  hints?: string[];
}

export const mockProblems: Problem[] = [
  {
    id: "1",
    title: "Linear Equations Fundamentals",
    description:
      "Solve this system of linear equations using elimination or substitution method. Show all your work and clearly indicate your final answer.",
    category: "Algebra",
    difficulty: "Easy",
    participants: 1247,
    completionRate: 87,
    createdBy: "Prof. Martinez",
    latexEquation: "\\begin{cases} 2x + 3y = 12 \\\\ 4x - y = 5 \\end{cases}",
    instructions: "Find: x and y",
    correctSolution: "x = 2, y = 8/3",
    hints: [
      "Try isolating one variable in one of the equations",
      "You can multiply the second equation by 3 to make elimination easier",
      "After finding x, substitute back to find y",
    ],
  },
  {
    id: "2",
    title: "Projectile Motion Analysis",
    description:
      "A ball is thrown from ground level with given initial conditions. Calculate the maximum height and horizontal range using kinematic equations.",
    category: "Physics",
    difficulty: "Medium",
    participants: 892,
    completionRate: 73,
    createdBy: "Dr. Wilson",
    latexEquation:
      "v_0 = 20 \\text{ m/s}, \\quad \\theta = 30°, \\quad g = 9.8 \\text{ m/s}^2",
    instructions: "Find: Maximum height (h_{max}) and horizontal range (R)",
    correctSolution: "Maximum height: 5.1 m, Horizontal range: 35.3 m",
    hints: [
      "Break the initial velocity into horizontal and vertical components",
      "The maximum height occurs when vertical velocity becomes zero",
      "The range is determined by the time it takes to return to the ground",
    ],
  },
  {
    id: "3",
    title: "Limits and Continuity",
    description:
      "Evaluate the following limit using algebraic manipulation. Show each step of your solution process.",
    category: "Calculus 1",
    difficulty: "Medium",
    participants: 1156,
    completionRate: 68,
    createdBy: "Prof. Chen",
    latexEquation: "\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}",
    instructions: "Evaluate the limit",
    correctSolution: "4",
    hints: [
      "Try factoring the numerator",
      "Notice that x² - 4 = (x - 2)(x + 2)",
      "After factoring, you can cancel common terms",
    ],
  },
  {
    id: "4",
    title: "Normal Distribution Probability",
    description:
      "Calculate the probability for a normally distributed random variable within a given range. Use the standard normal distribution.",
    category: "Statistics",
    difficulty: "Hard",
    participants: 634,
    completionRate: 45,
    createdBy: "Dr. Patel",
    latexEquation: "X \\sim N(75, 8^2)",
    instructions: "Find: P(70 < X < 85)",
    correctSolution: "0.6826",
    hints: [
      "Convert to z-scores: z = (x - μ)/σ",
      "Find the z-scores for 70 kg and 85 kg",
      "Use the standard normal table or calculator to find the probability",
    ],
  },
  {
    id: "5",
    title: "Chemical Equilibrium Constant",
    description:
      "Calculate the equilibrium constant for the given chemical reaction using the equilibrium concentrations.",
    category: "Chemistry",
    difficulty: "Medium",
    participants: 758,
    completionRate: 62,
    createdBy: "Dr. Rodriguez",
    latexEquation:
      "\\text{PCl}_5(g) \\rightleftharpoons \\text{PCl}_3(g) + \\text{Cl}_2(g)",
    instructions:
      "Given: Initial [PCl₅] = 0.30 M, Equilibrium [PCl₃] = 0.20 M. Find: Kc",
    correctSolution: "0.133",
    hints: [
      "Set up an ICE table (Initial, Change, Equilibrium)",
      "Remember that PCl₃ and Cl₂ are produced in equal molar amounts",
      "Kc = [PCl₃][Cl₂]/[PCl₅]",
    ],
  },
  {
    id: "6",
    title: "Quadratic Function Analysis",
    description:
      "Analyze the given quadratic function to find its key characteristics. Show your work for each part.",
    category: "Algebra",
    difficulty: "Easy",
    participants: 1523,
    completionRate: 91,
    createdBy: "Prof. Johnson",
    latexEquation: "f(x) = 2x^2 - 8x + 6",
    instructions: "Find: vertex, y-intercept, and x-intercepts",
    correctSolution: "Vertex: (2, -2), y-intercept: 6, x-intercepts: 1 and 3",
    hints: [
      "The vertex can be found using x = -b/(2a)",
      "The y-intercept is f(0)",
      "For x-intercepts, solve f(x) = 0",
    ],
  },
  {
    id: "7",
    title: "Electromagnetic Wave Properties",
    description:
      "Calculate the wavelength and photon energy for electromagnetic radiation at the given frequency.",
    category: "Physics",
    difficulty: "Hard",
    participants: 445,
    completionRate: 38,
    createdBy: "Dr. Maxwell",
    latexEquation:
      "f = 98.5 \\text{ MHz}, \\quad c = 3.00 \\times 10^8 \\text{ m/s}, \\quad h = 6.63 \\times 10^{-34} \\text{ J·s}",
    instructions: "Find: wavelength (λ) and photon energy (E)",
    correctSolution: "Wavelength: 3.05 m, Energy: 6.53 × 10⁻²⁶ J",
    hints: [
      "Use the wave equation: c = λf",
      "For photon energy, use E = hf",
      "Make sure your units are consistent",
    ],
  },
  {
    id: "8",
    title: "Derivative Applications",
    description:
      "Find the derivative and analyze the critical points of the given function. Classify each critical point.",
    category: "Calculus 1",
    difficulty: "Medium",
    participants: 987,
    completionRate: 71,
    createdBy: "Prof. Taylor",
    latexEquation: "f(x) = x^3 - 6x^2 + 9x + 2",
    instructions:
      "Find: f'(x), critical points, and classify each critical point",
    correctSolution:
      "f'(x) = 3x² - 12x + 9, Critical points: x = 1 (local minimum) and x = 3 (local maximum)",
    hints: [
      "Find f'(x) using the power rule",
      "Set f'(x) = 0 and solve for x to find critical points",
      "Use the second derivative test to classify the critical points",
    ],
  },
];

export const categories = [
  "All",
  "Algebra",
  "Physics",
  "Calculus 1",
  "Statistics",
  "Chemistry",
];
