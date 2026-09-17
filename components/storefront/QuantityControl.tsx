"use client";

import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove?: () => void;
  min?: number;
  max?: number;
}

export default function QuantityControl({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  onRemove,
  min = 1,
  max = 99
}: QuantityControlProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center border rounded-lg bg-white overflow-hidden">
        <button
          onClick={onDecrease}
          disabled={quantity <= min && !onRemove}
          className="p-2 text-gray-500 hover:text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="button"
        >
          {quantity <= min && onRemove ? <Trash2 size={16} /> : <Minus size={16} />}
        </button>
        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
        <button
          onClick={onIncrease}
          disabled={quantity >= max}
          className="p-2 text-gray-500 hover:text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="button"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
