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
        <div className="CategorieValues">
        {categorie.values.map((v) => 
            <div className='CategorieValue' key={v.name}>
            <p>{v.name}</p>
            <ColorPicker size={13} color={v.color}/>
            </div>
        )} 
        </div>
    </div>
  );
}

export default CategorieComponent;
