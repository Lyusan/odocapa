import { Categorie } from "../model/Categorie";
import "./Categorie.css"

interface ColorPickerProps {
    categorie: Categorie,
    selected: boolean
    onCategorieClick: (categorie: Categorie) => void
  }

function CategorieComponent({categorie, selected, onCategorieClick}: ColorPickerProps) {

  return (
    <div className="Categorie" style={{borderBottomStyle: "solid", borderBottomWidth: selected ? '3px' : '0px', borderBottomColor: selected ? 'orange' : 'grey'}}>
        <div className="CategorieName" style={{fontWeight: selected ? 600 : 400}} onClick={() => {onCategorieClick(categorie)}}>{categorie.name}</div>
    </div>
  );
}

export default CategorieComponent;
