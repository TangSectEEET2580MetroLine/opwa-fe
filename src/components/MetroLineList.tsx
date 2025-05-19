import React from 'react';

export type Station = {
  id: string;
  name: string;
};

export type MetroLine = {
  id: string;
  name: string;
  stations: Station[];
  duration: number;
  // Add more fields as needed
};

interface Props {
  lines: MetroLine[];
}

const MetroLineList: React.FC<Props> = ({ lines }) => (
  <ul>
    {lines.map(line => (
      <li key={line.id}>{line.name}</li>
    ))}
  </ul>
);

export default MetroLineList;