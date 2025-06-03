"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const mathVirtualKeyboard: any;

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calculator, Copy, RotateCcw } from "lucide-react";
import MathRenderer from "@/components/math-renderer";
import MathField, { type MathFieldRef } from "@/components/math-field";

interface MathfieldEquationEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const commonTemplates = [
  {
    name: "Quadratic Formula",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
  },
  { name: "Pythagorean Theorem", latex: "a^2 + b^2 = c^2" },
  { name: "Circle Area", latex: "A = \\pi r^2" },
  {
    name: "Derivative",
    latex: "\\frac{d}{dx}f(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
  },
  { name: "Integral", latex: "\\int_a^b f(x) dx" },
  { name: "Summation", latex: "\\sum_{i=1}^{n} x_i" },
  { name: "Limit", latex: "\\lim_{x \\to \\infty} f(x)" },
  {
    name: "Matrix 2x2",
    latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
  },
  {
    name: "Binomial Coefficient",
    latex: "\\binom{n}{k} = \\frac{n!}{k!(n-k)!}",
  },
  { name: "Euler's Identity", latex: "e^{i\\pi} + 1 = 0" },
  {
    name: "Sine Rule",
    latex: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}",
  },
  {
    name: "Logarithm Property",
    latex: "\\log_a(xy) = \\log_a(x) + \\log_a(y)",
  },
];

export default function MathfieldEquationEditor({
  value,
  onChange,
  placeholder,
}: MathfieldEquationEditorProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentEquation, setCurrentEquation] = useState("");
  const mathFieldRef = useRef<MathFieldRef>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Track keyboard visibility
  useEffect(() => {
    if (!isEditorOpen) {
      // Hide keyboard when editor closes
      if (typeof mathVirtualKeyboard !== "undefined") {
        mathVirtualKeyboard.hide();
      }
    }
  }, [isEditorOpen]);

  // Handle dialog open/close with special handling for outside clicks
  const handleDialogOpenChange = (open: boolean, event?: any) => {
    // If opening, always allow
    if (open) {
      setIsEditorOpen(true);
      return;
    }

    // If closing, check the source of the close event
    if (
      event?.type === "pointerdown" &&
      event.target.closest("[data-radix-dialog-overlay]")
    ) {
      // This is an outside click on the overlay - prevent closing
      return;
    }

    // Allow closing for X button and other explicit close actions
    setIsEditorOpen(false);
  };
  // Explicit close function for buttons
  const closeDialog = () => {
    setIsEditorOpen(false);
  };

  const insertText = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.slice(0, start) + text + value.slice(end);

    onChange(newValue);

    setTimeout(() => {
      const newPosition = start + text.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  };

  const insertEquation = () => {
    if (currentEquation.trim()) {
      insertText(`$$${currentEquation}$$`);
      setCurrentEquation("");
      closeDialog();
    }
  };

  const loadTemplate = (template: { name: string; latex: string }) => {
    if (mathFieldRef.current) {
      mathFieldRef.current.setValue(template.latex);
      setCurrentEquation(template.latex);
    }
  };

  const clearEquation = () => {
    if (mathFieldRef.current) {
      mathFieldRef.current.setValue("");
      setCurrentEquation("");
    }
  };

  const copyLatex = async () => {
    if (currentEquation) {
      try {
        await navigator.clipboard.writeText(currentEquation);
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    }
  };

  const handleMathFieldChange = (newValue: string) => {
    setCurrentEquation(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 p-2 border-b">
        <Dialog open={isEditorOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditorOpen(true)}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Math Editor
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-5xl max-h-[90vh] overflow-y-auto"
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Interactive Math Editor</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Math Input Field */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Math Input:</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearEquation}
                    disabled={!currentEquation}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <MathField
                    ref={mathFieldRef}
                    defaultValue=""
                    onChange={handleMathFieldChange}
                    placeholder="Type your mathematical expression here..."
                    className="bg-white min-h-[60px] text-lg"
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    💡 Type math expressions naturally, use keyboard shortcuts,
                    or click to position cursor
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Preview:</div>
                <div className="border rounded-lg p-4 bg-white min-h-[80px] flex items-center justify-center">
                  {currentEquation ? (
                    <MathRenderer latex={currentEquation} />
                  ) : (
                    <div className="text-gray-400">
                      Your equation will appear here
                    </div>
                  )}
                </div>
              </div>

              {/* LaTeX Output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">LaTeX Output:</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyLatex}
                    disabled={!currentEquation}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="border rounded-lg p-3 bg-gray-50 font-mono text-sm break-all">
                  {currentEquation || "LaTeX will appear here"}
                </div>
              </div>

              {/* Quick Templates */}
              <div className="space-y-3">
                <div className="text-sm font-medium">Quick Templates:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {commonTemplates.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="h-auto p-3 text-left justify-start"
                      onClick={() => loadTemplate(template)}
                    >
                      <div>
                        <div className="font-medium text-xs">
                          {template.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 font-mono">
                          {template.latex.length > 30
                            ? template.latex.slice(0, 30) + "..."
                            : template.latex}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Keyboard Shortcuts Help */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Keyboard Shortcuts:</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <div className="bg-gray-50 p-2 rounded">
                    <strong>^</strong> - Superscript (x^2)
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <strong>_</strong> - Subscript (x_1)
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <strong>/</strong> - Fraction (a/b)
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <strong>\sqrt</strong> - Square root
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <strong>\pi</strong> - Pi symbol
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <strong>\alpha</strong> - Greek letters
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <strong>\int</strong> - Integral
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <strong>\sum</strong> - Summation
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <strong>\lim</strong> - Limit
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button
                  onClick={insertEquation}
                  disabled={!currentEquation.trim()}
                >
                  Insert Equation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[200px] text-sm"
      />

      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 Tips:</p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li>Type regular text normally</li>
          <li>
            Click &quot;Math Editor&quot; to create mathematical expressions
          </li>
          <li>
            Use keyboard shortcuts like ^ for superscript, _ for subscript, /
            for fractions
          </li>
          <li>Click anywhere in the math field to position your cursor</li>
          <li>Use templates for common equations</li>
          <li>Type LaTeX commands like \pi, \alpha, \sqrt, \int, \sum</li>
        </ul>
      </div>
    </div>
  );
}
