
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const MathSymbolPanel = () => {
  const mathSymbols = {
    basic: ["α", "β", "γ", "δ", "ε", "θ", "λ", "μ", "π", "σ", "φ", "ω", "∞"],
    operators: ["+", "-", "×", "÷", "=", "≠", "≈", "≤", "≥", "<", ">", "±"],
    calculus: ["∫", "∬", "∭", "∮", "∇", "∂", "∑", "∏", "lim", "→", "dy/dx"],
    sets: ["∈", "∉", "⊂", "⊃", "∩", "∪", "∅", "∀", "∃", "∄", "∆", "ℕ", "ℤ", "ℚ", "ℝ", "ℂ"],
    misc: ["√", "∛", "∜", "…", "′", "″", "‴", "⁗"],
  };

  const handleDragStart = (e: React.DragEvent, symbol: string) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ type: "symbol", symbol }));
    
    // Create a drag image to make the dragging experience better
    const ghostElement = document.createElement("div");
    ghostElement.textContent = symbol;
    ghostElement.style.fontSize = "24px";
    ghostElement.style.padding = "8px";
    ghostElement.style.background = "white";
    ghostElement.style.border = "1px solid #ccc";
    ghostElement.style.borderRadius = "4px";
    ghostElement.style.position = "absolute";
    ghostElement.style.top = "-1000px"; // Hide it from view
    document.body.appendChild(ghostElement);
    
    e.dataTransfer.setDragImage(ghostElement, 25, 25);
    
    // Clean up the ghost element after dragging
    setTimeout(() => {
      document.body.removeChild(ghostElement);
    }, 0);
  };

  const handleSymbolClick = (symbol: string) => {
    // Dispatch an event to add the symbol at the current cursor position or center of canvas
    const event = new CustomEvent('addMathSymbol', { detail: { symbol } });
    window.dispatchEvent(event);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Math Symbols</h2>
      <Tabs defaultValue="basic">
        <TabsList className="w-full grid grid-cols-5 mb-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="operators">Ops</TabsTrigger>
          <TabsTrigger value="calculus">Calc</TabsTrigger>
          <TabsTrigger value="sets">Sets</TabsTrigger>
          <TabsTrigger value="misc">Misc</TabsTrigger>
        </TabsList>
        
        {Object.entries(mathSymbols).map(([category, symbols]) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-4 gap-2">
              {symbols.map((symbol, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => handleDragStart(e, symbol)}
                  onClick={() => handleSymbolClick(symbol)}
                  className="h-12 w-12 flex items-center justify-center border rounded bg-white shadow-sm hover:shadow-md text-lg cursor-grab transition-shadow"
                >
                  {symbol}
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
