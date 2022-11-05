import React from 'react';

interface LinkProp {
  text?: string;
  link: string;
}

const defaultProps = {
  text: null,
};

export default function Link({ text, link }: LinkProp) {
  return (
    <a className="text-blue-500" href={link} target="_blank" rel="noopener noreferrer">
      {text || link}
    </a>
  );
}

Link.defaultProps = defaultProps;
