/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import Button from '../component/Button';
import CopyField from '../component/CopyField';
import Link from '../component/Link';
import SelectScrapWiki from '../component/SelectScrapWiki';
import { InputDesc } from '../type/Input';

export default function StreetFormWikiHelper({
  form,
  listOfPage,
  copyField,
  fetchData,
}: {
  form: InputDesc[];
  listOfPage: { key: string; displayName: string }[];
  copyField: (propName: string, value: string, source: string) => void;
  fetchData: (searchStr: string) => any;
}) {
  const [wikiResult, setWikiResult] = useState<any>(null);
  const [path, setPath] = useState<any>(null);
  const [displayIframe, setDisplayIframe] = useState(false);

  const onSearch = async (searchStr: string) => {
    const data = await fetchData(searchStr);
    setPath(searchStr);
    setWikiResult(data);
  };

  return (
    <div className="flex flex-col p-1">
      <SelectScrapWiki values={listOfPage} onSearch={onSearch} />
      {wikiResult ? (
        <>
          <Link link={`https://fr.wikipedia.org/wiki/${path}`} />
          <div className="border-slate-900 border-2">
            <Button text="Hide/Show" onClick={() => setDisplayIframe(!displayIframe)} />
            {displayIframe ? (
              <iframe
                name="viewport"
                id="inlineFrameExample"
                title="Inline Frame Example"
                width="100%"
                height="500px"
                src={`https://fr.wikipedia.org/wiki/${path}`}
              />
            ) : null}
          </div>

          <div className="[&>*]:py-2">
            {form.map((inputDesc) => (
              <CopyField
                value={wikiResult?.[inputDesc.wikiPropName || inputDesc.name]}
                onClick={(value) =>
                  copyField(inputDesc.name, value, `https://fr.wikipedia.org/wiki/${path}`)
                }
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

// {
/* <SelectScrapWiki
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
      ) : null} */
// }
