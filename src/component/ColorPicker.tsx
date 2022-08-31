import { serialize } from "v8";
import "./ColorPicker.css"

interface ColorPickerProps {
    color: string,
    size: number
  }

function ColorPicker({color, size}: ColorPickerProps) {

  return (
    <div className="ColorPicker">
        <div style={{ backgroundColor: color, width: size, height: size }} className="ColorPickerButton"/>
    </div>
  );
}

export default ColorPicker;
