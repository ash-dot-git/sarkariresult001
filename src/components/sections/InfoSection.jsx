const FieldRenderer = ({ element }) => {
    const { label, value, fieldType } = element;
  
    const renderValue = () => {
      switch (fieldType) {
        case 'date':
          return new Date(value).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
        case 'textarea':
          return <p className="text-gray-700 whitespace-pre-wrap">{value}</p>;
        default:
          return <span className="text-gray-800 font-medium">{value}</span>;
      }
    };
  
    return (
      <div className="py-3 border-b border-gray-100">
        <dt className="font-bold text-gray-800">{label}</dt>
        <dd className="mt-1 text-gray-700">{renderValue()}</dd>
      </div>
    );
  };

  export default function InfoSection({ section }) {
    const infoElements = section.elements.filter(
        (element) => element.type === 'field' && element.fieldType !== 'key_value_pair'
      );
    
      if (infoElements.length === 0) {
        return null;
      }

    return (
      <section className="mb-10">
        {/* <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">
          {section.title}
        </h3> */}
        <dl className="space-y-2">
        {infoElements.map((element) => (
            <FieldRenderer key={element.id} element={element} />
          ))}
        </dl>
      </section>
    );
  }