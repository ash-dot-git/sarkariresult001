export default function ArrayInput({ field, items, onArrayChange, onArrayItemChange, addItem, removeItem }) {
  return (
    <div>
      <h3 className="font-bold">{field.replace(/([A-Z])/g, " $1").trim()}</h3>
      {items.map((item, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          {typeof item === "object" ? (
            <>
              <input
                name={Object.keys(item)[0]}
                value={item[Object.keys(item)[0]]}
                onChange={(e) => onArrayChange(e, index, field)}
                placeholder={`${field} Label (e.g., Application Start)`}
                className="border p-2 w-1/2"
                autoComplete="off"
                aria-label={`${field} Label`}
              />
              <input
                name={Object.keys(item)[1]}
                value={item[Object.keys(item)[1]]}
                onChange={(e) => onArrayChange(e, index, field)}
                placeholder={`${field} Value (e.g., Date)`}
                className="border p-2 w-1/2"
                autoComplete="date"
                aria-label={`${field} Value`}
              />
            </>
          ) : (
            <input
              value={item}
              onChange={(e) => onArrayItemChange(e, index, field)}
              placeholder={`${field} (e.g., Graduate)`}
              className="border p-2 w-full"
              autoComplete="off"
              aria-label={field}
            />
          )}
          <button
            type="button"
            onClick={() => removeItem(index, field)}
            className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 transition-colors duration-200"
            aria-label={`Remove ${field} item`}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addItem(field)}
        className="bg-green-600 text-white py-1 px-2 rounded hover:bg-green-700 transition-colors duration-200"
        aria-label={`Add ${field}`}
      >
        Add {field.replace(/([A-Z])/g, " $1").trim()}
      </button>
    </div>
  );
}