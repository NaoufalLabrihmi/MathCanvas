
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EquationSystemCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSystem: (equations: number) => void;
}

export const EquationSystemCreator: React.FC<EquationSystemCreatorProps> = ({ 
  isOpen, 
  onClose, 
  onCreateSystem 
}) => {
  const [equations, setEquations] = useState(2);
  const [variables, setVariables] = useState(2);
  
  const handleCreate = () => {
    onCreateSystem(equations);
    onClose();
  };
  
  // Generate example equations based on the number of variables
  const getExampleEquation = (index: number) => {
    const variableNames = ['x', 'y', 'z', 'w', 't', 'u', 'v'];
    
    let equation = '';
    for (let i = 0; i < Math.min(variables, variableNames.length); i++) {
      const coefficient = String.fromCharCode(97 + index) + (i === 0 ? '' : String(i + 1));
      equation += `${coefficient}${variableNames[i]} ${i < Math.min(variables, variableNames.length) - 1 ? '+ ' : '= '}`;
    }
    equation += String.fromCharCode(99 + index);
    
    return equation;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Equation System</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div className="flex items-center justify-between">
            <label>Number of Equations:</label>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setEquations(Math.max(1, equations - 1))}
              >-</Button>
              <span className="w-8 text-center">{equations}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setEquations(Math.min(6, equations + 1))}
              >+</Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label>Number of Variables:</label>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setVariables(Math.max(1, variables - 1))}
              >-</Button>
              <span className="w-8 text-center">{variables}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setVariables(Math.min(5, variables + 1))}
              >+</Button>
            </div>
          </div>
          
          <div className="border rounded p-4 bg-gray-50">
            <div className="flex items-center">
              <div className="text-4xl mr-2">{`{`}</div>
              <div className="flex flex-col">
                {Array.from({ length: equations }).map((_, index) => (
                  <div key={index} className="my-1 font-mono">
                    {getExampleEquation(index)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
