'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Trash2, GripVertical, Upload, Star, Edit } from 'lucide-react';
import suggestionsData from '@/data/suggestions.json';
import AutoCompleteInput from '../ui/AutocompleteInput';
import MultiSelectAutocomplete from '../ui/MultiSelectAutocomplete';
import {
  examTypeOptions,
  applicableStatesOptions,
  minimumQualificationOptions,
  otherTagsOptions,
} from '@/data/filters';

// --- UTILITY FUNCTIONS ---

const generateUniqueId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const createLabelKeyMaps = (options) => {
  const labelToKey = new Map(options.map(opt => [opt.label, opt.key]));
  const keyToLabel = new Map(options.map(opt => [opt.key, opt.label]));
  return { labelToKey, keyToLabel };
};

const examTypeMaps = createLabelKeyMaps(examTypeOptions);
const applicableStatesMaps = createLabelKeyMaps(applicableStatesOptions);
const minimumQualificationMaps = createLabelKeyMaps(minimumQualificationOptions);
const otherTagsMaps = createLabelKeyMaps(otherTagsOptions);

const sectionSuggestions = suggestionsData.sections.map(s => s.title);
const sectionMap = new Map(suggestionsData.sections.map(s => [s.title, s]));

const getFieldSuggestionsForSection = (sectionTitle) => {
  const section = sectionMap.get(sectionTitle);
  return section ? section.fields.map(f => f.label) : [];
};

const getFieldDetails = (sectionTitle, fieldLabel) => {
  const section = sectionMap.get(sectionTitle);
  if (!section) return null;
  return section.fields.find(f => f.label === fieldLabel);
};

// --- SCHEMA GENERATION ---
// --- CUSTOM HOOKS ---

const useAutocomplete = (key) => {
  const getSuggestions = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return [];
    }
  };

  const addSuggestion = (value) => {
    if (!value || value.trim() === '') return;
    try {
      const suggestions = getSuggestions();
      const lowercasedValue = value.toLowerCase();
      if (!suggestions.some(s => s.toLowerCase() === lowercasedValue)) {
        const newSuggestions = [value, ...suggestions].slice(0, 5); // Keep last 5
        localStorage.setItem(key, JSON.stringify(newSuggestions));
      }
    } catch (error) {
      console.error(`Error writing to localStorage key “${key}”:`, error);
    }
  };

  return { getSuggestions, addSuggestion };
};


// --- REUSABLE & STYLED COMPONENTS ---

const StyledTextarea = (props) => (
  <textarea
    {...props}
    className="max-w-full w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize"
  />
);



// --- DYNAMIC TABLE COMPONENTS ---

const EditableCell = ({ value, onChange, onFocus, onBlur, onKeyDown, isExpanded, placeholder, id }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const baseClasses = "w-full p-1 border border-transparent rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-transparent";
  const sizeClasses = isExpanded ? "min-h-[8rem] z-10" : "h-10"; // Give more vertical space when expanded
  const resizeClass = isExpanded ? "resize" : "resize-none"; // Allow manual resize only when expanded

  return (
    <textarea
      id={id}
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={1}
      className={`${baseClasses} ${sizeClasses} ${resizeClass}`}
    />
  );
};

const DynamicTable = ({ table, onUpdate, onRemove }) => {
  const fileInputRef = useRef(null);
  const [activeCell, setActiveCell] = useState(null); // e.g., { type: 'col', index: 0 } or { type: 'cell', rowIndex: 0, colIndex: 0 }

  const updateColumnName = (index, name) => {
    const newColumns = [...table.columns];
    newColumns[index].name = name;
    onUpdate({ ...table, columns: newColumns });
  };

  const addColumn = () => {
    const newColumns = [...table.columns, { id: generateUniqueId(), name: `Column ${table.columns.length + 1}` }];
    const newRows = table.rows.map(row => ({
      ...row,
      cells: [...(row.cells || []), '']
    }));
    onUpdate({ ...table, columns: newColumns, rows: newRows });
  };

  const removeColumn = (index) => {
    const newColumns = table.columns.filter((_, i) => i !== index);
    const newRows = table.rows.map(row => ({ ...row, cells: row.cells.filter((_, cellIndex) => cellIndex !== index) }));
    onUpdate({ ...table, columns: newColumns, rows: newRows });
  };

  const addRow = () => onUpdate({ ...table, rows: [...table.rows, { id: generateUniqueId(), cells: table.columns.map(() => '') }] });

  const updateRow = (rowIndex, cellIndex, value) => {
    const newRows = [...table.rows];
    const newCells = [...newRows[rowIndex].cells];
    newCells[cellIndex] = value;
    newRows[rowIndex] = { ...newRows[rowIndex], cells: newCells };
    onUpdate({ ...table, rows: newRows });
  };

  const removeRow = (index) => onUpdate({ ...table, rows: table.rows.filter((_, i) => i !== index) });

  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(data, { type: 'array' });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // array of arrays

      if (json.length === 0) return;

      const headers = json[0].map((h) => ({
        id: generateUniqueId(),
        name: h?.toString()?.trim() || '',
      }));

      const importedRows = json.slice(1).map((row) => ({
        id: generateUniqueId(),
        cells: headers.map((_, i) => row[i]?.toString()?.trim() || ''),
      }));

      onUpdate({ ...table, columns: headers, rows: importedRows });
    };

    reader.readAsArrayBuffer(file); // Important: use ArrayBuffer for binary Excel files
  };

  const handleKeyDown = (e, type, rowIndex, colIndex) => {
    let nextElementId = null;
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (type === 'cell' && rowIndex > 0) nextElementId = `cell-${rowIndex - 1}-${colIndex}`;
        else if (type === 'cell' && rowIndex === 0) nextElementId = `col-${colIndex}`;
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (type === 'col') nextElementId = `cell-0-${colIndex}`;
        else if (type === 'cell' && rowIndex < table.rows.length - 1) nextElementId = `cell-${rowIndex + 1}-${colIndex}`;
        break;
      case 'ArrowLeft':
        if (e.target.selectionStart === 0) {
          e.preventDefault();
          if (colIndex > 0) nextElementId = `${type}-${rowIndex}-${colIndex - 1}`;
        }
        break;
      case 'ArrowRight':
        if (e.target.selectionEnd === e.target.value.length) {
          e.preventDefault();
          if (colIndex < table.columns.length - 1) nextElementId = `${type}-${rowIndex}-${colIndex + 1}`;
        }
        break;
      default:
        break;
    }
    if (nextElementId) {
      document.getElementById(nextElementId)?.focus();
    }
  };

  return (
    <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50/50">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex-grow min-w-[200px]">
          <StyledTextarea
            placeholder="Table Name"
            value={table.name}
            onChange={(e) => onUpdate({ ...table, name: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <input type="file" ref={fileInputRef} className="hidden" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleFileImport} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 text-sm sm:text-base"><Upload size={16} className="mr-2" aria-hidden="true"/> <span>Import Excel/CSV</span></button>
          <button type="button" onClick={onRemove} className="p-2 text-red-500 hover:text-red-700"  aria-label="Delete file"><Trash2 aria-hidden="true"/></button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {table.columns.map((col, index) => {
                const isActive = activeCell?.type === 'col' && activeCell?.index === index;
                return (
                  <th key={col.id} className={`p-1 border border-gray-300 bg-gray-100 transition-all duration-300 ${isActive ? 'w-2/5' : 'w-auto'}`}>
                    <div className="flex items-center gap-1">
                      <EditableCell
                        id={`col-${index}`}
                        value={col.name}
                        onChange={(e) => updateColumnName(index, e.target.value)}
                        onFocus={() => setActiveCell({ type: 'col', index })}
                        onBlur={() => setActiveCell(null)}
                        onKeyDown={(e) => handleKeyDown(e, 'col', -1, index)}
                        isExpanded={isActive}
                        placeholder="Column Name"
                      />
                      <button type="button" onClick={() => {
                        const confirmed = window.confirm("Are you sure you want to delete this column?");
                        if (confirmed) removeColumn(index);
                      }} className="p-1 text-red-600 hover:text-red-600" aria-label={`Delete column ${index+1}`}><Trash2 size={16} aria-hidden="true" /></button>
                    </div>
                  </th>
                );
              })}
              <th className="p-1 border border-gray-300 bg-gray-100 w-20">Action</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={row.id}>
                {(row.cells || []).map((cell, cellIndex) => {
                  const isActive = activeCell?.type === 'cell' && activeCell?.rowIndex === rowIndex && activeCell?.colIndex === cellIndex;
                  return (
                    <td key={cellIndex} className={`p-1 border border-gray-200 transition-all duration-300 ${isActive ? 'w-2/5' : 'w-auto'}`}>
                      <EditableCell
                        id={`cell-${rowIndex}-${cellIndex}`}
                        value={cell}
                        onChange={(e) => updateRow(rowIndex, cellIndex, e.target.value)}
                        onFocus={() => setActiveCell({ type: 'cell', rowIndex, colIndex: cellIndex })}
                        onBlur={() => setActiveCell(null)}
                        onKeyDown={(e) => handleKeyDown(e, 'cell', rowIndex, cellIndex)}
                        isExpanded={isActive}
                        placeholder="Enter value"
                      />
                    </td>
                  );
                })}
                <td className="p-1 border border-gray-200 text-center">
                  <button type="button" onClick={() => {
                    const confirmed = window.confirm("Are you sure you want to delete this column?");
                    if (confirmed) removeRow(rowIndex);
                  }} className="p-2 text-red-500 hover:text-red-700"  aria-label={`Delete row ${rowIndex+1}`}><Trash2 size={18} aria-hidden="true" /></button>
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

const FormField = ({ field, onUpdate, onRemove, sectionTitle, suggestions }) => {
  const { getSuggestions, addSuggestion } = useAutocomplete(field.name);
  const handleValueChange = (newValue) => {
    onUpdate({ ...field, value: newValue });
  };

  const handleBlur = (e) => {
    addSuggestion(e.target.value);
  };

  const handleLabelChange = (e) => {
    const newLabel = e.target.value;
    const fieldDetails = getFieldDetails(sectionTitle, newLabel);

    if (fieldDetails) {
      const updatedField = {
        ...field,
        label: newLabel,
        placeholder: fieldDetails.placeholder || '',
        name: fieldDetails.name || '',
        fieldType: fieldDetails.type || 'textarea',
        value: fieldDetails.value !== undefined ? fieldDetails.value : field.value,
      };
      onUpdate(updatedField);
    } else {
      onUpdate({
        ...field,
        label: newLabel,
        name: newLabel.toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_|_$/g, ''),
      });
    }
  };

  const renderValueInput = () => {
    const placeholder = field.placeholder || `Enter ${field.label}`;
    const valueSuggestions = field.name ? getSuggestions() : [];

    switch (field.fieldType) {
      case 'textarea':
        return <StyledTextarea placeholder={placeholder} value={field.value} onChange={(e) => handleValueChange(e.target.value)} onBlur={handleBlur} />;
      case 'date':
        return <AutoCompleteInput type="date" placeholder={placeholder} value={field.value} onChange={(e) => handleValueChange(e.target.value)} onBlur={handleBlur} suggestions={valueSuggestions} />;
      case 'key_value_pair':
        return (
          <div className="flex gap-4">
            <AutoCompleteInput placeholder="Key" value={field.key || ''} onChange={(e) => onUpdate({ ...field, key: e.target.value })} suggestions={[]} />
            <AutoCompleteInput placeholder="Value (URL)" value={field.value || ''} onChange={(e) => handleValueChange(e.target.value)} onBlur={handleBlur} suggestions={valueSuggestions} />
          </div>
        );
      default: // 'text'
        return <AutoCompleteInput placeholder={placeholder} value={field.value} onChange={(e) => handleValueChange(e.target.value)} onBlur={handleBlur} suggestions={valueSuggestions} />;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border rounded-lg bg-gray-50">
      {/* <GripVertical className="cursor-move text-gray-400" /> */}
      <div className="w-1/4">
        <AutoCompleteInput placeholder="Field Label" value={field.label} onChange={handleLabelChange} suggestions={suggestions} />
      </div>
      <div className="flex-grow min-w-0">
  <div className="w-full">
    {renderValueInput()}
  </div>
</div>
      <div>
      <select value={field.fieldType} onChange={(e) => onUpdate({ ...field, fieldType: e.target.value, value: '', key: '' })} 
        className="max-w-[120px] w-full md:w-auto flex-shrink p-2 border border-gray-300 rounded-md shadow-sm overflow-hidden text-ellipsis">
        <option value="text">Text</option>
        <option value="textarea">Textarea</option>
        <option value="date">Date</option>
        <option value="key_value_pair">Key-Value Pair</option>
      </select>
      <button type="button" onClick={onRemove} className="p-2 text-red-500 hover:text-red-700"><Trash2 /></button>
      </div>
    </div>
  );
};

// --- FORM SECTION COMPONENT ---

const FormSection = ({ section, onUpdate, onRemove, onSaveDraft, availableSectionSuggestions }) => {
  const [isOpen, setIsOpen] = useState(true);
  const updateElement = (index, updatedElement) => {
    const newElements = [...section.elements];
    newElements[index] = updatedElement;
    onUpdate({ ...section, elements: newElements });
  };

  const addElement = (type) => {
    const newElement = type === 'field'
      ? {
        id: generateUniqueId(),
        type: 'field',
        label: '',
        value: '',
        fieldType: 'text',
        name: '',
      }
      : { id: generateUniqueId(), type: 'table', name: 'New Table', columns: [{ id: generateUniqueId(), name: 'Column 1' }], rows: [] };
    onUpdate({ ...section, elements: [...section.elements, newElement] });
  };

  const removeElement = (index) => onUpdate({ ...section, elements: section.elements.filter((_, i) => i !== index) });

  return (
    <div className="mb-6 border-2 border-gray-300 rounded-xl shadow-lg relative">
      <header className="flex justify-between items-center p-3 bg-gray-100 rounded-t-lg cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div onClick={(e) => e.stopPropagation()} className="flex-grow">
          <AutoCompleteInput
            placeholder="Section Title"
            value={section.title}
            onChange={(e) => onUpdate({ ...section, title: e.target.value })}
            className="text-xl font-bold !border-gray-300 w-full"
            suggestions={availableSectionSuggestions}
          />
        </div>
        <div className="flex items-center gap-2 ml-4">
          {!isOpen && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSaveDraft(); }}
              className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 text-sm"
              aria-label="Save changes to draft"
            >
              Save Changes
            </button>
          )}
          <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-2 text-red-600 hover:text-red-600"><Trash2 /></button>
          <ChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </header>
      {isOpen && (
        <>
          <div className="p-4 space-y-4">
            {section.elements.map((element, index) => {
              if (element.type === 'field') {
                const allSuggestions = getFieldSuggestionsForSection(section.title);
                const usedLabels = section.elements
                  .filter(el => el.type === 'field' && el.id !== element.id)
                  .map(el => el.label);
                const availableSuggestions = allSuggestions.filter(s => !usedLabels.includes(s));
                return <FormField key={element.id} field={element} onUpdate={(updated) => updateElement(index, updated)} onRemove={() => {
                  const confirmed = window.confirm("Are you sure you want to delete this column?");
                  if (confirmed) removeElement(index);
                }} sectionTitle={section.title} suggestions={availableSuggestions} />;
              }
              if (element.type === 'table') {
                return <DynamicTable key={element.id} table={element} onUpdate={(updated) => updateElement(index, updated)} onRemove={() => {
                  const confirmed = window.confirm("Are you sure you want to delete this column?");
                  if (confirmed) removeElement(index);
                }} />;
              }
              return null;
            })}
            <div className="flex justify-center gap-4 pt-4 border-t-2 border-dashed">
              <button type="button" onClick={() => addElement('field')} className="flex items-center py-2 px-4 border-2 border-dashed rounded-lg text-gray-600 hover:bg-gray-50"><Plus className="mr-2" aria-hidden="true"/> Add Field</button>
              <button type="button" onClick={() => addElement('table')} className="flex items-center py-2 px-4 border-2 border-dashed rounded-lg text-blue-600 hover:bg-blue-50"><Plus className="mr-2" aria-hidden="true"/> Add Table</button>
            </div>
          </div>
          
        </>
      )}
    </div>
  );
};

// --- MAIN FORM BUILDER ---

export default function UpdateRecordForm({ onSubmit, initialData }) {
  const isUpdateMode = !!initialData?.unique_id;
  const [category, setCategory] = useState(initialData?.category || 'latest-jobs');
  const [sections, setSections] = useState(initialData?.sections || [{ id: generateUniqueId(), title: '', elements: [] }]);
  
  const [examType, setExamType] = useState(() => (initialData?.exam_type || []).map(key => examTypeMaps.keyToLabel.get(key)).filter(Boolean));
  const [applicableStates, setApplicableStates] = useState(() => (initialData?.applicable_states || []).map(key => applicableStatesMaps.keyToLabel.get(key)).filter(Boolean));
  const [minimumQualification, setMinimumQualification] = useState(() => (initialData?.minimum_qualification || []).map(key => minimumQualificationMaps.keyToLabel.get(key)).filter(Boolean));
  const [otherTags, setOtherTags] = useState(() => (initialData?.other_tags || []).map(key => otherTagsMaps.keyToLabel.get(key)).filter(Boolean));

  const [showIn, setShowIn] = useState({
    important: initialData?.show?.important || false,
    new: initialData?.show?.new || false,
    hidden: initialData?.show?.hidden || false,
    jobs: initialData?.show?.jobs || false,
    results: initialData?.show?.results || false,
    admitCard: initialData?.show?.admitCard || false,
    admission: initialData?.show?.admission || false,
    syllabus: initialData?.show?.syllabus || false,
    answerKey: initialData?.show?.answerKey || false,
    correction: initialData?.show?.correction || false,
    upcoming: initialData?.show?.upcoming || false,
    documents: initialData?.show?.documents || false,
    sarkariYojna: initialData?.show?.sarkariYojna || false,
    offlineForm: initialData?.show?.offlineForm || false,
  });

  useEffect(() => {
    const processInitialData = (data) => {
      if (data.sections) {
        const transformedSections = data.sections.map(section => {
          const transformedElements = section.elements.map(el => {
            if (el.type === 'table' && el.rows && el.columns) {
              const transformedRows = el.rows.map(dbRow => {
                if (Array.isArray(dbRow.cells)) {
                  return dbRow;
                }
                const cellsArray = el.columns.map(column => dbRow[column.id] || '');
                return { id: dbRow.id, cells: cellsArray };
              });
              return { ...el, rows: transformedRows };
            }
            return el;
          });
          return { ...section, elements: transformedElements };
        });
        setSections(transformedSections);
      }
      if (data.category) {
        setCategory(data.category);
      }
    };

    if (isUpdateMode && initialData) {
      // For updates, always prioritize fresh data from the server.
      processInitialData(initialData);
      // Clear any potentially stale cache for this specific record
      const cacheKey = `formData_${initialData.unique_id}`;
      localStorage.removeItem(cacheKey);
    } else {
      // For new records, try to load from cache.
      const cacheKey = 'formData_new';
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setCategory(parsedData.category || 'latest-jobs');
        setSections(parsedData.sections || [{ id: generateUniqueId(), title: '', elements: [] }]);
        setExamType(parsedData.examType || []);
        setApplicableStates(parsedData.applicableStates || []);
        setMinimumQualification(parsedData.minimumQualification || []);
        setOtherTags(parsedData.otherTags || []);
        setShowIn(parsedData.showIn || {
          important: false,
          new: false,
          hidden: false,
          jobs: false,
          results: false,
          admitCard: false,
          admission: false,
          syllabus: false,
          answerKey: false,
          correction: false,
          upcoming: false,
          documents: false,
          sarkariYojna: false,
          offlineForm: false,
        });
      }
    }
  }, [initialData, isUpdateMode]);

  useEffect(() => {
    const cacheKey = isUpdateMode ? `formData_${initialData.unique_id}` : 'formData_new';
    const dataToCache = JSON.stringify({
      category,
      sections,
      showIn,
      examType: examType.map(label => examTypeMaps.labelToKey.get(label)),
      applicableStates: applicableStates.map(label => applicableStatesMaps.labelToKey.get(label)),
      minimumQualification: minimumQualification.map(label => minimumQualificationMaps.labelToKey.get(label)),
      otherTags: otherTags.map(label => otherTagsMaps.labelToKey.get(label)),
    });
    localStorage.setItem(cacheKey, dataToCache);
  }, [
    category,
    sections,
    showIn,
    examType,
    applicableStates,
    minimumQualification,
    otherTags,
    isUpdateMode,
    initialData,
  ]);


  const updateSection = (index, updatedSection) => {
    const newSections = [...sections];
    newSections[index] = updatedSection;
    setSections(newSections);
  };

  const addSection = () => setSections([...sections, { id: generateUniqueId(), title: '', elements: [] }]);
  const removeSection = (index) => setSections(sections.filter((_, i) => i !== index));

  const handleShowInChange = (e) => {
    const { name, checked } = e.target;
    setShowIn(prev => ({ ...prev, [name]: checked }));
  };


  const getPayload = (isDraft = false) => {
    const payload = {
      category,
      show: showIn,
      exam_type: examType.map(label => examTypeMaps.labelToKey.get(label)),
      applicable_states: applicableStates.map(label => applicableStatesMaps.labelToKey.get(label)),
      minimum_qualification: minimumQualification.map(label => minimumQualificationMaps.labelToKey.get(label)),
      other_tags: otherTags.map(label => otherTagsMaps.labelToKey.get(label)),
      sections: [],
      pendingForm: isDraft,
    };

    sections.forEach(section => {
      const sectionData = {
        id: section.id,
        title: section.title,
        elements: []
      };
      const sectionDetails = sectionMap.get(section.title);
      const sectionId = sectionDetails ? sectionDetails.id : section.title;

      section.elements.forEach(el => {
        if (el.type === 'field') {
          if (el.name) {
            sectionData.elements.push({
              id: el.id,
              type: 'field',
              label: el.label,
              name: el.name,
              value: el.value || '',
              fieldType: el.fieldType,
            });
          }
        } else if (el.type === 'table') {
          if (el.name) {
            const transformedRows = el.rows.map(row => {
              const newRow = { id: row.id };
              el.columns.forEach((col, index) => {
                newRow[col.id] = row.cells[index] || '';
              });
              return newRow;
            });
            sectionData.elements.push({
              id: el.id,
              type: 'table',
              name: el.name,
              columns: el.columns,
              rows: transformedRows,
            });
          }
        }
      });
      if (sectionData.elements.length > 0) {
        payload.sections.push(sectionData);
      }
    });
    // console.log("Generated Payload:", payload);
    return payload;
  }

  const handleSaveDraft = () => {
    const payload = getPayload(true);
    // console.log("Saving Draft Payload:", payload);
    onSubmit(payload);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = getPayload(false);
    // console.log("Final Transformed Payload:", payload);
    onSubmit(payload);
  };

  return (
    <div className="bg-white px-6 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {isUpdateMode ? 'Update Record' : 'Add New Record'}
      </h2>
      <form onSubmit={handleSubmit} onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target.tagName.toLowerCase() !== 'button' && e.target.tagName.toLowerCase() !== 'textarea') {
          e.preventDefault();
        }
      }}>
        <div className="mb-6 p-4 border-2 border-purple-200 rounded-lg bg-purple-50/50">
          <h3 className="text-xl font-bold mb-2 text-purple-800">Category</h3>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border border-gray-300 rounded-md shadow-sm w-full">
            <option value="latest-jobs">Latest Jobs</option>
            <option value="result">Result</option>
            <option value="admit-cards">Admit Cards</option>
            <option value="answer-key">Answer Key</option>
            <option value="syllabus">Syllabus</option>
            <option value="admission">Admission</option>
            <option value="documents">Documents</option>
            <option value="sarkari-yojna">Sarkari Yojna</option>
            <option value="offline-form">Offline Form</option>
          </select>
        </div>
        <div className="mb-6 p-4 border-2 border-purple-200 rounded-lg bg-purple-50/50">
          <h3 className="text-xl font-bold mb-2 text-purple-800">Display In</h3>
          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="correction" checked={showIn.correction} onChange={handleShowInChange} className="form-checkbox h-5 w-5 text-purple-600" />
              <span>Correction</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="important" checked={showIn.important} onChange={handleShowInChange} className="form-checkbox h-5 w-5 text-purple-600" />
              <span>Important</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="new" checked={showIn.new} onChange={handleShowInChange} className="form-checkbox h-5 w-5 text-purple-600" />
              <span>New</span>
            </label>
             <label className="flex items-center gap-2">
              <input type="checkbox" name="upcoming" checked={showIn.upcoming} onChange={handleShowInChange} className="form-checkbox h-5 w-5 text-purple-600" />
              <span>Up Coming</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="hidden" checked={showIn.hidden} onChange={handleShowInChange} className="form-checkbox h-5 w-5 text-purple-600" />
              <span>Hidden</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="jobs" checked={showIn.jobs} onChange={handleShowInChange} className="form-checkbox h-5 w-5 text-purple-600" />
              <span>Jobs</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="results" checked={showIn.results} onChange={handleShowInChange} className="form-checkbox h-5 w-5 text-purple-600" />
              <span>Results</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="admitCard" checked={showIn.admitCard} onChange={handleShowInChange} className="form-checkbox h-5 w-5 text-purple-600" />
              <span>Admit Card</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="admission" checked={showIn.admission} onChange={handleShowInChange} className="form-checkbox h-5 w-5 text-purple-600" />
              <span>Admission</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="syllabus" checked={showIn.syllabus} onChange={handleShowInChange} className="form-checkbox h-5 w-5 text-purple-600" />
              <span>Syllabus</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="answerKey" checked={showIn.answerKey} onChange={handleShowInChange} className="form-checkbox h-5 w-5 text-purple-600" />
              <span>Answer Key</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="documents" checked={showIn.documents} onChange={handleShowInChange} className="form-checkbox h-5 w-5 text-purple-600" />
              <span>Documents</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="sarkariYojna" checked={showIn.sarkariYojna} onChange={handleShowInChange} className="form-checkbox h-5 w-5 text-purple-600" />
              <span>Sarkari Yojna</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="offlineForm" checked={showIn.offlineForm} onChange={handleShowInChange} className="form-checkbox h-5 w-5 text-purple-600" />
              <span>Offline Form</span>
            </label>
          </div>
        </div>

        <div className="mb-6 p-4 border-2 border-green-200 rounded-lg bg-green-50/50">
          <h3 className="text-xl font-bold mb-2 text-green-800">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
              <MultiSelectAutocomplete
                selectedItems={examType}
                onSelectionChange={setExamType}
                suggestions={examTypeOptions.map(o => o.label)}
                placeholder="Select exam types..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicable States</label>
              <MultiSelectAutocomplete
                selectedItems={applicableStates}
                onSelectionChange={setApplicableStates}
                suggestions={applicableStatesOptions.map(o => o.label)}
                placeholder="Select states..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Qualification</label>
              <MultiSelectAutocomplete
                selectedItems={minimumQualification}
                onSelectionChange={setMinimumQualification}
                suggestions={minimumQualificationOptions.map(o => o.label)}
                placeholder="Select qualifications..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Other Tags</label>
              <MultiSelectAutocomplete
                selectedItems={otherTags}
                onSelectionChange={setOtherTags}
                suggestions={otherTagsOptions.map(o => o.label)}
                placeholder="Select tags..."
              />
            </div>
          </div>
        </div>

        {sections.map((section, index) => {
          const usedSectionTitles = sections
            .filter(s => s.id !== section.id)
            .map(s => s.title);
          const availableSectionSuggestions = sectionSuggestions.filter(s => !usedSectionTitles.includes(s));

          return (
            <FormSection
              key={section.id}
              section={section}
              onUpdate={(updated) => updateSection(index, updated)}
              onRemove={() => {
                const confirmed = window.confirm("Are you sure you want to delete this column?");
                if (confirmed) removeSection(index);
              }}
              onSaveDraft={handleSaveDraft}
              availableSectionSuggestions={availableSectionSuggestions}
            />
          );
        })}
        <button type="button" onClick={addSection} className="flex items-center justify-center w-full mt-6 py-3 px-6 border-2 border-dashed border-purple-400 rounded-lg text-purple-600 font-semibold hover:bg-purple-50"><Plus className="mr-2" aria-hidden="true" /> Add New Section</button>
        <button type="submit" className="w-full cursor-pointer my-8 bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-700">
          {isUpdateMode ? 'Update Record' : 'Add Record'}
        </button>
      </form>
    </div>
  );
}
