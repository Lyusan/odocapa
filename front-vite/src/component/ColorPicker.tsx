import React from 'react';

interface ColorPickerProps {
  color: string;
  size: number;
}

export default function ColorPicker({ color, size }: ColorPickerProps) {
  return (
    <div className="rounded-full" style={{ backgroundColor: color, width: size, height: size }} />
  );
}
