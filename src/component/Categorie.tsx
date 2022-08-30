import { Categorie } from "../model/Categorie";
import "./Categorie.css"
import ColorPicker from "./ColorPicker";

interface ColorPickerProps {
    categorie: Categorie
  }

function CategorieComponent({categorie}: ColorPickerProps) {

  return (
    <div className="Categorie">
        <h3>{categorie.name}</h3>
        {categorie.values.map((v) => 
            <>
            <p>{v.name}</p>
            <ColorPicker color={v.color}/>
            </>
        )} 
    </div>
  );
}

export default CategorieComponent;
