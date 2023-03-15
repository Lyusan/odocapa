import React from 'react';

export default function ProjectPage() {
  return (
    <>
      <strong>{'Odocapa '}</strong>
      est un projet d'étude de la toponymie de Paris. Il a pour objectif d'inviter à une réflexion
      et d'informer.
      <span className="font-semibold">
        {' '}
        Le projet est encore en cours de développement, son contenu doit donc être considéré avec
        prudence.
      </span>
      <h2 className="font-bold py-4">Interroger les noms des rues de Paris</h2>
      Les noms des rues font partie de notre quotidien, ils sont omniprésents dans notre vie, se
      c'est un outil indispensable pour se repérer dans l'espace. Cependant le choi de leur nom ne
      relève pas d'une logique pratique mais d'une logique politique. Les noms des rues sont le
      reflet de l'histoire de la ville, ils sont le témoignage de l'histoire de Paris. Pour étudier
      répartition géographique des toponymes, les rues sont colorées en fonction de catégories
      telles que le type de nom, le genre ou l’activité exercée par le toponyme. La carte ainsi
      colorée permet de visualiser de manière intuitive la distribution dans l'espace des toponymes.
      <h2 className="font-bold py-4">Informer sur l’histoire de la rue et de son toponyme</h2>
      Le second objectif passe principalement par l’écran qui s’affiche lorsque l’on clique sur une
      rue. Ce dernier comprend trois pages. Ici seulement les deux premières nous intéressent, la
      première contient des informations liées à la rue: - ses dimensions (longueur et largeur), -
      ses dates clés (création, dénomination), - un texte sur l’origine du nom (généralement tiré de
      Wikipédia), - un texte sur l’histoire de la rue (également souvent tiré de Wikipédia). La
      seconde page comprend une incorporation de la page Wikipédia liée au nom propre associé à la
      rue. Par exemple pour l’axe Rue de Rivoli, la page Wikipédia associée est celle de la bataille
      de Rivoli de 1797 pendant la première campagne d'Italie. L’incorporation directe de la page
      permet d'exploiter l’ensemble du contenu (texte, images, lien) sans avoir à quitter le site,
      fluidifiant ainsi la navigation entre les différentes rues.
    </>
  );
}
