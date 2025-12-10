import React, { memo } from 'react';
import ColorMarkdownRenderer from '../ui/ColorMarkdownRenderer';
import Link from 'next/link';

export const VacancyDetailsSection = memo(({ elements = [], title = 'Sarkari Result', orgTitle }) => {
  const tables = elements?.filter((el) => el.type === 'table');
  if (!tables.length) return null;

  return (
    <section
      className="border rounded-md overflow-hidden text-sm md:text-base mb-10"
      aria-labelledby="vacancy-details-heading"
    >
      {/* Section Heading  */}
      <header className="bg-white text-center font-bold leading-tight space-y-1 p-3">
        {orgTitle && (
          <h1 className="text-red-600 text-xl md:text-2xl" style={{ fontSize: '1.25rem' }}>{orgTitle}</h1>
        )}
        <h2 id="vacancy-details-heading" className="text-red-600 text-xl md:text-2xl">
          {title || 'Vacancy Details'}
        </h2>
        <h3 className="text-[#008101] text-lg md:text-xl">Sarkari Result</h3>
        <p className="text-[#2e01ff] text-sm md:text-base">
          <Link
            href="https://newsarkariresult.co.in"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit NewSarkariResult.co.in (opens in new tab)"
          >
            NewSarkariResult.Co.In
          </Link>
        </p>
      </header>

      {/* Render All Tables */}
      {tables.map((table, tableIdx) => (
        <div
          key={table.id || tableIdx}
          className="overflow-x-auto border-t my-6"
          role="region"
          aria-labelledby={`table-heading-${tableIdx}`}
        >
          {table.name && (
            <h4
              id={`table-heading-${tableIdx}`}
              className="text-center font-extrabold text-2xl md:text-3xl text-[#008101] py-2"
            >
              <ColorMarkdownRenderer content={table.name} />
            </h4>
          )}

          <table className="table-auto w-full bg-white text-center border-collapse">
            <thead>
              <tr>
                {table.columns.map((col) => (
                  <th
                    key={col.id}
                    scope="col"
                    className="bg-[#5c0a38] text-white px-2 py-1 tracking-wide font-bold text-center text-sm md:text-base border break-words whitespace-normal max-w-[150px]"
                  >
                    <ColorMarkdownRenderer content={col.name} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="odd:bg-white even:bg-gray-50 hover:bg-[#f4ff81] transition-colors"
                >
                  {Array.isArray(row.cells)
                    ? row.cells.map((cell, idx) => (
                        <td
                          key={idx}
                          className="border px-2 py-2 text-sm md:text-base break-words"
                        >
                          <ColorMarkdownRenderer content={cell} />
                        </td>
                      ))
                    : table.columns.map((col) => (
                        <td
                          key={col.id}
                          className="border px-2 py-2 text-sm md:text-base break-words"
                        >
                          <ColorMarkdownRenderer content={row[col.id]} />
                        </td>
                      ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
});
