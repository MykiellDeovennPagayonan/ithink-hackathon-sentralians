// Define problem categories and difficulties
export const categories = [
  "All",
  "Algebra",
  "Calculus",
  "Statistics",
  "Physics",
  "Chemistry",
];
export const difficulties = ["Easy", "Medium", "Hard"];

// Updated Problems data matching the Problem schema with only categories and difficulties added
export const mockProblems = [
  {
    id: "1",
    title: "Test",
    description:
      "Engineers from Sonza Industrial Plant have determined that a small amount of a newly available chemical additive will increase the water repellency of Sonza's tent fabric by 20%. The plant supervisor has arranged to purchased the additive through a 5-year contract at $7000 per year, starting 1 year from now. He expects the annual price to increase by 12% per year starting in the sixth year and thereafter through year 13. Additionally, an initial investment of $35,000 was made now to prepare a site suitable for the contractor to deliver the additive. Use i = 15% per year to determine the equivalent total present worth for all these cash flows.",
    imageUrl: null,
    classroomId: null,
    isPublic: true,
    createdAt: 1704240000000000000, // Time.Time format (nanoseconds)
    category: "Algebra",
    difficulty: "Medium",
  },
  {
    id: "2",
    title: "Projectile Motion Analysis",
    description:
      "A ball is thrown from ground level with initial velocity and angle. Given: $$v_0 = 20 \\text{ m/s}, \\quad \\theta = 30^\\circ, \\quad g = 9.8 \\text{ m/s}^2$$. Calculate maximum height and horizontal range using kinematic equations.",
    imageUrl: null,
    classroomId: "MATH101",
    isPublic: true,
    createdAt: 1704067200000000000,
    category: "Physics",
    difficulty: "Hard",
  },
  {
    id: "3",
    title: "Limits and Continuity",
    description:
      "Evaluate the limit: $$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$$ using algebraic manipulation. Show each step of your solution process.",
    imageUrl: null,
    classroomId: "MATH101",
    isPublic: true,
    createdAt: 1703894400000000000,
    category: "Calculus",
    difficulty: "Medium",
  },
  {
    id: "4",
    title: "Normal Distribution Probability",
    description:
      "Given a normal distribution: $$X \\sim N(75, 8^2)$$, calculate the probability $$P(70 < X < 85)$$ using z-scores and the standard normal table.",
    imageUrl: null,
    classroomId: "STAT303",
    isPublic: true,
    createdAt: 1704153600000000000,
    category: "Statistics",
    difficulty: "Medium",
  },
  {
    id: "5",
    title: "Chemical Equilibrium Constant",
    description:
      "For the reaction: $$\\text{PCl}_5(g) \\rightleftharpoons \\text{PCl}_3(g) + \\text{Cl}_2(g)$$\n\nand given concentrations:\n\nInitial $$[\\text{PCl}_5] = 0.30\\text{ M}$$\n\nEquilibrium $$[\\text{PCl}_3] = 0.20\\text{ M}$$\n\ncalculate the equilibrium constant $$K_c$$.",
    imageUrl: null,
    classroomId: null, // Public problem not assigned to classroom
    isPublic: true,
    createdAt: 1704326400000000000,
    category: "Chemistry",
    difficulty: "Hard",
  },
  {
    id: "6",
    title: "Quadratic Function Analysis",
    description:
      "Analyze the quadratic function $$f(x) = 2x^2 - 8x + 6$$. Find the vertex, y-intercept, and x-intercepts. Show all your work.",
    imageUrl: null,
    classroomId: "ALG202",
    isPublic: true,
    createdAt: 1704067200000000000,
    category: "Algebra",
    difficulty: "Easy",
  },
  {
    id: "7",
    title: "Electromagnetic Wave Properties",
    description:
      "Given: $$f = 98.5 \\text{ MHz}, \\quad c = 3.00 \\times 10^8 \\text{ m/s}, \\quad h = 6.63 \\times 10^{-34} \\text{ J·s}$$. Calculate the wavelength $$\\lambda$$ and photon energy $$E$$.",
    imageUrl: null,
    classroomId: "ALG202",
    isPublic: true,
    createdAt: 1703894400000000000,
    category: "Physics",
    difficulty: "Hard",
  },
  {
    id: "8",
    title: "Derivative Applications",
    description:
      "Given the function $$f(x) = x^3 - 6x^2 + 9x + 2$$, find $$f'(x)$$, determine the critical points, and classify each as a local minimum or maximum.",
    imageUrl: null,
    classroomId: "MATH101",
    isPublic: true,
    createdAt: 1704067200000000000,
    category: "Calculus",
    difficulty: "Medium",
  },
];
