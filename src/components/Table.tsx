import React from 'react';

type TableProps<T> = {
  columns: { label: string; render: (row: T) => React.ReactNode }[];
  data: T[];
};

function Table<T>({ columns, data }: TableProps<T>) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
      <thead>
        <tr style={{ background: "#f6f8fa" }}>
          {columns.map((col, i) => (
            <th key={i} style={{ textAlign: "left", padding: 8 }}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
            {columns.map((col, j) => (
              <td key={j} style={{ padding: 8 }}>{col.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;