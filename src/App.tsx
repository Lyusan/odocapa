import './App.css';
import Map from './component/Map';
import { useEffect, useState } from 'react';
import Categorie from './component/Categorie';
import { Categories } from './model/Categorie';
function App() {

  const [categories, setCategories] = useState<Categories>([
    {
      name: 'Genre',
      values: [
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
      values: [
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
        },
        {
          name: 'Artiste',
          color: 'black'
        },
        {
          name: 'Autre',
          color: 'black'
        }
      ]
    },
  ]);

  const [streetName, setStreetName] = useState<string>("Click on a street");

  return (
    <div className="App">
      <div className="MapView">
        <div className='MapViewHeader'>
          <div className='MapViewCategories'>
            {categories.map((c) =>
              <Categorie categorie={c} />
            )}
            </div>
        </div>
        <div className='MapViewBody'>
          <Map onStreetClick={(streetName) => {setStreetName(streetName)}}/>
          <div>{streetName}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
