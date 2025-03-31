import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { useToast } from "@/components/ui/use-toast";
import { TableCreator } from "./TableCreator";
import { EquationSystemCreator } from "./EquationSystemCreator";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [activeColor, setActiveColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(24);
  const { toast } = useToast();
  
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [equationSystemDialogOpen, setEquationSystemDialogOpen] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 1100,
      backgroundColor: "#ffffff",
    });

    const createPageBorder = () => {
      const border = new fabric.Rect({
        width: 780,
        height: 1080,
        fill: 'transparent',
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      canvas.add(border);
      canvas.centerObject(border);
      canvas.renderAll();
    };

    createPageBorder();
    setFabricCanvas(canvas);
    
    toast({
      title: "Canvas ready",
      description: "Start creating your mathematical document",
    });

    return () => {
      canvas.dispose();
    };
  }, [toast]);

  useEffect(() => {
    const handleColorChange = (event: CustomEvent) => {
      setActiveColor(event.detail.color);
      
      if (fabricCanvas && fabricCanvas.getActiveObject()) {
        const activeObject = fabricCanvas.getActiveObject();
        if (activeObject) {
          activeObject.set({
            stroke: event.detail.color,
            fill: activeObject.get('type') === 'i-text' ? event.detail.color : 'transparent'
          });
          fabricCanvas.renderAll();
        }
      }
    };

    window.addEventListener('colorChange' as any, handleColorChange);
    return () => {
      window.removeEventListener('colorChange' as any, handleColorChange);
    };
  }, [fabricCanvas]);

  useEffect(() => {
    const handleFontSizeChange = (event: CustomEvent) => {
      setFontSize(event.detail.size);
      
      if (fabricCanvas && fabricCanvas.getActiveObject()) {
        const activeObject = fabricCanvas.getActiveObject();
        if (activeObject && activeObject.get('type').includes('text')) {
          activeObject.set({
            fontSize: event.detail.size
          });
          fabricCanvas.renderAll();
        }
      }
    };

    window.addEventListener('fontSizeChange' as any, handleFontSizeChange);
    return () => {
      window.removeEventListener('fontSizeChange' as any, handleFontSizeChange);
    };
  }, [fabricCanvas]);

  useEffect(() => {
    const handleTextFormat = (event: CustomEvent) => {
      if (!fabricCanvas) return;
      
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject && activeObject.get('type').includes('text')) {
        const format = event.detail.format;
        
        if (format === 'bold') {
          const currentWeight = activeObject.get('fontWeight');
          activeObject.set('fontWeight', currentWeight === 'bold' ? 'normal' : 'bold');
        } else if (format === 'italic') {
          const currentStyle = activeObject.get('fontStyle');
          activeObject.set('fontStyle', currentStyle === 'italic' ? 'normal' : 'italic');
        } else if (format === 'underline') {
          const currentDecoration = activeObject.get('underline');
          activeObject.set('underline', !currentDecoration);
        } else if (format.startsWith('align-')) {
          const alignment = format.replace('align-', '');
          activeObject.set('textAlign', alignment);
        }
        
        fabricCanvas.renderAll();
      }
    };

    window.addEventListener('textFormat' as any, handleTextFormat);
    return () => {
      window.removeEventListener('textFormat' as any, handleTextFormat);
    };
  }, [fabricCanvas]);

  useEffect(() => {
    const handleAddTextElement = (event: CustomEvent) => {
      if (!fabricCanvas) return;
      
      const textType = event.detail.textType;
      
      const center = fabricCanvas.getCenter();
      
      if (textType === 'table') {
        setTableDialogOpen(true);
      } else if (textType === 'equation-system') {
        setEquationSystemDialogOpen(true);
      } else {
        addTextByType(textType, center.left, center.top);
      }
    };

    window.addEventListener('addTextElement' as any, handleAddTextElement);
    return () => {
      window.removeEventListener('addTextElement' as any, handleAddTextElement);
    };
  }, [fabricCanvas]);

  useEffect(() => {
    const handleAddMathSymbol = (event: CustomEvent) => {
      if (!fabricCanvas) return;
      
      const symbol = event.detail.symbol;
      
      const center = fabricCanvas.getCenter();
      addMathSymbol(symbol, center.left, center.top);
    };

    window.addEventListener('addMathSymbol' as any, handleAddMathSymbol);
    return () => {
      window.removeEventListener('addMathSymbol' as any, handleAddMathSymbol);
    };
  }, [fabricCanvas]);

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (!fabricCanvas) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    const x = event.clientX - (rect?.left || 0);
    const y = event.clientY - (rect?.top || 0);

    const dataString = event.dataTransfer.getData("text/plain");
    try {
      const data = JSON.parse(dataString);
      
      if (data.type === "symbol") {
        addMathSymbol(data.symbol, x, y);
      } else if (data.type === "shape") {
        addGeometricShape(data.shape, x, y);
      } else if (data.type === "text") {
        if (data.textType === "table") {
          setTableDialogOpen(true);
        } else if (data.textType === "equation-system") {
          setEquationSystemDialogOpen(true);
        } else {
          addTextByType(data.textType, x, y);
        }
      } else if (data.type === "equation") {
        addText("f(x) = ", x, y);
      } else if (data.type === "formula") {
        addText("E = mc²", x, y);
      }
    } catch (error) {
      console.error("Failed to parse dropped item data", error);
    }
  };

  const addTextByType = (textType: string, x: number, y: number) => {
    switch (textType) {
      case "text":
        addText("Text block", x, y);
        break;
      case "heading-1":
        addText("Heading 1", x, y, 32, "bold");
        break;
      case "heading-2":
        addText("Heading 2", x, y, 28, "bold");
        break;
      case "heading-3":
        addText("Heading 3", x, y, 24, "bold");
        break;
      case "quote":
        addText("❝ Quote text here ❞", x, y, 24, "italic");
        break;
      case "bullet-list":
        addText("• List item 1\n• List item 2\n• List item 3", x, y);
        break;
      case "numbered-list":
        addText("1. List item 1\n2. List item 2\n3. List item 3", x, y);
        break;
      case "paragraph":
        addText("Paragraph text...", x, y);
        break;
      case "superscript":
        addText("x²", x, y);
        break;
      case "subscript":
        addText("Hₙ", x, y);
        break;
      case "matrix":
        addText("⎡a b c⎤\n⎢d e f⎥\n⎣g h i⎦", x, y, 24, "normal", "Consolas, monospace");
        break;
      case "bracket":
        addText("{ expression }", x, y);
        break;
      default:
        addText("Text", x, y);
    }
  };

  const addMathSymbol = (symbol: string, x: number, y: number) => {
    if (!fabricCanvas) return;

    let fontFamily = 'Cambria Math, serif';
    let fontSize = this.fontSize || 24;
    
    if (symbol === "∫" || symbol === "∬" || symbol === "∭" || symbol === "∮" || 
        symbol === "∇" || symbol === "∂" || symbol === "∑" || symbol === "∏") {
      fontSize = fontSize * 1.2;
    }

    const text = new fabric.IText(symbol, {
      left: x,
      top: y,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: activeColor,
      selectable: true,
      hasControls: true,
    });

    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
  };

  const addText = (
    text: string, 
    x: number, 
    y: number, 
    size?: number, 
    weight?: string, 
    font?: string
  ) => {
    if (!fabricCanvas) return;

    const textObject = new fabric.IText(text, {
      left: x,
      top: y,
      fontSize: size || fontSize,
      fontWeight: weight || 'normal',
      fontFamily: font || 'Arial, sans-serif',
      fill: activeColor,
    });

    fabricCanvas.add(textObject);
    fabricCanvas.setActiveObject(textObject);
    fabricCanvas.renderAll();
  };

  const addGeometricShape = (shape: string, x: number, y: number) => {
    if (!fabricCanvas) return;

    let object;
    
    switch (shape) {
      case "rectangle":
        object = new fabric.Rect({
          left: x,
          top: y,
          width: 100,
          height: 60,
          fill: 'transparent',
          stroke: activeColor,
          strokeWidth: 2,
        });
        break;
      
      case "circle":
        object = new fabric.Circle({
          left: x,
          top: y,
          radius: 50,
          fill: 'transparent',
          stroke: activeColor,
          strokeWidth: 2,
        });
        break;
        
      case "triangle":
        object = new fabric.Triangle({
          left: x,
          top: y,
          width: 100,
          height: 100,
          fill: 'transparent',
          stroke: activeColor,
          strokeWidth: 2,
        });
        break;
        
      case "line":
        object = new fabric.Line([x, y, x + 100, y], {
          stroke: activeColor,
          strokeWidth: 2,
        });
        break;

      case "angle":
        const points = [
          { x: x, y: y },
          { x: x + 100, y: y },
          { x: x, y: y - 100 }
        ];
        object = new fabric.Polyline(points, {
          stroke: activeColor,
          strokeWidth: 2,
          fill: 'transparent',
        });
        break;

      default:
        return;
    }
    
    fabricCanvas.add(object);
    fabricCanvas.setActiveObject(object);
    fabricCanvas.renderAll();
  };

  const createTable = (rows: number, cols: number) => {
    if (!fabricCanvas) return;
    
    const cellWidth = 60;
    const cellHeight = 40;
    const tableWidth = cols * cellWidth;
    const tableHeight = rows * cellHeight;
    
    const center = fabricCanvas.getCenter();
    const startX = center.left - tableWidth / 2;
    const startY = center.top - tableHeight / 2;
    
    const tableElements: fabric.Object[] = [];
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const rect = new fabric.Rect({
          left: startX + c * cellWidth,
          top: startY + r * cellHeight,
          width: cellWidth,
          height: cellHeight,
          fill: 'transparent',
          stroke: activeColor,
          strokeWidth: 1,
          selectable: false,
        });
        
        tableElements.push(rect);
        
        const text = new fabric.IText('', {
          left: startX + c * cellWidth + cellWidth / 2,
          top: startY + r * cellHeight + cellHeight / 2,
          fontSize: 16,
          fontFamily: 'Arial',
          fill: activeColor,
          originX: 'center',
          originY: 'center',
          width: cellWidth - 10,
        });
        
        tableElements.push(text);
      }
    }
    
    const tableGroup = new fabric.Group(tableElements, {
      left: startX,
      top: startY,
      selectable: true,
      subTargetCheck: true,
      interactive: true,
    });
    
    fabricCanvas.add(tableGroup);
    fabricCanvas.setActiveObject(tableGroup);
    fabricCanvas.renderAll();
    
    toast({
      title: "Table created",
      description: `Created a ${rows}×${cols} table`,
    });
  };

  const createEquationSystem = (equations: number) => {
    if (!fabricCanvas) return;
    
    const center = fabricCanvas.getCenter();
    
    const bracketHeight = equations * 30;
    
    let equationText = "";
    
    for (let i = 0; i < equations; i++) {
      if (i === 0) {
        equationText += "a₁x + b₁y = c₁";
      } else if (i === 1) {
        equationText += "\na₂x + b₂y = c₂";
      } else {
        equationText += `\na${i+1}x + b${i+1}y = c${i+1}`;
      }
    }
    
    const leftBrace = new fabric.Text("{", {
      left: center.left - 50,
      top: center.top - bracketHeight/2,
      fontSize: bracketHeight,
      fontFamily: 'Cambria Math, serif',
      fill: activeColor,
      selectable: true,
    });
    
    const equationsText = new fabric.IText(equationText, {
      left: center.left - 40,
      top: center.top - bracketHeight/2 + 15,
      fontSize: 20,
      fontFamily: 'Cambria Math, serif',
      fill: activeColor,
      lineHeight: 1.5,
      selectable: true,
    });
    
    const systemGroup = new fabric.Group([leftBrace, equationsText], {
      left: center.left - 80,
      top: center.top - bracketHeight/2,
      selectable: true,
    });
    
    fabricCanvas.add(systemGroup);
    fabricCanvas.setActiveObject(systemGroup);
    fabricCanvas.renderAll();
    
    toast({
      title: "Equation System Created",
      description: `Created a system with ${equations} equations`,
    });
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div 
      className="w-full h-full flex items-center justify-center bg-gray-100 p-4 overflow-auto"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="canvas-container shadow-lg">
        <canvas ref={canvasRef} />
      </div>
      
      <TableCreator 
        isOpen={tableDialogOpen} 
        onClose={() => setTableDialogOpen(false)} 
        onCreateTable={createTable} 
      />
      
      <EquationSystemCreator 
        isOpen={equationSystemDialogOpen} 
        onClose={() => setEquationSystemDialogOpen(false)} 
        onCreateSystem={createEquationSystem} 
      />
    </div>
  );
};
