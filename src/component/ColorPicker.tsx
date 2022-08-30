import "./ColorPicker.css"

interface ColorPickerProps {
    color: string
  }

function ColorPicker({color}: ColorPickerProps) {

  return (
    <div className="ColorPicker">
        <div style={{ backgroundColor: color }} className="ColorPickerButton"/>
    </div>
  );
}

export default ColorPicker;
