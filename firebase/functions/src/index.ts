import * as functions from "firebase-functions";
import axios from "axios";
import { JSDOM } from "jsdom";

const infoboxMap = [
  {
    key: "birthday",
    frPropNames: ["Date de naissance", "Naissance"],
    type: "time"
  },
  {
    key: "deathday",
    frPropNames: ["Date de Décès", "Décès"],
    type: "time"
  },
  {
    key: "nationality",
    frPropNames: ["Nationalité"],
    type: "listSplitByComma"
  },
  {
    key: "activity",
    frPropNames: ["Activités"],
    type: "listSplitByComma"
  },
  {
    key: "school",
    frPropNames: ["Formation"],
    type: "listSplitByComma"
  }
];

const handleInfoboxElementByType = (td: Element | null, infoboxData: any) => {
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
  const trList = [...infoBox.querySelectorAll('tr')];
  const res: any = {};
  trList.forEach(tr => {
    infoboxMap.forEach(el => {
      if (el.frPropNames.includes(tr.querySelector('th')?.textContent || ""))
        res[el.key] = handleInfoboxElementByType(tr.querySelector('td'), el);
    })
  })
  return res;
}

export const scrapeWikiPerson =
  functions.https.onRequest(async (request, response) => {
    const page = request.query.page as string;
    const data = (await axios.get(page)).data;
    const doc = new JSDOM(data).window.document;
    const infoBox = doc.querySelector('div.infobox_v3');
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
      if (child.tagName !== "P" && firstParagraphMatch) {
        break;
      }
      if (child.tagName === "P") {
        descriptionParts.push(child.textContent);
        firstParagraphMatch = true;
      }
    }
    res.descriptionParts = descriptionParts;
    response.send(res);
  });

export const scrapeWikiStreet =
  functions.https.onRequest(async (request, response) => {
    const page = request.query.page as string;
    const data = (await axios.get(page)).data;
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
  });