import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface HeaderProps {
  isAdminMode: boolean;
  setIsAdminMode: (value: boolean) => void;
}

export function Header({ isAdminMode, setIsAdminMode }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <h1 className="text-xl md:text-2xl font-heading font-bold text-gray-800">
            Shop Curator
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="admin-mode" className="text-sm">Admin</Label>
          <Switch 
            id="admin-mode" 
            checked={isAdminMode} 
            onCheckedChange={setIsAdminMode} 
          />
        </div>
      </div>
    </header>
  );
}
