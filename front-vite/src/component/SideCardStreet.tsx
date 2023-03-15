/* eslint-disable no-confusing-arrow */
/* eslint-disable no-nested-ternary */
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import CategoryList from './CategoryList';
import { Street } from '../type/Street';
import SelectButton from './SelectButton';
import InfoButton from './InfoButton';
import ClosingButton from './ClosingButton';
import Link from './Link';

interface StreetCardProp {
  street: Street;
}

export default function SideCardStreet({ street }: StreetCardProp) {
  const [currentDisplay, setCurrentDisplay] = useState(-1);
  const [displaySource, setDispaySource] = useState(false);
  useEffect(() => {
    setCurrentDisplay(-1);
  }, [street]);
  let page = null;
  if (currentDisplay === -1) {
    page = (
      <div className="[&>*]:py-1 h-5/6 relative">
        <div className="absolute top-0 right-0">
          {displaySource ? (
            <ClosingButton size={12} onClose={() => setDispaySource(false)} />
          ) : (
            <InfoButton size={23} onInfo={() => setDispaySource(true)} />
          )}
        </div>
        {displaySource ? (
          <>
            <p className="text-sm">
              <h2 className="font-bold pb-0.5">Longueur</h2>
              {street.length.value ? (
                <>
                  <Link
                    text="Dénominations des emprises des voies actuelles"
                    link="https://opendata.paris.fr/explore/dataset/denominations-emprises-voies-actuelles/information/"
                  />
                  {' - Mairie de Paris, 21/11/2022, sous licence ODbL'}
                </>
              ) : (
                'Donnée non disponible'
              )}
              <h2 className="font-bold pb-0.5">Largeur</h2>
              {street.width.value ? (
                <>
                  <Link
                    text="Dénominations des emprises des voies actuelles"
                    link="https://opendata.paris.fr/explore/dataset/denominations-emprises-voies-actuelles/information/"
                  />
                  {' - Mairie de Paris, 21/11/2022, sous licence ODbL'}
                </>
              ) : (
                'Donnée non disponible'
              )}
              <h2 className="font-bold pb-0.5">Date de création</h2>
              {street.parisDataInfo.opening ? (
                <>
                  <Link
                    text="Dénominations des emprises des voies actuelles"
                    link="https://opendata.paris.fr/explore/dataset/denominations-emprises-voies-actuelles/information/"
                  />
                  {' - Mairie de Paris, 21/11/2022, sous licence ODbL'}
                </>
              ) : (
                'Donnée non disponible'
              )}

              <h2 className="font-bold pb-0.5">Date de dénomination</h2>
              {street.parisDataInfo.naming ? (
                <>
                  <Link
                    text="Dénominations des emprises des voies actuelles"
                    link="https://opendata.paris.fr/explore/dataset/denominations-emprises-voies-actuelles/information/"
                  />
                  {' - Mairie de Paris, 21/11/2022, sous licence ODbL'}
                </>
              ) : (
                'Donnée non disponible'
              )}

              <h2 className="font-bold pb-0.5">Origine du nom</h2>
              <Link
                text="Contenu soumis à la licence CC-BY-SA 3.0"
                link="https://creativecommons.org/licenses/by-sa/3.0/deed.fr"
              />
              {'. Source : Article '}
              <em>
                <Link
                  text="Boulevard Sérurier"
                  link="http://fr.wikipedia.org/wiki/Boulevard_S%C3%A9rurier"
                />
              </em>
              {' de '}
              <Link text="Wikipédia en français" link="https://fr.wikipedia.org/" />
              {' ('}
              <Link
                text="auteurs"
                link="http://fr.wikipedia.org/w/index.php?title=Boulevard_S%C3%A9rurier&action=history"
              />
              {')'}
            </p>
            <p className="text-sm">
              <h2 className="font-bold pb-0.5">Histoire de la rue</h2>
              <Link
                text="Contenu soumis à la licence CC-BY-SA 3.0"
                link="https://creativecommons.org/licenses/by-sa/3.0/deed.fr"
              />
              {'. Source : Article '}
              <em>
                <Link
                  text="Boulevard Sérurier"
                  link="http://fr.wikipedia.org/wiki/Boulevard_S%C3%A9rurier"
                />
              </em>
              {' de '}
              <Link text="Wikipédia en français" link="https://fr.wikipedia.org/" />
              {' ('}
              <Link
                text="auteurs"
                link="http://fr.wikipedia.org/w/index.php?title=Boulevard_S%C3%A9rurier&action=history"
              />
              {')'}
            </p>
          </>
        ) : (
          <>
            <div className="flex text-sm mb-3">
              <p className="pr-12 flex-wrap shrink-0">
                <strong className="pr-1">Longueur:</strong>
                {`${street.length.value} m`}
                <br />
                <strong className="pr-1">Largeur:</strong>
                {`${street.width.value} m`}
              </p>
              <p className="pr-4">
                <strong className="pr-1">Date de création:</strong>
                {street.parisDataInfo.opening || 'inconnue'}
                <br />
                <strong className="pr-1">Date de dénomination:</strong>
                {street.parisDataInfo.naming || 'inconnue'}
              </p>
            </div>

            <p className="text-sm">
              <h2 className="font-bold pb-0.5">Origine du nom</h2>
              {street.nameOrigin.value.split('\n').map((line) => (
                <p className="py-1">{line}</p>
              ))}
            </p>
            <p className="text-sm">
              <h2 className="font-bold pb-0.5">Histoire de la rue</h2>
              {street.nameDescription.value.split('\n').map((line) => (
                <p className="py-0.5">{line}</p>
              ))}
            </p>
          </>
        )}
      </div>
    );
  } else if (currentDisplay === street.subItems.length) {
    page = <CategoryList street={street} />;
  } else {
    page = street.subItems[currentDisplay].description.source ? (
      <div className={classNames('[&>*]:py-1 h-full')}>
        <iframe
          title="Wikipedia"
          height="100%"
          width="100%"
          src={street.subItems[currentDisplay].description.source!}
        />
      </div>
    ) : null;
  }
  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex gap-3 justify-center items-center mb-4">
        <SelectButton
          name="Rue"
          selected={currentDisplay === -1}
          onClick={() => setCurrentDisplay(-1)}
        />
        {street.subItems
          .map((subItem, subItemIndex) =>
            subItem.description.source ? (
              <SelectButton
                name={subItem.name.value}
                selected={currentDisplay === subItemIndex}
                onClick={() => setCurrentDisplay(subItemIndex)}
              />
            ) : null,
          )
          .filter((item) => item !== null)}
        <SelectButton
          name="Categories"
          selected={currentDisplay === street.subItems.length}
          onClick={() => setCurrentDisplay(street.subItems.length)}
        />
      </div>
      <div className="overflow-auto h-full">{page}</div>
    </div>
  );
}
