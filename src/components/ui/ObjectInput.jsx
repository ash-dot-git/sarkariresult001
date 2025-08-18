export default function ObjectInput({ field, data, onObjectChange, onNestedChange, onSalaryChange }) {
  return (
    <div>
      <h3 className="font-bold">{field.replace(/([A-Z])/g, " $1").trim()}</h3>
      {field === "applicationFee" && (
        <>
          <input
            name="general"
            value={data.general}
            onChange={(e) => onNestedChange(e, field, "general")}
            placeholder="General Fee (e.g., 500)"
            className="border p-2 w-full mb-2"
            autoComplete="off"
            aria-label="General Fee"
          />
          <input
            name="scst"
            value={data.scst}
            onChange={(e) => onNestedChange(e, field, "scst")}
            placeholder="SC/ST Fee (e.g., 250)"
            className="border p-2 w-full mb-2"
            autoComplete="off"
            aria-label="SC/ST Fee"
          />
          <input
            name="female"
            value={data.female}
            onChange={(e) => onNestedChange(e, field, "female")}
            placeholder="Female Fee (e.g., 0)"
            className="border p-2 w-full"
            autoComplete="off"
            aria-label="Female Fee"
          />
        </>
      )}
      {field === "hiringOrganization" && (
        <>
          <input
            name="organizationName"
            value={data.organizationName}
            onChange={(e) => onObjectChange(e, field)}
            placeholder="Organization Name (e.g., Staff Selection Commission)"
            className="border p-2 w-full mb-2"
            autoComplete="organization"
            aria-label="Organization Name"
          />
          <input
            name="officialWebsite"
            value={data.officialWebsite}
            onChange={(e) => onObjectChange(e, field)}
            placeholder="Official Website (e.g., https://ssc.nic.in)"
            className="border p-2 w-full"
            autoComplete="url"
            aria-label="Official Website"
          />
        </>
      )}
      {field === "jobLocation" && (
        <>
          <input
            name="city"
            value={data.location.city}
            onChange={(e) => onNestedChange(e, field, "location")}
            placeholder="City (e.g., New Delhi)"
            className="border p-2 w-full mb-2"
            autoComplete="address-level2"
            aria-label="City"
          />
          <input
            name="country"
            value={data.location.country}
            onChange={(e) => onNestedChange(e, field, "location")}
            placeholder="Country (e.g., IN)"
            className="border p-2 w-full"
            autoComplete="country"
            aria-label="Country"
          />
        </>
      )}
      {field === "baseSalary" && (
        <>
          <input
            name="minimum"
            value={data.salaryRange.minimum}
            onChange={(e) => onSalaryChange(e, "salaryRange")}
            placeholder="Minimum (e.g., 35000)"
            className="border p-2 w-full mb-2"
            autoComplete="off"
            aria-label="Minimum Salary"
          />
          <input
            name="maximum"
            value={data.salaryRange.maximum}
            onChange={(e) => onSalaryChange(e, "salaryRange")}
            placeholder="Maximum (e.g., 120000)"
            className="border p-2 w-full mb-2"
            autoComplete="off"
            aria-label="Maximum Salary"
          />
          <input
            name="period"
            value={data.salaryRange.period}
            onChange={(e) => onSalaryChange(e, "salaryRange")}
            placeholder="Period (e.g., MONTH)"
            className="border p-2 w-full"
            autoComplete="off"
            aria-label="Salary Period"
          />
        </>
      )}
    </div>
  );
}