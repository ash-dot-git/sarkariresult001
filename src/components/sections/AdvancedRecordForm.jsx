'use client';

import { useState, useRef } from 'react';
import { ChevronDown, Plus, Trash2, GripVertical, Upload } from 'lucide-react';
import suggestionsData from '@/data/suggestions.json';
import AutoCompleteInput from '@/components/ui/AutocompleteInput';

// --- UTILITY FUNCTIONS ---

/**
 * Generates a unique ID string for new elements to use as a React key.
 * Combines timestamp and a random string for uniqueness.
 */
const generateUniqueId = () => 'id_' + Date.now().toString(36).slice(-3) + Math.random().toString(36).slice(-2);

// Pre-process suggestion data for efficient lookups
const sectionSuggestions = suggestionsData.sections.map(s => s.title); // Array of section titles for autocomplete
const sectionMap = new Map(suggestionsData.sections.map(s => [s.title, s])); // Map for quick access to section data by title

/**
 * Retrieves field label suggestions for a given section title.
 * @param {string} sectionTitle - The title of the section.
 * @returns {string[]} An array of field label suggestions.
 */
const getFieldSuggestionsForSection = (sectionTitle) => {
  const section = sectionMap.get(sectionTitle);
  return section ? section.fields.map(f => f.label) : [];
};

/**
 * Retrieves the full details (name, placeholder, type) for a field based on its label and section.
 * @param {string} sectionTitle - The title of the section.
 * @param {string} fieldLabel - The display label of the field.
 * @returns {object|null} The field details object or null if not found.
 */
const getFieldDetails = (sectionTitle, fieldLabel) => {
  const section = sectionMap.get(sectionTitle);
  if (!section) return null;
  return section.fields.find(f => f.label === fieldLabel);
};


// --- REUSABLE & STYLED COMPONENTS ---

/**
 * A simple styled textarea component for consistent styling.
 */
const StyledTextarea = (props) => (
  <textarea
    {...props}
    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
  />
);

// --- DYNAMIC TABLE COMPONENTS ---

/**
 * A component for creating and managing a dynamic table with editable columns and rows.
 * @param {object} props - Component props.
 * @param {object} props.table - The table data object (name, columns, rows).
 * @param {function} props.onUpdate - Callback to update the table's state in the parent.
 * @param {function} props.onRemove - Callback to remove the entire table.
 */
const DynamicTable = ({ table, onUpdate, onRemove }) => {
  const fileInputRef = useRef(null); // Ref to access the hidden file input for CSV import.

  // --- Column Handlers ---
  const updateColumnName = (index, name) => {
    const newColumns = [...table.columns];
    newColumns[index].name = name;
    onUpdate({ ...table, columns: newColumns });
  };

  const addColumn = () => onUpdate({ ...table, columns: [...table.columns, { id: generateUniqueId(), name: `Column ${table.columns.length + 1}` }] });
  const removeColumn = (index) => {
    const newColumns = table.columns.filter((_, i) => i !== index);
    // Also remove the corresponding cell from each row
    const newRows = table.rows.map(row => ({ ...row, cells: row.cells.filter((_, cellIndex) => cellIndex !== index) }));
    onUpdate({ ...table, columns: newColumns, rows: newRows });
  };

  // --- Row Handlers ---
  const addRow = () => onUpdate({ ...table, rows: [...table.rows, { id: generateUniqueId(), cells: table.columns.map(() => '') }] });
  const updateRow = (rowIndex, cellIndex, value) => {
    const newRows = [...table.rows];
    const newCells = [...newRows[rowIndex].cells];
    newCells[cellIndex] = value;
    newRows[rowIndex] = { ...newRows[rowIndex], cells: newCells };
    onUpdate({ ...table, rows: newRows });
  };
  const removeRow = (index) => onUpdate({ ...table, rows: table.rows.filter((_, i) => i !== index) });

  /**
   * Handles importing data from a CSV file.
   * Parses the CSV text to create headers and rows for the table.
   * @param {Event} event - The file input change event.
   */
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      if (lines.length === 0) return;
      // First line becomes headers (columns)
      const headers = lines[0].split(',').map(h => ({ id: generateUniqueId(), name: h.trim() }));
      // Subsequent lines become rows
      const importedRows = lines.slice(1).map(line => ({ id: generateUniqueId(), cells: line.split(',').map(cell => cell.trim()) }));
      onUpdate({ ...table, columns: headers, rows: importedRows });
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50/50">
      <div className="flex justify-between items-center mb-4">
        <AutoCompleteInput type="text" placeholder="Table Name" value={table.name} onChange={(e) => onUpdate({ ...table, name: e.target.value })} className="text-lg font-semibold !border-blue-300" suggestions={[]} />
        <div className="flex items-center gap-2">
          <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileImport} />
          <button type="button" onClick={() => fileInputRef.current.click()} className="flex items-center bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600"><Upload size={16} className="mr-2" /> Import CSV</button>
          <button type="button" onClick={onRemove} className="p-2 text-red-500 hover:text-red-700" aria-label="Delete file"><Trash2 aria-hidden="true" /></button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {table.columns.map((col, index) => (
                <th key={col.id} className="p-1 border border-gray-300 bg-gray-100">
                  <div className="flex items-center gap-1">
                    <AutoCompleteInput value={col.name} onChange={(e) => updateColumnName(index, e.target.value)} suggestions={[]} />
                    <button type="button" onClick={() => removeColumn(index)} className="p-1 text-red-600 hover:text-red-600" aria-label={`Remove column ${index + 1}`}><Trash2 size={16} aria-hidden="true"/></button>
                  </div>
                </th>
              ))}
              <th className="p-1 border border-gray-300 bg-gray-100 w-20">Action</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={row.id}>
                {row.cells.map((cell, cellIndex) => (
                  <td key={cellIndex} className="p-1 border border-gray-200">
                    <AutoCompleteInput type="text" value={cell} onChange={(e) => updateRow(rowIndex, cellIndex, e.target.value)} suggestions={[]} />
                  </td>
                ))}
                <td className="p-1 border border-gray-200 text-center">
                  <button type="button" onClick={() => removeRow(rowIndex)} className="p-2 text-red-500 hover:text-red-700" aria-label={`Delete row ${rowIndex + 1}`}><Trash2 size={18} aria-hidden="true"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-4 mt-4">
        <button type="button" onClick={addColumn} className="flex items-center text-blue-600 font-semibold"><Plus className="mr-2" aria-hidden="true"/> Add Column</button>
        <button type="button" onClick={addRow} className="flex items-center text-[#008101] font-semibold"><Plus className="mr-2" aria-hidden="true"/> Add Row</button>
      </div>
    </div>
  );
};

// --- FORM FIELD COMPONENT ---

/**
 * Represents a single field (e.g., text input, date, key-value pair) within a section.
 * @param {object} props - Component props.
 * @param {object} props.field - The field data object.
 * @param {function} props.onUpdate - Callback to update the field's state.
 * @param {function} props.onRemove - Callback to remove the field.
 * @param {string} props.sectionTitle - The title of the parent section, used for fetching suggestions.
 */
const FormField = ({ field, onUpdate, onRemove, sectionTitle }) => {
  /**
   * When the field label changes, this function also attempts to fetch
   * associated details (like placeholder, machine-readable name, and type)
   * from the suggestions data.
   */
  const handleLabelChange = (e) => {
    const newLabel = e.target.value;
    const fieldDetails = getFieldDetails(sectionTitle, newLabel);
    onUpdate({
      ...field,
      label: newLabel,
      placeholder: fieldDetails?.placeholder || '',
      name: fieldDetails?.name || '', // Store the machine-readable name for the final payload
      fieldType: fieldDetails?.type || field.fieldType, // Update field type if suggestion has one
    });
  };

  /**
   * Renders the appropriate input control based on the field's `fieldType`.
   */
  const renderValueInput = () => {
    const placeholder = field.placeholder || `Enter ${field.label}`;
    switch (field.fieldType) {
      case 'textarea':
        return <StyledTextarea placeholder={placeholder} value={field.value} onChange={(e) => onUpdate({ ...field, value: e.target.value })} />;
      case 'date':
        return <AutoCompleteInput type="date" placeholder={placeholder} value={field.value} onChange={(e) => onUpdate({ ...field, value: e.target.value })} suggestions={[]} />;
      case 'key_value_pair':
        return (
          <div className="flex-grow flex gap-4">
            <AutoCompleteInput placeholder="Key" value={field.key || ''} onChange={(e) => onUpdate({ ...field, key: e.target.value })} suggestions={[]} />
            <AutoCompleteInput placeholder="Value (URL)" value={field.value || ''} onChange={(e) => onUpdate({ ...field, value: e.target.value })} suggestions={[]} />
          </div>
        );
      default: // 'text'
        return <AutoCompleteInput placeholder={placeholder} value={field.value} onChange={(e) => onUpdate({ ...field, value: e.target.value })} suggestions={[]} />;
    }
  };

  return (
    <div className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50">
      <GripVertical className="cursor-move text-gray-400"  aria-hidden="true" />
      <div className="w-1/3">
        <AutoCompleteInput placeholder="Field Label" value={field.label} onChange={handleLabelChange} suggestions={getFieldSuggestionsForSection(sectionTitle)} />
      </div>
      {renderValueInput()}
      <select value={field.fieldType} onChange={(e) => onUpdate({ ...field, fieldType: e.target.value, value: '', key: '' })} className="p-2 border border-gray-300 rounded-md shadow-sm">
        <option value="text">Text</option>
        <option value="textarea">Textarea</option>
        <option value="date">Date</option>
        <option value="key_value_pair">Key-Value Pair</option>
      </select>
      <button type="button" onClick={onRemove} className="p-2 text-red-500 hover:text-red-700" aria-label="Delete field"><Trash2 aria-hidden="true"/></button>
    </div>
  );
};

// --- FORM SECTION COMPONENT ---

/**
 * A collapsible section of the form that contains a list of elements (fields or tables).
 * @param {object} props - Component props.
 * @param {object} props.section - The section data object (title, elements).
 * @param {function} props.onUpdate - Callback to update the section's state.
 * @param {function} props.onRemove - Callback to remove the section.
 */
const FormSection = ({ section, onUpdate, onRemove }) => {
  const [isOpen, setIsOpen] = useState(true); // State to manage the collapsible (accordion) behavior.

  // --- Element Handlers (for fields and tables within the section) ---
  const updateElement = (index, updatedElement) => {
    const newElements = [...section.elements];
    newElements[index] = updatedElement;
    onUpdate({ ...section, elements: newElements });
  };

  const addElement = (type) => {
    const newElement = type === 'field'
      ? { id: generateUniqueId(), type: 'field', label: '', value: '', fieldType: 'text', name: '' }
      : { id: generateUniqueId(), type: 'table', name: 'New Table', columns: [{ id: generateUniqueId(), name: 'Column 1' }], rows: [] };
    onUpdate({ ...section, elements: [...section.elements, newElement] });
  };

  const removeElement = (index) => onUpdate({ ...section, elements: section.elements.filter((_, i) => i !== index) });

  return (
    <div className="mb-6 border-2 border-gray-300 rounded-xl shadow-lg">
      <header className="flex justify-between items-center p-3 bg-gray-100 rounded-t-lg cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <AutoCompleteInput placeholder="Section Title" value={section.title} onChange={(e) => onUpdate({ ...section, title: e.target.value })} className="text-xl font-bold !border-gray-300" suggestions={sectionSuggestions} onClick={(e) => e.stopPropagation()} />
        <div className="flex items-center gap-2">
          <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-2 text-red-500 hover:text-red-700" aria-label="Delete section"><Trash2 aria-hidden="true"/></button>
          <ChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}  aria-hidden="true"/>
        </div>
      </header>
      {isOpen && (
        <div className="p-4 space-y-4">
          {section.elements.map((element, index) => {
            // Dynamically render either a FormField or a DynamicTable based on the element's type.
            const Component = element.type === 'field' ? FormField : DynamicTable;
            // Pass the element data as a prop named either 'field' or 'table'.
            return <Component key={element.id} {...{ [element.type]: element }} onUpdate={(updated) => updateElement(index, updated)} onRemove={() => removeElement(index)} sectionTitle={section.title} />;
          })}
          <div className="flex justify-center gap-4 pt-4 border-t-2 border-dashed">
            <button type="button" onClick={() => addElement('field')} className="flex items-center py-2 px-4 border-2 border-dashed rounded-lg text-gray-600 hover:bg-gray-50"><Plus className="mr-2" aria-hidden="true" /> Add Field</button>
            <button type="button" onClick={() => addElement('table')} className="flex items-center py-2 px-4 border-2 border-dashed rounded-lg text-blue-600 hover:bg-blue-50"><Plus className="mr-2" aria-hidden="true" /> Add Table</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN FORM BUILDER ---

/**
 * The main component that orchestrates the entire form.
 * It manages the state of all sections and handles the final data submission.
 * @param {object} props - Component props.
 * @param {function} props.onSubmit - The callback function to execute with the transformed form data.
 * @param {object} [props.initialData] - Optional initial data to populate the form.
 */
export default function AdvancedRecordForm({ onSubmit, initialData }) {
  // State for the entire form structure, initialized with initialData or a default empty section.
  const [sections, setSections] = useState(initialData?.sections || [{ id: generateUniqueId(), title: '', elements: [] }]);

  // --- Section Handlers ---
  const updateSection = (index, updatedSection) => {
    const newSections = [...sections];
    newSections[index] = updatedSection;
    setSections(newSections);
  };

  const addSection = () => setSections([...sections, { id: generateUniqueId(), title: '', elements: [] }]);
  const removeSection = (index) => setSections(sections.filter((_, i) => i !== index));

  /**
   * Handles the form submission.
   * It transforms the UI state (sections, elements) into a structured JSON payload
   * that is ready to be sent to an API.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {}; // The final object to be submitted.

    sections.forEach(section => {
      const sectionData = {};
      // Get the machine-readable ID for the section from our suggestions map.
      const sectionDetails = sectionMap.get(section.title);
      const sectionId = sectionDetails ? sectionDetails.id : section.title; // Fallback to title if not found.

      section.elements.forEach(el => {
        if (el.type === 'field') {
          // Use the stored machine-readable 'name' as the key, not the user-facing 'label'.
          if (el.name) {
            sectionData[el.name] = el.value || '';
          }
        } else if (el.type === 'table') {
          // Process table data into an array of objects.
          if (el.name) {
            sectionData[el.name] = el.rows.map(row => {
              const rowObj = {};
              el.columns.forEach((col, i) => {
                // Use column name as the key for each cell in the row object.
                if (col.name) {
                  rowObj[col.name] = row.cells[i] || '';
                }
              });
              return rowObj;
            });
          }
        }
      });

      // Only add the section to the payload if it contains data.
      if (Object.keys(sectionData).length > 0) {
        payload[sectionId] = sectionData;
      }
    });

    console.log("Final Transformed Payload:", payload);
    onSubmit(payload); // Pass the clean payload to the parent component.
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Advanced Form Builder</h2>
      <form onSubmit={handleSubmit}>
        {sections.map((section, index) => <FormSection key={section.id} section={section} onUpdate={(updated) => updateSection(index, updated)} onRemove={() => removeSection(index)} />)}
        <button type="button" onClick={addSection} className="flex items-center justify-center w-full mt-6 py-3 px-6 border-2 border-dashed border-purple-400 rounded-lg text-purple-600 font-semibold hover:bg-purple-50"><Plus className="mr-2"  aria-hidden="true"/> Add New Section</button>
        <button type="submit" className="w-full mt-8 bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-700 transition-transform transform hover:scale-105">Save Record</button>
      </form>
    </div>
  );
}