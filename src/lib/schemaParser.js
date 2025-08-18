// This utility will parse the text-based schema into a structured object.
export function parseSchema(schemaText) {
  const lines = schemaText.split('\n').filter(line => line.trim() !== '' && !line.startsWith('details schema'));
  const schema = {};
  let currentField = null;
  let currentSubField = null;

  lines.forEach(line => {
    const trimmedLine = line.trim();
    const isSubField = trimmedLine.startsWith('* ');
    const isSubSubField = trimmedLine.startsWith('   * ');

    if (isSubField) {
      const [fieldName, fieldType] = trimmedLine.substring(2).split(':').map(s => s.trim());
      currentField = fieldName.replace(/ /g, '_');
      schema[currentField] = { type: fieldType || 'text' };
      currentSubField = null; // Reset subfield context
    } else if (isSubSubField && currentField) {
      const [subFieldName, subFieldType] = trimmedLine.substring(5).split(':').map(s => s.trim());
      if (!schema[currentField].properties) {
        schema[currentField].properties = {};
      }
      schema[currentField].properties[subFieldName.replace(/ /g, '_')] = { type: subFieldType || 'text' };
    }
  });

  return schema;
}