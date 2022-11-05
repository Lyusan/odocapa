/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import CopyField from '../component/CopyField';
import Link from '../component/Link';
import SelectScrapWiki from '../component/SelectScrapWiki';
import { getWikiPersonInfo, getWikiSearch, getWikiStreetInfo } from '../service/wiki.service';

export default function StreetFormWikiHelper({ streetName }: { streetName: string }) {
  const [wikiSearchResults, setWikiSearchResults] = useState<string[]>([]);
  const [wikiStreetName, setWikiStreetName] = useState<string>('');
  const [wikiPersonName, setWikiPersonName] = useState<string>('');
  const [wikiStreetResult, setWikiStreetResult] = useState<any>(null);
  const [wikiPersonResult, setWikiPersonResult] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const data = await getWikiSearch(streetName);
      setWikiSearchResults(data.query.search.map((e: any) => e.title));
      setWikiStreetName('');
      setWikiPersonName('');
      setWikiStreetResult(null);
      setWikiPersonResult(null);
    })();
  }, [streetName]);

  useEffect(() => {
    (async () => {
      if (!wikiStreetName || wikiStreetName === '') return;
      const data = await getWikiStreetInfo(wikiStreetName);
      setWikiStreetResult(data);
      setWikiPersonName('');
      setWikiPersonResult(null);
    })();
  }, [wikiStreetName]);

  useEffect(() => {
    (async () => {
      if (!wikiPersonName || wikiPersonName === '') return;
      const data = await getWikiPersonInfo(wikiPersonName);
      setWikiPersonResult(data);
    })();
  }, [wikiPersonName]);

  return (
    <div className="flex flex-col p-1">
      <h1 className="text-3xl font-bold text-center p-1 mb-5">Wikipedia helper</h1>
      <SelectScrapWiki values={wikiSearchResults} onSearch={setWikiStreetName} />
      {wikiStreetResult ? (
        <>
          <Link link={`https://fr.wikipedia.org/wiki/${wikiStreetName?.replaceAll(' ', '_')}`} />
          <div className="[&>*]:py-2">
            <CopyField value={wikiStreetResult.nameOrigin} onClick={(value) => value} />
            <CopyField value={wikiStreetResult.history} onClick={(value) => value} />
          </div>
          <SelectScrapWiki
            values={wikiStreetResult.nameOriginLinks.map((e: any) => e.name)}
            onSearch={setWikiPersonName}
          />
          {wikiPersonResult ? (
            <>
              <Link
                link={`https://fr.wikipedia.org/wiki/${wikiPersonName?.replaceAll(' ', '_')}`}
              />
              <div className="[&>*]:py-2">
                <CopyField value={wikiPersonResult.descriptionParts} onClick={(value) => value} />
                <CopyField
                  value={wikiPersonResult.infoboxData?.birthday}
                  onClick={(value) => value}
                />
                <CopyField
                  value={wikiPersonResult.infoboxData?.deathday}
                  onClick={(value) => value}
                />
                <CopyField
                  value={wikiPersonResult.infoboxData?.nationality}
                  onClick={(value) => value}
                />
                <CopyField
                  value={wikiPersonResult.infoboxData?.school}
                  onClick={(value) => value}
                />
                <CopyField
                  value={wikiPersonResult.infoboxData?.activity}
                  onClick={(value) => value}
                />
              </div>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
