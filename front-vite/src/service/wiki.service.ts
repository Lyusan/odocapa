import axios from 'axios';

const FIREBASE_URL = import.meta.env.VITE_FIREBASE_FUNCTION_URL || '';

function formatWikiPageTitleToUrl(value: string) {
  return value?.replaceAll(' ', '_');
}

export function pageTitleToWikiURL(value: string) {
  return `https://fr.wikipedia.org/wiki/${formatWikiPageTitleToUrl(value)}`;
}

export async function getWikiStreetInfo(pageTitle: string) {
  return (
    await axios.get(`${FIREBASE_URL}/scrapeWikiStreet`, {
      params: { page: pageTitleToWikiURL(pageTitle) },
    })
  ).data;
}

export async function getWikiPersonInfo(pageTitle: string) {
  return (
    await axios.get(`${FIREBASE_URL}/scrapeWikiPerson`, {
      params: { page: pageTitleToWikiURL(pageTitle) },
    })
  ).data;
}

export async function getWikiSearch(searchString: string) {
  return (
    await axios.get(`${FIREBASE_URL}/wikiSearch`, {
      params: { searchStr: searchString },
    })
  ).data.query.search.map((e: any) => ({ key: e.title.replace(' ', '_'), displayName: e.title }));
}
