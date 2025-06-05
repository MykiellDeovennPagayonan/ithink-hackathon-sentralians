"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import MathRenderer from "@/components/math-renderer";
import MathField, { type MathFieldRef } from "@/components/math-field";
import { Calculator, Type, Plus, MoreVertical, Keyboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InlineMathEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface ContentBlock {
  id: string;
  type: "text" | "math";
  content: string;
  isEditing?: boolean;
}

export default function InlineMathEditor({
  value,
  onChange,
  placeholder = "Start typing... Press Ctrl+M to add math",
  className = "",
}: InlineMathEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement }>({});
  const mathFieldRefs = useRef<{ [key: string]: MathFieldRef }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Parse value into blocks
  useEffect(() => {
    if (!value) {
      setBlocks([{ id: "1", type: "text", content: "", isEditing: true }]);
      return;
    }

    const parts = value.split(/(\$\$[^$]*\$\$)/g);
    const newBlocks: ContentBlock[] = [];
    let blockId = 1;

    parts.forEach((part) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const latex = part.slice(2, -2);
        if (latex.trim()) {
          newBlocks.push({
            id: blockId.toString(),
            type: "math",
            content: latex,
            isEditing: false,
          });
          blockId++;
        }
      } else if (part.trim()) {
        newBlocks.push({
          id: blockId.toString(),
          type: "text",
          content: part,
          isEditing: false,
        });
        blockId++;
      }
    });

    if (newBlocks.length === 0) {
      newBlocks.push({ id: "1", type: "text", content: "", isEditing: true });
    }

    setBlocks(newBlocks);
  }, []);

  // Convert blocks back to string
  const blocksToString = useCallback((currentBlocks: ContentBlock[]) => {
    return currentBlocks
      .map((block) =>
        block.type === "math" ? `$$${block.content}$$` : block.content
      )
      .join("");
  }, []);

  // Update parent when blocks change
  useEffect(() => {
    const newValue = blocksToString(blocks);
    if (newValue !== value) {
      onChange(newValue);
    }
  }, [blocks, onChange, value, blocksToString]);

  const updateBlock = (blockId: string, content: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, content } : block
      )
    );
  };

  const addBlock = (afterBlockId: string, type: "text" | "math") => {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === afterBlockId);
      const newBlock: ContentBlock = {
        id: Date.now().toString(),
        type,
        content: "",
        isEditing: true,
      };
      const newBlocks = [...prev];
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks;
    });
  };

  const removeBlock = (blockId: string) => {
    setBlocks((prev) => {
      const filtered = prev.filter((b) => b.id !== blockId);
      return filtered.length > 0
        ? filtered
        : [{ id: "1", type: "text", content: "", isEditing: true }];
    });
  };

  const setBlockEditing = (blockId: string, isEditing: boolean) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, isEditing } : block
      )
    );
    setActiveBlockId(isEditing ? blockId : null);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    blockId: string,
    blockType: "text" | "math"
  ) => {
    // Ctrl+M to add math block
    if (e.ctrlKey && e.key === "m") {
      e.preventDefault();
      addBlock(blockId, "math");
      return;
    }

    // Ctrl+T to add text block
    if (e.ctrlKey && e.key === "t") {
      e.preventDefault();
      addBlock(blockId, "text");
      return;
    }

    // Only handle text-specific keys for text blocks
    if (blockType === "text") {
      // Backspace on empty block
      if (e.key === "Backspace") {
        const textarea = textareaRefs.current[blockId];
        if (textarea && textarea.value === "" && blocks.length > 1) {
          e.preventDefault();
          removeBlock(blockId);
          return;
        }
      }
    }
  };

  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    blockId: string
  ) => {
    const value = e.target.value;
    updateBlock(blockId, value);

    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const focusBlock = (blockId: string) => {
    setTimeout(() => {
      const textarea = textareaRefs.current[blockId];
      const mathField = mathFieldRefs.current[blockId];

      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(
          textarea.value.length,
          textarea.value.length
        );
      } else if (mathField) {
        mathField.focus();
        // Force show keyboard on mobile for math fields
        if (isMobile) {
          setTimeout(() => {
            mathField.showKeyboard();
          }, 200);
        }
      }
    }, 100);
  };

  const handleMathFieldClick = (blockId: string) => {
    const mathField = mathFieldRefs.current[blockId];
    if (mathField && isMobile) {
      // Ensure focus and show keyboard
      mathField.focus();
      setTimeout(() => {
        mathField.showKeyboard();
      }, 100);
    }
  };

  const handleShowKeyboard = (blockId: string) => {
    const mathField = mathFieldRefs.current[blockId];
    if (mathField) {
      mathField.focus();
      mathField.showKeyboard();
    }
  };

  useEffect(() => {
    if (activeBlockId) {
      focusBlock(activeBlockId);
    }
  }, [activeBlockId]);

  const BlockControls = ({ blockId }: { blockId: string }) => {
    if (isMobile) {
      return (
        <div className="absolute -top-2 -right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-white shadow-md"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => addBlock(blockId, "text")}>
                <Type className="w-4 h-4 mr-2" />
                Add Text Block
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addBlock(blockId, "math")}>
                <Calculator className="w-4 h-4 mr-2" />
                Add Math Block
              </DropdownMenuItem>
              {blocks.length > 1 && (
                <DropdownMenuItem
                  onClick={() => removeBlock(blockId)}
                  className="text-red-600"
                >
                  <span className="w-4 h-4 mr-2 flex items-center justify-center">
                    ×
                  </span>
                  Remove Block
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    return (
      <div className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex flex-col gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => addBlock(blockId, "math")}
            title="Add math block"
          >
            <Calculator className="w-3 h-3" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => addBlock(blockId, "text")}
            title="Add text block"
          >
            <Type className="w-3 h-3" />
          </Button>
          {blocks.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              onClick={() => removeBlock(blockId)}
              title="Remove block"
            >
              ×
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`border rounded-lg bg-white overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 border-b bg-gray-50">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              addBlock(blocks[blocks.length - 1]?.id || "1", "math")
            }
            className="text-xs sm:text-sm"
          >
            <Calculator className="w-4 h-4 mr-1" />
            Math
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              addBlock(blocks[blocks.length - 1]?.id || "1", "text")
            }
            className="text-xs sm:text-sm"
          >
            <Type className="w-4 h-4 mr-1" />
            Text
          </Button>
        </div>
        <div className="text-xs text-gray-500 sm:ml-auto">
          {isMobile ? "Tap + for options" : "Ctrl+M: Math • Ctrl+T: Text"}
        </div>
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="p-2 sm:p-4 space-y-2 sm:space-y-3 min-h-[200px] max-w-full"
      >
        {blocks.length === 0 && (
          <div className="text-gray-400 italic text-sm">{placeholder}</div>
        )}

        {blocks.map((block, index) => (
          <div key={block.id} className="group relative max-w-full">
            {block.type === "text" ? (
              <div className="relative max-w-full">
                {block.isEditing ? (
                  <textarea
                    ref={(el) => {
                      if (el) textareaRefs.current[block.id] = el;
                    }}
                    value={block.content}
                    onChange={(e) => handleTextareaChange(e, block.id)}
                    onKeyDown={(e) => handleKeyDown(e, block.id, "text")}
                    onBlur={() => {
                      if (block.content.trim() === "" && blocks.length > 1) {
                        removeBlock(block.id);
                      } else {
                        setBlockEditing(block.id, false);
                      }
                    }}
                    placeholder={index === 0 ? placeholder : "Type text..."}
                    className="w-full max-w-full resize-none border-0 outline-none bg-transparent text-sm sm:text-base leading-relaxed p-2 sm:p-1 break-words"
                    style={{
                      minHeight: isMobile ? "32px" : "24px",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                    autoFocus={block.isEditing}
                  />
                ) : (
                  <div
                    onClick={() => setBlockEditing(block.id, true)}
                    className="cursor-text min-h-[32px] sm:min-h-[24px] text-sm sm:text-base leading-relaxed whitespace-pre-wrap hover:bg-gray-50 rounded p-2 sm:p-1 -m-2 sm:-m-1 break-words overflow-wrap-anywhere max-w-full"
                    style={{
                      wordWrap: "break-word",
                      overflowWrap: "anywhere",
                      hyphens: "auto",
                    }}
                  >
                    {block.content || (
                      <span className="text-gray-400 italic">
                        Click to edit text
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative max-w-full">
                {block.isEditing ? (
                  <div className="border rounded p-2 sm:p-3 bg-blue-50 max-w-full overflow-hidden">
                    <div
                      onClick={() => handleMathFieldClick(block.id)}
                      className="cursor-pointer max-w-full overflow-hidden"
                    >
                      <div className="w-full overflow-x-auto">
                        <MathField
                          ref={(el) => {
                            if (el) mathFieldRefs.current[block.id] = el;
                          }}
                          defaultValue={block.content}
                          onChange={(value) => updateBlock(block.id, value)}
                          placeholder="Type math expression..."
                          className="bg-white min-h-[40px] sm:min-h-[50px] w-full min-w-0"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="text-xs break-words">
                        Use ^ _ / for superscript, subscript, fractions
                      </span>
                      <div className="flex gap-2 self-start sm:self-auto flex-shrink-0">
                        {isMobile && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleShowKeyboard(block.id)}
                            className="text-xs h-8 px-3"
                          >
                            <Keyboard className="w-3 h-3 mr-1" />
                            Keyboard
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setBlockEditing(block.id, false)}
                          className="text-xs h-8 px-3"
                        >
                          Done
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setBlockEditing(block.id, true)}
                    className="cursor-pointer hover:bg-blue-50 rounded p-2 sm:p-3 -m-2 sm:-m-3 min-h-[48px] sm:min-h-[40px] flex items-center max-w-full overflow-hidden"
                  >
                    {block.content ? (
                      <div className="w-full overflow-x-auto overflow-y-hidden">
                        <div
                          className="inline-block min-w-0"
                          style={{
                            maxWidth: "100%",
                            transform: isMobile ? "scale(0.8)" : "scale(1)",
                            transformOrigin: "left center",
                            fontSize: isMobile ? "14px" : "16px",
                          }}
                        >
                          <MathRenderer latex={block.content} />
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        Click to edit math
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Block controls */}
            <BlockControls blockId={block.id} />
          </div>
        ))}

        {/* Mobile add button */}
        {isMobile && (
          <div className="flex justify-center pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full h-10 w-10 p-0"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuItem
                  onClick={() =>
                    addBlock(blocks[blocks.length - 1]?.id || "1", "text")
                  }
                >
                  <Type className="w-4 h-4 mr-2" />
                  Add Text Block
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    addBlock(blocks[blocks.length - 1]?.id || "1", "math")
                  }
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Add Math Block
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Custom CSS for math responsiveness */}
      <style jsx>{`
        .math-field-container math-field {
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important;
        }

        .math-field-container math-field .ML__container {
          max-width: 100% !important;
          overflow-x: auto !important;
        }

        /* MathJax/KaTeX responsive styles */
        :global(.katex-display) {
          overflow-x: auto !important;
          overflow-y: hidden !important;
          max-width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        :global(.katex) {
          font-size: ${isMobile ? "0.9em" : "1em"} !important;
          max-width: 100% !important;
        }

        :global(.MathJax) {
          max-width: 100% !important;
          overflow-x: auto !important;
        }

        :global(.MathJax_Display) {
          overflow-x: auto !important;
          overflow-y: hidden !important;
          max-width: 100% !important;
        }

        /* Mobile specific math scaling */
        @media (max-width: 768px) {
          :global(.katex) {
            font-size: 0.8em !important;
          }

          :global(.MathJax) {
            font-size: 80% !important;
          }
        }
      `}</style>
    </div>
  );
}
