"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface MathElement {
  id: number;
  x: number;
  y: number;
  content: string;
  size: number;
  color: string;
  rotation: number;
}

function FloatingMathElement(props: { element: MathElement }) {
  const { element } = props;
  return (
    <motion.div
      className="absolute pointer-events-none text-green-400 select-none font-light"
      style={{
        left: element.x,
        top: element.y,
        fontSize: `${element.size}px`,
        color: element.color,
      }}
      initial={{
        opacity: 0,
        scale: 0,
        rotate: element.rotation,
      }}
      animate={{
        opacity: [0.1, 0.2, 0.1],
        scale: [1, 1.3, 1],
        x: [0, Math.random() * 200 - 100, Math.random() * 150 - 75],
        y: [0, Math.random() * 200 - 100, Math.random() * 150 - 75],
        rotate: [
          element.rotation,
          element.rotation + 360,
          element.rotation + 180,
        ],
      }}
      transition={{
        duration: 8 + Math.random() * 12,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    >
      {element.content}
    </motion.div>
  );
}

export default function FloatingMath() {
  const [mathElements, setMathElements] = useState<MathElement[]>([]);

  useEffect(() => {
    const mathSymbols = [
      // Numbers
      "π",
      "∞",
      "√",
      "∑",
      "∫",
      "∂",
      "Δ",
      "α",
      "β",
      "γ",
      "θ",
      "λ",
      "μ",
      "σ",
      "φ",
      "ψ",
      "ω",
      // Operators
      "±",
      "×",
      "÷",
      "≠",
      "≤",
      "≥",
      "≈",
      "∝",
      "∴",
      "∵",
      "⊕",
      "⊗",
      "∪",
      "∩",
      "⊂",
      "⊃",
      // Functions and equations
      "f(x)",
      "g(x)",
      "sin",
      "cos",
      "tan",
      "log",
      "ln",
      "e^x",
      "x²",
      "x³",
      "√x",
      "∫dx",
      "lim",
      "max",
      "min",
      "∇",
      "∃",
      "∀",
      "∈",
      "∉",
      "∧",
      "¬",
      // Numbers
      "0",
      "1",
      "2",
      "3",
      "5",
      "8",
      "13",
      "21",
      "34",
      "55",
      "89",
      // Complex expressions
      "x+y",
      "a²+b²",
      "f'(x)",
      "∫₀¹",
      "Σₙ₌₁",
      "lim→∞",
      "dx/dt",
      "∂f/∂x",
    ];
    const newElements = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 100),
      content: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
      size: Math.random() * 30 + 16,
      color: `rgba(var(59, 130, 246), ${Math.random() * 0.7 + 0.3})`,
      rotation: Math.random() * 360,
    }));
    setMathElements(newElements);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {mathElements.map((element) => (
        <FloatingMathElement key={element.id} element={element} />
      ))}
    </div>
  );
}
