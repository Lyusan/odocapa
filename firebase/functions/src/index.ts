import * as functions from 'firebase-functions';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const cors = require('cors')({ origin: true });

const streetInfoBoxMap = [
  {
    key: 'length',
    frPropNames: ['longueur'],
    type: 'listSplitByComma',
  },
  {
    key: 'width',
    frPropNames: ['largeur'],
    type: 'listSplitByComma',
  },
  {
    key: 'namingDate',
    frPropNames: ['dénomination', 'denomination'],
    type: 'listSplitByComma',
  },
  {
    key: 'creationDate',
    frPropNames: ['création', 'date de création'],
    type: 'listSplitByComma',
  },
  {
    key: 'oldName',
    frPropNames: ['ancien nom'],
    type: 'listSplitByComma',
  },
]

const personInfoboxMap = [
  {
    key: 'birthday',
    frPropNames: ['date de naissance', 'naissance'],
    type: 'time',
  },
  {
    key: 'deathday',
    frPropNames: ['date de décès', 'décès'],
    type: 'time',
  },
  {
    key: 'nationality',
    frPropNames: ['nationalité'],
    type: 'listSplitByComma',
  },
  {
    key: 'activity',
    frPropNames: ['activité', 'activités', 'profession', 'professions'],
    type: 'listSplitByComma',
  },
  {
    key: 'school',
    frPropNames: ['Formation'],
    type: 'listSplitByComma',
  },
];

function cleanUp(value: string) {
  return value.replace(/\[[0-9a-zA-Z ]+\](,\[[0-9a-zA-Z ]+\])*/g, '');
}

const handleInfoboxElementByType = (td: Element | null, infoboxData: any) => {
  console.log('handle');
  if (!td) return null;
  switch (infoboxData.type) {
    case 'listSplitByComma':
      return td.textContent?.trim().split(', ');
    case 'time':
      return td.querySelector('time')?.textContent?.trim().split(', ');
    default:
      return null;
  }
};

const handleInfoboxData = (infoBox: Element, infoBoxMap: any) => {
  console.log('handle');
  const trList = [...infoBox.querySelectorAll('tr')];
  console.log(trList.length);
  const res: any = {};
  trList.forEach((tr) => {
    infoBoxMap.forEach((el: any) => {
      if (el.frPropNames.includes(tr.querySelector('th')?.textContent?.trim()?.toLowerCase() || '')) {
        res[el.key] = handleInfoboxElementByType(tr.querySelector('td'), el);
      }
    });
  });
  return res;
};

export const scrapeWikiPerson =
  functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
      const page = request.query.page as string;
      const { data } = await axios.get(encodeURI(page));
      const doc = new JSDOM(data).window.document;
      let infoBox = doc.querySelector('div.infobox_v3');
      if (!infoBox) infoBox = doc.querySelector('table.infobox_v2');
      console.log(infoBox);
      const res: any = {};
      let infoBoxData: any = {},
      if (infoBox) {
        infoBoxData = handleInfoboxData(infoBox, personInfoboxMap);
      }
      const content = doc.querySelector('div.mw-parser-output');
      const childrens = content?.children as HTMLCollectionBase;
      const descriptionParts = [];
      console.log(childrens?.length);
      let firstParagraphMatch = false;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < childrens?.length; i++) {
        const child = childrens[i];
        if (child.tagName !== 'P' && firstParagraphMatch && child.textContent?.trim() !== '') {
          break;
        }
        if (child.tagName === 'P' && child.textContent?.trim() !== '') {
          descriptionParts.push(child.textContent);
          firstParagraphMatch = true;
        }
      }
      res.descriptionParts = cleanUp(descriptionParts?.join(''));
      if (res.descriptionParts.length === 0) {
        const content2 = doc.querySelectorAll('div.mw-parser-output')[1];
        const childrens2 = content2?.children as HTMLCollectionBase;
        const descriptionParts2 = [];
        console.log(childrens2?.length);
        let firstParagraphMatch2 = false;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < childrens2?.length; i++) {
          const child = childrens2[i];
          if (child.tagName !== 'P' && firstParagraphMatch2 && child.textContent?.trim() !== '') {
            break;
          }
          if (child.tagName === 'P' && child.textContent?.trim() !== '') {
            descriptionParts2.push(child.textContent);
            firstParagraphMatch2 = true;
          }
        }
        res.descriptionParts = cleanUp(descriptionParts2?.join(''));
      }
      response.send({...res, ...infoBoxData});
    });
  });

export const scrapeWikiStreet =
  functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
      const page = request.query.page as string;
      const { data } = await axios.get(encodeURI(page));
      const doc = new JSDOM(data).window.document;
      const content = doc.querySelector('div#mw-content-text')?.querySelector('div.mw-parser-output');
      const childrens = content?.children as HTMLCollectionBase;
      let infoBox = doc.querySelector('div.infobox_v3');
      if (!infoBox) infoBox = doc.querySelector('table.infobox_v2');
      console.log('infoBOX', infoBox);
      let infoBoxData = {};
      if (infoBox) {
        infoBoxData = handleInfoboxData(infoBox, streetInfoBoxMap);
      }
      const history = [];
      const nameOrigin = [];
      const nameOriginLinks: { name: string, link: string }[] = [];
      let mode = null;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < childrens?.length; i++) {
        const child = childrens[i];
        if (mode === 'history' && child.tagName === 'P') {
          history.push(child.textContent);
        }
        if (mode === 'nameOrigin' && child.tagName === 'P') {
          nameOrigin.push(child.textContent);
          [...child.querySelectorAll('a')].forEach((a) => nameOriginLinks.push({ name: a.textContent || '', link: a.href }));
        }
        if (child.tagName === 'H2') {
          if (child.textContent?.includes('Origine du nom')) {
            mode = 'nameOrigin';
          } else if (child.textContent?.includes('Historique')) {
            mode = 'history';
          } else {
            mode = null;
          }
        }
      }
      response.send({ history: cleanUp(history.join('')), nameOrigin: cleanUp(nameOrigin.join('')), nameOriginLinks, ...infoBoxData });
    });
  });

export const wikiSearch =
  functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
      const searchStr = request.query.searchStr as string;
      console.log(searchStr);
      try {
        const { data } = await axios.get('https://fr.wikipedia.org/w/api.php', {
          params: { action: 'query', format: 'json', list: 'search', srsearch: searchStr,
          } });
        response.send(data);
      } catch (error) {
        console.log(searchStr);
        response.send(error);
      }
    });
  });

