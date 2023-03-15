import React from 'react';
import InfoButton from '../../component/InfoButton';
import Link from '../../component/Link';

export default function SourcesPage() {
  return (
    <>
      <h2 className="font-bold pb-4">Open Data Paris</h2>
      <p className="pl-2">
        {
          '- Dénominations des emprises des voies actuelles - Mairie de Paris, 21/11/2022, sous licence ODbL '
        }
        <Link
          text="(lien)"
          link="https://opendata.paris.fr/explore/dataset/denominations-emprises-voies-actuelles/information/"
        />
        <br />
        {'- Linéaires des Voies - Mairie de Paris, 21/11/2022, sous licence ODbL '}
        <Link text="(lien)" link="https://opendata.paris.fr/explore/dataset/voie/information/" />
        <br />
        <br />
        {'Licence : '}
        <Link
          text="ODbL : Open Database License"
          link="https://opendatacommons.org/licenses/odbl/"
        />
        <br />
      </p>
      <h2 className="font-bold py-4">Wikipedia</h2>
      {`Une grande partie du contenu textuelle du projet est tiré de Wikipedia. Pour chacune des rues vous
      trouverez les articles utilisés en cliquant sur `}
      <InfoButton size={16} onInfo={() => null} />
      {` dans la page de la rue. L'ensemble des
      textes de Wikipedia est sous la licence : `}
      <Link
        text="CC BY-SA 3.0 Unported"
        link="https://fr.wikipedia.org/wiki/Wikip%C3%A9dia:Licence_Creative_Commons_Paternit%C3%A9-Partage_des_Conditions_Initiales_%C3%A0_l%27Identique_3.0_non_transpos%C3%A9"
      />
    </>
  );
}
