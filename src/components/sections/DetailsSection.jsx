import { ExternalLink } from 'lucide-react';

const FieldRenderer = ({ element }) => {
  const { label, value, fieldType, key } = element;

  const renderValue = () => {
    switch (fieldType) {
      case 'date':
        return new Date(value).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
      case 'textarea':
        return <p className="text-gray-700 whitespace-pre-wrap">{value}</p>;
      case 'key_value_pair':
        return (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
            {key || 'Link'} <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        );
      default:
        return <span className="text-gray-800 font-medium">{value}</span>;
    }
  };

  return (
    <div className="py-2">
      <dt className="font-bold text-gray-800">{label}</dt>
      <dd className="mt-1 text-gray-700">{renderValue()}</dd>
    </div>
  );
};

const TableRenderer = ({ element }) => {
  const { name, columns, rows } = element;

  if (!rows || rows.length === 0 || !columns || columns.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-800 mb-3">{name}</h4>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th key={col.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map(row => (
              <tr key={row.id}>
                {columns.map(col => (
                  <td key={col.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row[col.name]}
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

export default function DetailsSection({ section }) {
  return (
    <section className="mb-10">
      <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">
        {section.title}
      </h3>
      <div className="space-y-2">
        {section.elements.map(element => {
          if (element.type === 'field') {
            return <FieldRenderer key={element.id} element={element} />;
          }
          if (element.type === 'table') {
            return <TableRenderer key={element.id} element={element} />;
          }
          return null;
        })}
      </div>
    </section>
  );
}