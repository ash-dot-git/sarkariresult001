// src/data/schema.js
// This is a structured JSON schema manually created from details_schema.txt
// for robustness and maintainability.

import {
  examTypeOptions,
  applicableStatesOptions,
  minimumQualificationOptions,
  otherTagsOptions,
} from './filters';

export const detailsSchema = {
  name_of_post: { type: 'text', required: true },
  description_of_post: { type: 'textarea' },
  name_of_organisation: { type: 'text' },
  post_date: { type: 'date', default: 'today' },
  exam_type: {
    type: 'array',
    items: {
      type: 'text',
      suggestions: examTypeOptions,
    },
  },
  applicable_states: {
    type: 'array',
    items: {
      type: 'text',
      suggestions: applicableStatesOptions,
    },
  },
  minimum_qualification: {
    type: 'array',
    items: {
      type: 'text',
      suggestions: minimumQualificationOptions,
    },
  },
  other_tags: {
    type: 'array',
    items: {
      type: 'text',
      suggestions: otherTagsOptions,
    },
  },
  important_dates: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        title: {
          type: 'text',
          placeholder: 'e.g., Application Start',
          suggestions: [
            'Application Begin',
            'Last Date for Apply Online',
            'Pay Exam Fee Last Date',
            'Exam Date',
            'Admit Card Available',
            'Result Available'
          ]
        },
        date: { type: 'date', nullable: true },
      },
    },
  },
  application_fee: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        category: { type: 'text', placeholder: 'e.g., UR/EWS/OBC' },
        amount: { type: 'number', placeholder: 'e.g., 500' },
      },
    },
  },
  mode_of_payment: { type: 'text', default: 'Online via Debit Card, Credit Card, Net Banking' },
  age_limit: {
    type: 'object',
    properties: {
      as_on: { type: 'date' },
      min_age: { type: 'number', placeholder: 'e.g., 18' },
      max_age: { type: 'number', placeholder: 'e.g., 27' },
      remarks: { type: 'textarea', placeholder: 'e.g., Age relaxation as per rules' },
    },
  },
  vacancy_details: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        post_name: { type: 'text' },
        no_of_post: { type: 'number' },
        eligibility_criteria: { type: 'textarea', placeholder: 'Enter each criterion on a new line.' },
      },
    },
  },
  documents_required: {
    type: 'array',
    items: {
      type: 'text',
      placeholder: 'e.g., Aadhar Card'
    },
  },
  mode_of_selection: {
    type: 'array',
    items: {
      type: 'text',
      placeholder: 'e.g., Written Exam'
    },
  },
  important_links: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        title: { type: 'text', placeholder: 'e.g., Apply Online' },
        link: { type: 'url', placeholder: 'https://example.com' },
      },
    },
  },
};