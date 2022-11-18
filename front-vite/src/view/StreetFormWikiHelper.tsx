/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import CopyField from '../component/CopyField';
import Link from '../component/Link';
import SelectScrapWiki from '../component/SelectScrapWiki';
import { getWikiPersonInfo, getWikiSearch, getWikiStreetInfo } from '../service/wiki.service';

export default function StreetFormWikiHelper({
  streetName,
  copyField,
}: {
  streetName: string;
  copyField: (type: 'main' | 'sub', propName: string, value: string, source: string) => void;
}) {
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
            <CopyField
              value={wikiStreetResult.nameOrigin}
              onClick={(value) =>
                copyField(
                  'main',
                  'nameOrigin',
                  value,
                  `https://fr.wikipedia.org/wiki/${wikiStreetName?.replaceAll(' ', '_')}`,
                )
              }
            />
            <CopyField
              value={wikiStreetResult.history}
              onClick={(value) =>
                copyField(
                  'main',
                  'nameDescription',
                  value,
                  `https://fr.wikipedia.org/wiki/${wikiStreetName?.replaceAll(' ', '_')}`,
                )
              }
            />
            <CopyField
              value={wikiStreetResult.infoBoxData.creationDate}
              onClick={(value) =>
                copyField(
                  'main',
                  'creationDate',
                  value,
                  `https://fr.wikipedia.org/wiki/${wikiStreetName?.replaceAll(' ', '_')}`,
                )
              }
            />
            <CopyField
              value={wikiStreetResult.infoBoxData.namingDate}
              onClick={(value) =>
                copyField(
                  'main',
                  'namingDate',
                  value,
                  `https://fr.wikipedia.org/wiki/${wikiStreetName?.replaceAll(' ', '_')}`,
                )
              }
            />
            <CopyField
              value={wikiStreetResult.infoBoxData.length}
              onClick={(value) =>
                copyField(
                  'main',
                  'length',
                  value,
                  `https://fr.wikipedia.org/wiki/${wikiStreetName?.replaceAll(' ', '_')}`,
                )
              }
            />
            <CopyField
              value={wikiStreetResult.infoBoxData.width}
              onClick={(value) =>
                copyField(
                  'main',
                  'width',
                  value,
                  `https://fr.wikipedia.org/wiki/${wikiStreetName?.replaceAll(' ', '_')}`,
                )
              }
            />
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
                <CopyField
                  value={wikiPersonResult.descriptionParts}
                  onClick={(value) =>
                    copyField(
                      'sub',
                      'description',
                      value,
                      `https://fr.wikipedia.org/wiki/${wikiPersonName?.replaceAll(' ', '_')}`,
                    )
                  }
                />
                <CopyField
                  value={wikiPersonResult.infoboxData?.birthday}
                  onClick={(value) =>
                    copyField(
                      'sub',
                      'birthday',
                      value,
                      `https://fr.wikipedia.org/wiki/${wikiPersonName?.replaceAll(' ', '_')}`,
                    )
                  }
                />
                <CopyField
                  value={wikiPersonResult.infoboxData?.deathday}
                  onClick={(value) =>
                    copyField(
                      'sub',
                      'deathday',
                      value,
                      `https://fr.wikipedia.org/wiki/${wikiPersonName?.replaceAll(' ', '_')}`,
                    )
                  }
                />
                <CopyField
                  value={wikiPersonResult.infoboxData?.nationality}
                  onClick={(value) =>
                    copyField(
                      'sub',
                      'nationality',
                      value,
                      `https://fr.wikipedia.org/wiki/${wikiPersonName?.replaceAll(' ', '_')}`,
                    )
                  }
                />
                <CopyField
                  value={wikiPersonResult.infoboxData?.school}
                  onClick={(value) => value}
                />
                <CopyField
                  value={wikiPersonResult.infoboxData?.activity}
                  onClick={(value) =>
                    copyField(
                      'sub',
                      'activity',
                      value,
                      `https://fr.wikipedia.org/wiki/${wikiPersonName?.replaceAll(' ', '_')}`,
                    )
                  }
                />
              </div>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
