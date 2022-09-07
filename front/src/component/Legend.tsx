import "./Legend.css"
import { Categorie } from "../model/Categorie";
import ColorPicker from "./ColorPicker";

interface LegendProps {
    categorie: Categorie
  }

function Legend({categorie}: LegendProps) {

  return (
    <div className="Legend">
        {
            categorie.values.map(cv => 
                <div className="CategorieValue">
                    <ColorPicker  color={cv.color} size={10}/>
                    <div className="CategorieText">{cv.name}</div>
                </div>
            )
        }
    </div>
  );
}

export default Legend;
