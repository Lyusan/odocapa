import './Form.view.css';
import StreetButton from '../component/StreetButton';
import { getStreets } from '../helper/map';
import ActivitySelector from '../component/ActivitySelector';
import { useState } from 'react';

function FormView() {
    const streets = getStreets();
    const [street, setStreet] = useState<string>();

    return (
        <div className="FormView">
            <div className="FormViewStreetList">
                {streets.map((s) =>
                    <StreetButton
                        name={s.name}
                        isConfigured={false}
                        lastUpdateDate='toto'
                        onSelectStreet={() => setStreet(s.name)} />
                )}
            </div>
            <div className="FormViewForm">
                <h1>{street}</h1>
                <div>
                    <label>Année de naissance</label>
                    <input />
                </div>
                <div>
                    <label>Année de décès</label>
                    <input />
                </div>
                <div>
                    <label>Genre</label>
                    <button>homme</button>
                    <button>femme</button>
                </div>
                <label>Activité</label>
               <ActivitySelector/>
            </div>
            <div className="FormViewWiki" style={{display: "flex", flexDirection: "column"}}></div>
        </div>
    );
}

export default FormView;
