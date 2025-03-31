
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fabric } from "fabric";

interface TableCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTable: (rows: number, cols: number) => void;
}

export const TableCreator: React.FC<TableCreatorProps> = ({ isOpen, onClose, onCreateTable }) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  
  const handleCreate = () => {
    onCreateTable(rows, cols);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Table</DialogTitle>
          <DialogDescription>
            Choose the number of rows and columns for your table.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div className="flex items-center justify-between">
            <label>Rows:</label>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setRows(Math.max(1, rows - 1))}
              >-</Button>
              <span className="w-8 text-center">{rows}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setRows(rows + 1)}
              >+</Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label>Columns:</label>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCols(Math.max(1, cols - 1))}
              >-</Button>
              <span className="w-8 text-center">{cols}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCols(cols + 1)}
              >+</Button>
            </div>
          </div>
          
          <div className="border rounded overflow-hidden mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  {Array.from({ length: Math.min(cols, 5) }).map((_, index) => (
                    <TableHead key={index}>Col {index + 1}</TableHead>
                  ))}
                  {cols > 5 && <TableHead>...</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: Math.min(rows, 5) }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.from({ length: Math.min(cols, 5) }).map((_, colIndex) => (
                      <TableCell key={colIndex}></TableCell>
                    ))}
                    {cols > 5 && <TableCell>...</TableCell>}
                  </TableRow>
                ))}
                {rows > 5 && (
                  <TableRow>
                    {Array.from({ length: Math.min(cols, 5) + (cols > 5 ? 1 : 0) }).map((_, index) => (
                      <TableCell key={index}>...</TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
