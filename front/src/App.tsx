import './App.css';
import Map from './component/Map';
import { useEffect, useState } from 'react';
import Categorie from './component/Categorie';
import { Categorie as CategorieM, Categories } from './model/Categorie';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FormView from './view/Form.view';
import Legend from './component/Legend';

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
    {
      name: 'Opinion politique',
      values: [
      ]
    },
    {
      name: 'Siecles',
      values: [
        {
          name: "Ier",
          color: "#12a72a"
        },
        {
          name: "IIeme",
          color: "#00aa3e"
        },
        {
          name: "IIIeme",
          color: "#00ae50"
        },
        {
          name: "IVeme",
          color: "#00b161"
        },
        {
          name: "Veme",
          color: "#00b371"
        },
        {
          name: "VIeme",
          color: "#00b681"
        },
        {
          name: "VIIeme",
          color: "#00b890"
        },
        {
          name: "VIIIeme",
          color: "#00bb9e"
        },
        {
          name: "IXeme",
          color: "#00bdac"
        },
        {
          name: "Xeme",
          color: "#00beb8"
        },
        {
          name: "XIeme",
          color: "#00c0c4"
        },
        {
          name: "XIIeme",
          color: "#00c1cf"
        },
        {
          name: "XIIIeme",
          color: "#00c2d9"
        },
        {
          name: "XIVeme",
          color: "#00c3e2"
        },
        {
          name: "XVeme",
          color: "#00c4ea"
        },
        {
          name: "XVIeme",
          color: "#00c4f0"
        },
        {
          name: "XVIIeme",
          color: "#00c5f6"
        },
        {
          name: "XVIIIeme",
          color: "#00c5fa"
        },
        {
          name: "XIXeme",
          color: "#3bc5fd"
        },
        {
          name: "XXeme",
          color: "#59c5ff"
        },
      ]
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].name);
  const [streetName, setStreetName] = useState<string>("Click on a street");

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/map" element={
            <div className="MapView">
              <div className='MapViewHeader'>
                <div className='MapViewCategories'>
                  {categories.map((c) =>
                    <Categorie categorie={c} selected={selectedCategory === c.name} onCategorieClick={(c) => setSelectedCategory(c.name)} key={c.name} />
                  )}
                </div>
              </div>
              <div className='MapViewBody'>
                <Map onStreetClick={(streetName) => { setStreetName(streetName) }} />
                <div>{streetName}</div>
              </div>
              <Legend categorie={categories.find(c => c.name === selectedCategory) as CategorieM}/>
            </div>
          } />
          <Route path="/config" element={<FormView />} />
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
