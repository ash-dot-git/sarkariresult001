import React from 'react';

const TableRenderer = ({ element }) => {
  const { name, columns, rows } = element;

  if (!rows?.length || !columns?.length) return null;

  return (
    <div>
      {name && (
        <h4 className="text-xl font-semibold text-gray-800 mb-3">
          {name}
        </h4>
      )}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table
          role="table"
          className="w-full table-auto border-collapse bg-white text-sm text-gray-800"
        >
          <thead className="bg-gray-50">
            <tr role="row">
              {columns.map((col) => (
                <th
                  key={col.id}
                  scope="col"
                  role="columnheader"
                  className="px-3 py-2 text-left font-semibold text-gray-600 whitespace-nowrap"
                  style={{ whiteSpace: 'nowrap', width: '1%', maxWidth: '300px' }}
                >
                  <span className="inline-block truncate max-w-full">{col.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                role="row"
                className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                {columns.map((col) => (
                  <td
                    key={col.id}
                    role="cell"
                    className="px-3 py-2 whitespace-nowrap"
                    style={{ maxWidth: '300px' }}
                  >
                    <span className="inline-block truncate max-w-full">
                      {row[col.name]}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function TableSection({ section }) {
  const tableElements = section.elements?.filter((el) => el.type === 'table');

  if (!tableElements?.length) return null;

  const sectionId = `section-${section.title?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <section
      className="mb-10"
      aria-labelledby={sectionId}
    >
      <h3
        id={sectionId}
        className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300"
      >
        {section.title}
      </h3>
      <div className="space-y-6">
        {tableElements.map((element) => (
          <TableRenderer key={element.id} element={element} />
        ))}
      </div>
    </section>
  );
}
