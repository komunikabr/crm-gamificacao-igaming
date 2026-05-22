import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: any) => void;
  className?: string;
}

export default function CustomSelect({ options, value, onChange, className = '' }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  // Fecha o dropdown se o usuário clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Botão Principal do Dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#111116] hover:bg-[#16161f] text-gray-200 border border-gray-800/80 rounded-xl px-4 py-2.5 text-xs font-bold transition-all flex items-center justify-between gap-2 shadow-lg focus:border-purple-500/50 outline-none"
      >
        <div className="flex items-center gap-2">
          {selectedOption.icon}
          <span>{selectedOption.label}</span>
        </div>
        <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-purple-400' : ''}`} />
      </button>

      {/* Menu de Opções Suspenso */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-full min-w-[160px] bg-[#0c0c10]/95 backdrop-blur-md border border-gray-800/80 rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn py-1">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2 transition-all ${
                option.value === value 
                  ? 'bg-purple-600/10 text-purple-400 font-bold border-l-2 border-purple-500' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]'
              }`}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
