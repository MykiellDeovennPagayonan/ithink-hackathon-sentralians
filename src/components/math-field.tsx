/* eslint-disable @typescript-eslint/no-explicit-any */ "use client";
declare const mathVirtualKeyboard: any;

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import type { MathfieldElement } from "mathlive";
import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";

interface MathFieldProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface MathFieldRef {
  setValue: (value: string) => void;
  getValue: () => string;
  focus: () => void;
  blur: () => void;
  showKeyboard: () => void;
  hideKeyboard: () => void;
}

const MathField = forwardRef<MathFieldRef, MathFieldProps>(
  (
    {
      defaultValue = "",
      onChange,
      placeholder = "Enter math expression",
      className = "",
    },
    ref
  ) => {
    const mathFieldRef = useRef<HTMLDivElement>(null);
    const [mathfieldInstance, setMathfieldInstance] =
      useState<MathfieldElement | null>(null);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        setValue: (value: string) => {
          if (mathfieldInstance) {
            mathfieldInstance.value = value;
          }
        },
        getValue: () => {
          return mathfieldInstance?.value || "";
        },
        focus: () => {
          if (mathfieldInstance) {
            mathfieldInstance.focus();
          }
        },
        blur: () => {
          if (mathfieldInstance) {
            mathfieldInstance.blur();
          }
        },
        showKeyboard: () => {
          mathVirtualKeyboard.show();
          setIsKeyboardVisible(true);
        },
        hideKeyboard: () => {
          mathVirtualKeyboard.hide();
          setIsKeyboardVisible(false);
        },
      }),
      [mathfieldInstance]
    );

    const toggleKeyboard = () => {
      if (isKeyboardVisible) {
        mathVirtualKeyboard.hide();
        setIsKeyboardVisible(false);
      } else {
        mathVirtualKeyboard.show();
        setIsKeyboardVisible(true);
        if (mathfieldInstance) {
          mathfieldInstance.focus();
        }
      }
    };

    useEffect(() => {
      const currentRef = mathFieldRef.current;

      const loadMathLive = async () => {
        try {
          await import("mathlive");

          if (currentRef && !currentRef.querySelector("math-field")) {
            const mathfield = document.createElement(
              "math-field"
            ) as MathfieldElement;
            mathfield.value = defaultValue;
            mathfield.mathVirtualKeyboardPolicy = "manual";

            if (placeholder) {
              mathfield.setAttribute("placeholder", placeholder);
            }

            mathfield.addEventListener("input", () => {
              onChange?.(mathfield.value);
            });

            mathfield.addEventListener("click", () => {
              mathfield.focus();
            });

            mathfield.addEventListener("focus", () => {
              mathVirtualKeyboard.show();
              setIsKeyboardVisible(true);
            });

            mathfield.addEventListener("blur", () => {
              mathVirtualKeyboard.hide();
              setIsKeyboardVisible(false);
            });

            currentRef.appendChild(mathfield);
            setMathfieldInstance(mathfield);
          }
        } catch (error) {
          console.error("Failed to load MathLive:", error);
        }
      };

      loadMathLive();

      return () => {
        if (currentRef) {
          const mathfield = currentRef.querySelector("math-field");
          if (mathfield) {
            mathfield.remove();
          }
        }
      };
    }, []);

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div
            ref={mathFieldRef}
            className={`math-field-container border rounded-md p-2 min-h-[40px] flex-1 ${className}`}
          />
          {!isMobile ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleKeyboard}
              className="shrink-0"
              title={
                isKeyboardVisible
                  ? "Hide Virtual Keyboard"
                  : "Show Virtual Keyboard"
              }
            >
              <Keyboard className="w-4 h-4" />
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
);

MathField.displayName = "MathField";

export default MathField;
