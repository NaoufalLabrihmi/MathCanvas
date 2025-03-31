
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MathSymbolPanel } from "@/components/MathSymbolPanel";
import { Canvas } from "@/components/Canvas";
import { GeometryToolbar } from "@/components/GeometryToolbar";
import { 
  Sigma, 
  Download, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { jsPDF } from "jspdf";
import { TextFormattingToolbar } from "@/components/TextFormattingToolbar";

export const Layout = () => {
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(24);
  const { toast } = useToast();

  // Update selected color
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    // Dispatch event to notify Canvas component
    const event = new CustomEvent('colorChange', { detail: { color } });
    window.dispatchEvent(event);
  };

  // Update font size
  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    // Dispatch event to notify Canvas component
    const event = new CustomEvent('fontSizeChange', { detail: { size } });
    window.dispatchEvent(event);
  };

  // Export canvas to PDF
  const exportToPDF = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      toast({
        title: "Error",
        description: "Canvas not found",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      // Convert the canvas to an image
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Add the image to the PDF
      pdf.addImage(imgData, 'JPEG', 10, 10, 190, 277);
      
      // Save the PDF
      pdf.save("mathcanvas-document.pdf");
      
      toast({
        title: "Success",
        description: "PDF exported successfully",
      });
    } catch (error) {
      console.error("PDF export failed:", error);
      toast({
        title: "Export failed",
        description: "Could not export to PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sigma className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">MathCanvas</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Save</Button>
          <Button onClick={exportToPDF}>
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Math Symbols */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <MathSymbolPanel />
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 overflow-auto">
          <Canvas />
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-72 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Properties</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Size</label>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={fontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                className="w-full" 
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10</span>
                <span>{fontSize}</span>
                <span>100</span>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Color</label>
              <div className="flex space-x-2">
                <button 
                  className={`w-6 h-6 rounded-full bg-black border ${selectedColor === '#000000' ? 'ring-2 ring-offset-2 ring-blue-500' : 'border-gray-300'}`}
                  onClick={() => handleColorSelect('#000000')}
                />
                <button 
                  className={`w-6 h-6 rounded-full bg-blue-500 border ${selectedColor === '#3b82f6' ? 'ring-2 ring-offset-2 ring-blue-500' : 'border-gray-300'}`}
                  onClick={() => handleColorSelect('#3b82f6')}
                />
                <button 
                  className={`w-6 h-6 rounded-full bg-red-500 border ${selectedColor === '#ef4444' ? 'ring-2 ring-offset-2 ring-blue-500' : 'border-gray-300'}`}
                  onClick={() => handleColorSelect('#ef4444')}
                />
                <button 
                  className={`w-6 h-6 rounded-full bg-green-500 border ${selectedColor === '#22c55e' ? 'ring-2 ring-offset-2 ring-blue-500' : 'border-gray-300'}`}
                  onClick={() => handleColorSelect('#22c55e')}
                />
                <button 
                  className={`w-6 h-6 rounded-full bg-yellow-500 border ${selectedColor === '#eab308' ? 'ring-2 ring-offset-2 ring-blue-500' : 'border-gray-300'}`}
                  onClick={() => handleColorSelect('#eab308')}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Text Formatting</label>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="p-1 h-8 w-8"
                  onClick={() => {
                    const event = new CustomEvent('textFormat', { detail: { format: 'bold' } });
                    window.dispatchEvent(event);
                  }}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="p-1 h-8 w-8"
                  onClick={() => {
                    const event = new CustomEvent('textFormat', { detail: { format: 'italic' } });
                    window.dispatchEvent(event);
                  }}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="p-1 h-8 w-8"
                  onClick={() => {
                    const event = new CustomEvent('textFormat', { detail: { format: 'underline' } });
                    window.dispatchEvent(event);
                  }}
                >
                  <Underline className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Alignment</label>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="p-1 h-8 w-8"
                  onClick={() => {
                    const event = new CustomEvent('textFormat', { detail: { format: 'align-left' } });
                    window.dispatchEvent(event);
                  }}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="p-1 h-8 w-8"
                  onClick={() => {
                    const event = new CustomEvent('textFormat', { detail: { format: 'align-center' } });
                    window.dispatchEvent(event);
                  }}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="p-1 h-8 w-8"
                  onClick={() => {
                    const event = new CustomEvent('textFormat', { detail: { format: 'align-right' } });
                    window.dispatchEvent(event);
                  }}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="bg-white border-t border-gray-200 p-2">
        <TextFormattingToolbar />
        <div className="mt-2">
          <GeometryToolbar />
        </div>
      </div>
    </div>
  );
};
