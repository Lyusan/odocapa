import * as functions from "firebase-functions";
const cors = require('cors')({origin: true});
import axios from "axios";
import { JSDOM } from "jsdom";
import { database } from "firebase-admin";

const infoboxMap = [
  {
    key: "birthday",
    frPropNames: ["date de naissance", "naissance"],
    type: "time"
  },
  {
    key: "deathday",
    frPropNames: ["date de décès", "décès"],
    type: "time"
  },
  {
    key: "nationality",
    frPropNames: ["nationalité"],
    type: "listSplitByComma"
  },
  {
    key: "activity",
    frPropNames: ["activité", "activités"],
    type: "listSplitByComma"
  },
  {
    key: "school",
    frPropNames: ["Formation"],
    type: "listSplitByComma"
  }
];

const handleInfoboxElementByType = (td: Element | null, infoboxData: any) => {
  console.log("handle")
  if (!td) return null;
  switch (infoboxData.type) {
    case "listSplitByComma":
      return td.textContent?.trim().split(', ');
    case "time":
      return td.querySelector('time')?.textContent?.trim().split(', ');
    default:
      return null;
  }
}

const handleInfoboxData = (infoBox: Element) => {
  console.log("handle")
  const trList = [...infoBox.querySelectorAll('tr')];
  console.log(trList.length)
  const res: any = {};
  trList.forEach(tr => {
    infoboxMap.forEach(el => {
      if (el.frPropNames.includes(tr.querySelector('th')?.textContent?.trim()?.toLowerCase() || "")) {
        res[el.key] = handleInfoboxElementByType(tr.querySelector('td'), el);
      }
    })
  })
  return res;
}

export const scrapeWikiPerson =
  functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
    const page = request.query.page as string;
    const data = (await axios.get(encodeURI(page))).data;
    const doc = new JSDOM(data).window.document;
    let infoBox = doc.querySelector('div.infobox_v3');
    if (!infoBox) infoBox = doc.querySelector('table.infobox_v2');
    console.log(infoBox);
    const res: any = {};
    if (infoBox) {
      res.infoboxData = handleInfoboxData(infoBox);
    }
    const content = doc.querySelector('div.mw-parser-output');
    const childrens = content?.children as HTMLCollectionBase;
    const descriptionParts = [];
    console.log(childrens?.length);
    let firstParagraphMatch = false;
    for (let i = 0; i < childrens?.length; i++) {
      const child = childrens[i];
      if (child.tagName !== "P" && firstParagraphMatch && child.textContent?.trim() !== '') {
        break;
      }
      if (child.tagName === "P" && child.textContent?.trim() !== '') {
        descriptionParts.push(child.textContent);
        firstParagraphMatch = true;
      }
    }
    res.descriptionParts = descriptionParts;
    if (res.descriptionParts.length === 0) {
      const content = doc.querySelectorAll('div.mw-parser-output')[1];
      const childrens = content?.children as HTMLCollectionBase;
      const descriptionParts = [];
      console.log(childrens?.length);
      let firstParagraphMatch = false;
      for (let i = 0; i < childrens?.length; i++) {
        const child = childrens[i];
        if (child.tagName !== "P" && firstParagraphMatch && child.textContent?.trim() !== '') {
          break;
        }
        if (child.tagName === "P" && child.textContent?.trim() !== '') {
          descriptionParts.push(child.textContent);
          firstParagraphMatch = true;
        }
      }
      res.descriptionParts = descriptionParts;
    }
    response.send(res);
  })
  });

export const scrapeWikiStreet =
  functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
    const page = request.query.page as string;
    const data = (await axios.get(encodeURI(page))).data;
    const doc = new JSDOM(data).window.document;
    const content = doc.querySelector('div#mw-content-text')?.querySelector('div.mw-parser-output');
    const childrens = content?.children as HTMLCollectionBase;
    const history = [];
    const nameOrigin = [];
    const nameOriginLinks: {name: string, link: string}[] = [];
    let mode = null;
    for (let i = 0; i < childrens?.length; i++) {
      const child = childrens[i];
      console.log(child.textContent)
      if (mode === 'history' && child.tagName === "P") {
        history.push(child.textContent);
      }
      if (mode === 'nameOrigin' && child.tagName === "P") {
        nameOrigin.push(child.textContent);
        [...child.querySelectorAll('a')].forEach(a => nameOriginLinks.push({name: a.textContent || "", link: a.href}));
      }
      if (child.tagName === "H2") {
        console.log(child.textContent);
        if (child.textContent?.includes("Origine du nom"))
          mode = "nameOrigin";
        else if (child.textContent?.includes("Historique"))
          mode = "history";
        else
          mode = null;
      }
    }
    response.send({history, nameOrigin, nameOriginLinks});
  })
  });

  export const wikiSearch =
  functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
    const searchStr = request.query.searchStr as string;
    console.log(searchStr)
    try {
      const data = (await axios.get(`https://fr.wikipedia.org/w/api.php`, {
        params: {action: 'query', format: 'json', list: 'search', srsearch: searchStr
      }})).data;
      response.send(data);
    } catch (error) {
      console.log(searchStr)
      response.send(error);
    }
  })
  });