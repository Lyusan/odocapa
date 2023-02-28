import * as functions from 'firebase-functions';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const cors = require('cors')({ origin: true });

interface InfoboxMapElement {
  key: string;
  frPropNames: string[];
  type: 'listSplitByComma' | 'time';
}

const STREET_INFOBOX_MAP = [
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
] as InfoboxMapElement[];

const PERSON_INFOBOX_MAP = [
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
    frPropNames: ['formation'],
    type: 'listSplitByComma',
  },
] as InfoboxMapElement[];

/**
 * Clean up the value of the infobox
 * @param {string} value
 * @return {string}
 * @example cleanUp('[[France]]') => 'France'
*/
function cleanUp(value: string) {
  return value.replace(/\[[0-9a-zA-Z ]+\](,\[[0-9a-zA-Z ]+\])*/g, '');
}

type HandleInfoboxElementByTypeResult = null | string[];
type HandleInfoboxDataResult = Record<string, HandleInfoboxElementByTypeResult>;

/**
 * Handle the value of the infobox by type
 * @param {Element | null} td
 * @param {InfoboxMapElement} infoboxElement
 * @return {HandleInfoboxElementByTypeResult} data from the infobox element
 * @example handleInfoboxElementByType(td, { type: 'listSplitByComma' }) => ['France', 'Belgique']
*/
const handleInfoboxElementByType =
  (td: Element | null, infoboxElement: InfoboxMapElement): HandleInfoboxElementByTypeResult => {
    if (!td) return null;
    switch (infoboxElement.type) {
      case 'listSplitByComma':
        return td.textContent?.trim().split(', ') || null;
      case 'time':
        return td.querySelector('time')?.textContent?.trim().split(', ') || null;
      default:
        return null;
    }
  };

/**
 * Handle the infobox data
 * @param {Element} infoBox
 * @param {InfoboxMapElement[]} infoBoxMap
 * @return {HandleInfoboxDataResult} data from the infobox
*/
const handleInfoboxData = (infoBox: Element, infoBoxMap: InfoboxMapElement[]) => {
  const trList = [...infoBox.querySelectorAll('tr')];
  const res: HandleInfoboxDataResult = {};
  trList.forEach((tr) => {
    infoBoxMap.forEach((el) => {
      if (el.frPropNames.includes(tr.querySelector('th')?.textContent?.trim()?.toLowerCase() || '')) {
        res[el.key] = handleInfoboxElementByType(tr.querySelector('td'), el);
      }
    });
  });
  return res;
};

/**
 * Extract the description of the wikipedia page
 * @param {HTMLAllCollectionBase} elements
 * @returns {string | null} main description of the wikipedia page
 */
const extractDescription = (elements: HTMLCollectionBase | undefined): string | null => {
  if (!elements) return null;
  let firstParagraphMatch = false;
  const descriptionParts: string[] = [];
  Object.keys(elements).forEach((index) => {
    const child = elements[Number(index)];
    if (!child) return;
    if (child.tagName !== 'P' && firstParagraphMatch && child.textContent?.trim() !== '') return;
    if (child.tagName === 'P' && child.textContent && child.textContent?.trim() !== '') {
      descriptionParts.push(child.textContent);
      firstParagraphMatch = true;
    }
  });
  return cleanUp(descriptionParts.join(''));
};

const ERROR_MESSAGE_MISSING_PARAMETER = (parameterName: string) => `Missing '${parameterName}' parameter`;
const ERROR_MESSAGE_BAD_PARAMETER_TYPE = (parameterName: string, parameterType: string) => `Query parameter '${parameterName}' must be a ${parameterType}`;
const ERROR_MESSAGE_LOADING_WIKI_PAGE = 'Error while loading the wikipedia page';

/*
 * Scrape the wikipedia page of a person
 * @param {functions.https.Request} request (request.query.page = url of the wikipedia page)
 * @param {functions.https.Response} response
 * @example https://us-central1-<project-id>.cloudfunctions.net/scrapeWikiPerson?page=https://fr.wikipedia.org/wiki/Alain_Ducasse
 * @example local http://localhost:5001/odocapa-4a31f/us-central1/scrapeWikiPerson?page=https://fr.wikipedia.org/wiki/Alain_Ducasse
 */
export const scrapeWikiPerson =
  functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
      if (!request.query.page) {
        response.status(400).send(ERROR_MESSAGE_MISSING_PARAMETER('page'));
        return;
      }
      if (typeof request.query.page !== 'string') {
        response.status(400).send(ERROR_MESSAGE_BAD_PARAMETER_TYPE('page', 'string'));
        return;
      }
      const page = request.query.page as string;
      try {
        const { data } = await axios.get(encodeURI(page));
        const { document } = new JSDOM(data).window;
        let infoBox = document.querySelector('div.infobox_v3');
        if (!infoBox) infoBox = document.querySelector('table.infobox_v2');
        const res: any = {};
        let infoBoxData: any = {};
        if (infoBox) {
          infoBoxData = handleInfoboxData(infoBox, PERSON_INFOBOX_MAP);
        }
        const descriptionParentElementDiv = 'div.mw-parser-output';
        const directChildren = document.querySelector(descriptionParentElementDiv)?.children;
        res.descriptionParts = extractDescription(directChildren);
        if (res.descriptionParts.length === 0) {
          const childrenFromTheFirstChild =
            document.querySelectorAll(descriptionParentElementDiv)[1]?.children;
          res.descriptionParts = extractDescription(childrenFromTheFirstChild);
        }
        response.send({ ...res, ...infoBoxData });
      } catch (e) {
        response.status(400).send({ message: ERROR_MESSAGE_LOADING_WIKI_PAGE, axiosError: e });
      }
    });
  });

/*
 * Scrape the wikipedia page of a street
 * @param {functions.https.Request} request (request.query.page = url of the wikipedia page)
 * @param {functions.https.Response} response
 * @example https://us-central1-<project-id>.cloudfunctions.net/scrapeWikiStreet?page=https://fr.wikipedia.org/wiki/Rue_de_l'Industrie_(Paris)
 * @example local http://localhost:5001/odocapa-4a31f/us-central1/scrapeWikiStreet?page=https://fr.wikipedia.org/wiki/Rue_de_l'Industrie_(Paris)
 */
export const scrapeWikiStreet =
  functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
      if (!request.query.page) {
        response.status(400).send(ERROR_MESSAGE_MISSING_PARAMETER('page'));
        return;
      }
      if (typeof request.query.page !== 'string') {
        response.status(400).send(ERROR_MESSAGE_BAD_PARAMETER_TYPE('page', 'string'));
        return;
      }
      try {
        const page = request.query.page as string;
        const { data } = await axios.get(encodeURI(page));
        const doc = new JSDOM(data).window.document;
        const content = doc.querySelector('div#mw-content-text')?.querySelector('div.mw-parser-output');
        const childrens = content?.children as HTMLCollectionBase;
        let infoBox = doc.querySelector('div.infobox_v3');
        if (!infoBox) infoBox = doc.querySelector('table.infobox_v2');
        let infoBoxData = {};
        if (infoBox) {
          infoBoxData = handleInfoboxData(infoBox, STREET_INFOBOX_MAP);
        }
        const history: (string | null)[] = [];
        const nameOrigin: (string | null)[] = [];
        const nameOriginLinks: { name: string, link: string }[] = [];
        let mode: string | null = null;
        Object.keys(childrens).forEach((index) => {
          const child = childrens[Number(index)];
          if (mode === 'history' && child.tagName === 'P') {
            history.push(child.textContent);
          } else if (mode === 'nameOrigin' && child.tagName === 'P') {
            nameOrigin.push(child.textContent);
            [...child.querySelectorAll('a')].forEach((a) => nameOriginLinks.push({ name: a.textContent || '', link: a.href }));
          } else if (child.tagName === 'H2') {
            if (child.textContent?.includes('Origine du nom')) {
              mode = 'nameOrigin';
            } else if (child.textContent?.includes('Historique')) {
              mode = 'history';
            } else {
              mode = null;
            }
          }
        });
        response.send({ history: cleanUp(history.join('')), nameOrigin: cleanUp(nameOrigin.join('')), nameOriginLinks, ...infoBoxData });
      } catch (e) {
        response.status(400).send({ message: ERROR_MESSAGE_LOADING_WIKI_PAGE, axiosError: e });
      }
    });
  });

/*
 * Search in wikipedia
 * @param {functions.https.Request} request (request.query.searchStr = string to search in wiki)
 * @param {functions.https.Response} response
 * @example https://us-central1-<project-id>.cloudfunctions.net/wikiSearch?searchStr="Roger Federer"
 * @example local http://localhost:5001/odocapa-4a31f/us-central1/wikiSearch?page="Roger Federer"
 */
export const wikiSearch =
  functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
      if (!request.query.searchStr) {
        response.status(400).send(ERROR_MESSAGE_MISSING_PARAMETER('searchStr'));
        return;
      }
      if (typeof request.query.searchStr !== 'string') {
        response.status(400).send(ERROR_MESSAGE_BAD_PARAMETER_TYPE('searchStr', 'string'));
        return;
      }
      const searchStr = request.query.searchStr as string;
      try {
        const { data } = await axios.get('https://fr.wikipedia.org/w/api.php', {
          params: { action: 'query', format: 'json', list: 'search', srsearch: searchStr },
        });
        response.send(data);
      } catch (e) {
        response.status(400).send({ message: ERROR_MESSAGE_LOADING_WIKI_PAGE, axiosError: e });
      }
    });
  });
