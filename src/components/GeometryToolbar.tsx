
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Square, 
  Circle as CircleIcon, 
  Triangle, 
  ArrowRight, 
  CornerUpRight, 
  Sigma, 
  Pi,
  AlignJustify,
  LineChart,
  FunctionSquare,
  Brackets,
  ArrowLeftRight,
  Cross,
  PlusCircle,
  MinusCircle
} from "lucide-react";

export const GeometryToolbar = () => {
  const shapes = [
    { name: "Rectangle", icon: <Square size={16} />, type: "rectangle" },
    { name: "Circle", icon: <CircleIcon size={16} />, type: "circle" },
    { name: "Triangle", icon: <Triangle size={16} />, type: "triangle" },
    { name: "Line", icon: <ArrowRight size={16} />, type: "line" },
    { name: "Angle", icon: <CornerUpRight size={16} />, type: "angle" },
    { name: "Equation", icon: <Sigma size={16} />, type: "equation" },
    { name: "Formula", icon: <Pi size={16} />, type: "formula" },
    { name: "Text", icon: <AlignJustify size={16} />, type: "text" },
    { name: "Graph", icon: <LineChart size={16} />, type: "graph" },
    { name: "Function", icon: <FunctionSquare size={16} />, type: "function" },
    { name: "Matrix", icon: <Brackets size={16} />, type: "matrix" },
    { name: "Vector", icon: <ArrowLeftRight size={16} />, type: "vector" },
    { name: "Multiply", icon: <Cross size={16} />, type: "multiply" },
    { name: "Add", icon: <PlusCircle size={16} />, type: "add" },
    { name: "Subtract", icon: <MinusCircle size={16} />, type: "subtract" },
  ];

  const handleDragStart = (e: React.DragEvent, shape: string) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ type: "shape", shape })
    );
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <p className="text-sm font-medium text-gray-700 mr-2">Math Elements:</p>
      <div className="flex items-center space-x-2 overflow-x-auto">
        {shapes.map((shape) => (
          <div
            key={shape.name}
            draggable
            onDragStart={(e) => handleDragStart(e, shape.type)}
            title={shape.name}
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 w-10 p-0 flex items-center justify-center cursor-grab"
            >
              {shape.icon}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
