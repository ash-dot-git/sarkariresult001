"use client";

import { useState, useEffect } from "react";
import TextInput from "@/components/ui/TextInput";
import DateInput from "@/components/ui/DateInput";
import ArrayInput from "@/components/ui/ArrayInput";
import ObjectInput from "@/components/ui/ObjectInput";

export default function NewRecordForm() {
  const [mode, setMode] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    postDate: "",
    validThrough: "",
    totalVacancies: "",
    employmentType: "",
    importantDates: [{ label: "", date: "" }],
    applicationFee: { general: "", scst: "", female: "" },
    eligibilityCriteria: [""],
    examSchedule: [{ examName: "", examDate: "" }],
    vacancyDetails: [{ jobPost: "", numberOfVacancies: "" }],
    applicationProcess: "",
    hiringOrganization: { organizationName: "", officialWebsite: "" },
    jobLocation: { location: { city: "", country: "" } },
    baseSalary: { currencyCode: "INR", salaryRange: { minimum: "", maximum: "", period: "MONTH" } },
  });

  useEffect(() => {
    console.log("Component mounted, mode:", mode); // Debug mount
  }, [mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Handle Change:", name, value); // Debug input
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, index, field) => {
    const { name, value } = e.target;
    console.log("Handle Array Change:", field, index, name, value); // Debug array
    const updatedArray = [...formData[field]];
    updatedArray[index] = { ...updatedArray[index], [name]: value };
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const handleNestedChange = (e, field, subField) => {
    const { name, value } = e.target;
    console.log("Handle Nested Change:", field, subField, name, value); // Debug nested
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [subField]: { ...prev[field][subField], [name]: value } },
    }));
  };

  const handleObjectChange = (e, field) => {
    const { name, value } = e.target;
    console.log("Handle Object Change:", field, name, value); // Debug object
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [name]: value },
    }));
  };

  const handleSalaryChange = (e, subField) => {
    const { name, value } = e.target;
    console.log("Handle Salary Change:", subField, name, value); // Debug salary
    setFormData((prev) => ({
      ...prev,
      baseSalary: {
        ...prev.baseSalary,
        salaryRange: { ...prev.baseSalary.salaryRange, [name]: value },
      },
    }));
  };

  const handleArrayItemChange = (e, index, field) => {
    const { value } = e.target;
    console.log("Handle Array Item Change:", field, index, value); // Debug array
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const addItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [
        ...prev[field],
        field === "importantDates" || field === "examSchedule" || field === "vacancyDetails"
          ? { label: "", date: "" }
          : "",
      ],
    }));
  };

  const removeItem = (index, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Handle Submit:", formData); // Debug submit
    if (window.confirm("Submit record?")) {
      alert("Record submitted! Check console for details.");
      setFormData({
        title: "",
        organization: "",
        postDate: "",
        validThrough: "",
        totalVacancies: "",
        employmentType: "",
        importantDates: [{ label: "", date: "" }],
        applicationFee: { general: "", scst: "", female: "" },
        eligibilityCriteria: [""],
        examSchedule: [{ examName: "", examDate: "" }],
        vacancyDetails: [{ jobPost: "", numberOfVacancies: "" }],
        applicationProcess: "",
        hiringOrganization: { organizationName: "", officialWebsite: "" },
        jobLocation: { location: { city: "", country: "" } },
        baseSalary: { currencyCode: "INR", salaryRange: { minimum: "", maximum: "", period: "MONTH" } },
      });
    }
  };

  const renderNewRecordForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title (e.g., SSC CGL 2025)"
        autocomplete="job-title"
      />
      <TextInput
        name="organization"
        value={formData.organization}
        onChange={handleChange}
        placeholder="Organization (e.g., Staff Selection Commission)"
        autocomplete="organization"
      />
      <DateInput
        name="postDate"
        value={formData.postDate}
        onChange={handleChange}
        placeholder="Post Date (e.g., 2025-06-01)"
        autocomplete="date"
      />
      <DateInput
        name="validThrough"
        value={formData.validThrough}
        onChange={handleChange}
        placeholder="Valid Through (e.g., 2025-07-31)"
        autocomplete="date"
      />
      <TextInput
        name="totalVacancies"
        value={formData.totalVacancies}
        onChange={handleChange}
        placeholder="Total Vacancies (e.g., 14582)"
        autocomplete="off"
      />
      <TextInput
        name="employmentType"
        value={formData.employmentType}
        onChange={handleChange}
        placeholder="Employment Type (e.g., FULL_TIME)"
        autocomplete="off"
      />
      <ArrayInput
        field="importantDates"
        items={formData.importantDates}
        onArrayChange={handleArrayChange}
        onArrayItemChange={handleArrayItemChange}
        addItem={addItem}
        removeItem={removeItem}
      />
      <ObjectInput
        field="applicationFee"
        data={formData.applicationFee}
        onNestedChange={handleNestedChange}
        onObjectChange={handleObjectChange}
        onSalaryChange={handleSalaryChange}
      />
      <ArrayInput
        field="eligibilityCriteria"
        items={formData.eligibilityCriteria}
        onArrayChange={handleArrayChange}
        onArrayItemChange={handleArrayItemChange}
        addItem={addItem}
        removeItem={removeItem}
      />
      <ArrayInput
        field="examSchedule"
        items={formData.examSchedule}
        onArrayChange={handleArrayChange}
        onArrayItemChange={handleArrayItemChange}
        addItem={addItem}
        removeItem={removeItem}
      />
      <ArrayInput
        field="vacancyDetails"
        items={formData.vacancyDetails}
        onArrayChange={handleArrayChange}
        onArrayItemChange={handleArrayItemChange}
        addItem={addItem}
        removeItem={removeItem}
      />
      <TextInput
        name="applicationProcess"
        value={formData.applicationProcess}
        onChange={handleChange}
        placeholder="Application Process (e.g., Visit ssc.nic.in)"
        autocomplete="off"
      />
      <ObjectInput
        field="hiringOrganization"
        data={formData.hiringOrganization}
        onNestedChange={handleNestedChange}
        onObjectChange={handleObjectChange}
        onSalaryChange={handleSalaryChange}
      />
      <ObjectInput
        field="jobLocation"
        data={formData.jobLocation}
        onNestedChange={handleNestedChange}
        onObjectChange={handleObjectChange}
        onSalaryChange={handleSalaryChange}
      />
      <ObjectInput
        field="baseSalary"
        data={formData.baseSalary}
        onNestedChange={handleNestedChange}
        onObjectChange={handleObjectChange}
        onSalaryChange={handleSalaryChange}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
        aria-label="Submit new record"
      >
        Submit New Record
      </button>
    </form>
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      {renderNewRecordForm()}
    </div>
  );
}