import './App.css';
import Map from './component/Map';
import { useEffect, useState } from 'react';
import Categorie from './component/Categorie';
function App() {
  
  const [categories, setCategories] = useState<any>([
    {
      name: 'Genre',
      values:[
        {
          name: 'Homme',
          color: 'yellow'
        },
        {
          name: 'Women',
          color: 'red'
        }
      ]
    },
    {
      name: 'Activités',
      values:[
        {
          name: 'Militaire',
          color: 'yellow'
        },
        {
          name: 'Scientifique',
          color: 'blue'
        },
        {
          name: 'Science humaine',
          color: 'cyan'
        },
        {
          name: 'Ecclésiastique',
          color: 'black'
        }
      ]
    },
  ]);

  return (
    <div className="App">
        {categories.map((c) => 
            <Categorie categorie={c}/>
        )} 
      <Map></Map>
    </div>
  );
}

export default App;
