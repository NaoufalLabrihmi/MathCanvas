
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Type, 
  Heading1, 
  Heading2, 
  Heading3, 
  Quote, 
  ListOrdered, 
  List, 
  AlignJustify,
  Subscript,
  Superscript,
  Square,
  Brackets,
  Table as TableIcon, 
  Calculator
} from "lucide-react";

export const TextFormattingToolbar = () => {
  const textItems = [
    { name: "Text", icon: <Type size={16} />, type: "text" },
    { name: "Heading 1", icon: <Heading1 size={16} />, type: "heading-1" },
    { name: "Heading 2", icon: <Heading2 size={16} />, type: "heading-2" },
    { name: "Heading 3", icon: <Heading3 size={16} />, type: "heading-3" },
    { name: "Quote", icon: <Quote size={16} />, type: "quote" },
    { name: "Bullet List", icon: <List size={16} />, type: "bullet-list" },
    { name: "Numbered List", icon: <ListOrdered size={16} />, type: "numbered-list" },
    { name: "Paragraph", icon: <AlignJustify size={16} />, type: "paragraph" },
    { name: "Superscript", icon: <Superscript size={16} />, type: "superscript" },
    { name: "Subscript", icon: <Subscript size={16} />, type: "subscript" },
    { name: "Matrix", icon: <Square size={16} />, type: "matrix" },
    { name: "Bracket", icon: <Brackets size={16} />, type: "bracket" },
    { name: "Table", icon: <TableIcon size={16} />, type: "table" },
    { name: "Equation System", icon: <Calculator size={16} />, type: "equation-system" },
  ];

  const handleDragStart = (e: React.DragEvent, textType: string) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ type: "text", textType })
    );
  };

  const handleClick = (textType: string) => {
    // Create a custom event for adding text elements through clicking
    const event = new CustomEvent('addTextElement', { 
      detail: { textType }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="flex items-center justify-center space-x-2 mb-2 pb-2 border-b">
      <p className="text-sm font-medium text-gray-700 mr-2">Text Elements:</p>
      <div className="flex items-center space-x-2 overflow-x-auto">
        {textItems.map((item) => (
          <div
            key={item.name}
            draggable
            onDragStart={(e) => handleDragStart(e, item.type)}
            onClick={() => handleClick(item.type)}
            title={item.name}
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 w-10 p-0 flex items-center justify-center cursor-grab"
            >
              {item.icon}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
