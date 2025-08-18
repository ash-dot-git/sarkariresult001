import { NextResponse } from 'next/server';

/**
 * Creates a standardized Next.js API response from a backend service response.
 *
 * @param {object} backendResponse - The response object from the backend service.
 * @param {boolean} backendResponse.stat - The status of the operation.
 * @param {string} backendResponse.code - The HTTP-like status code as a string.
 * @param {string} backendResponse.message - A human-readable message.
 * @param {object} [backendResponse.data={}] - The payload data.
 * @param {string} [backendResponse.srvc='unknown'] - The service identifier.
 * @param {string} [backendResponse.trxn] - The transaction ID.
 * @returns {NextResponse} A Next.js Response object.
 */
export function createApiResponse(backendResponse) {
  const { stat, code, message, data = {}, srvc = 'unknown', trxn } = backendResponse;

  // Parse the code from string to number for the HTTP status.
  const numericCode = parseInt(code, 10);

  // Validate the status code to prevent RangeError.
  // If the code is invalid, default to 200 for success and 500 for failure.
  const httpStatusCode = (Number.isInteger(numericCode) && numericCode >= 200 && numericCode <= 599)
    ? numericCode
    : (stat ? 200 : 500);

  return NextResponse.json(
    {
      stat,
      code, // Return the original string code from the backend in the JSON body
      message,
      trxn,
      srvc,
      data,
    },
    {
      status: httpStatusCode, // Use the validated numeric HTTP status code
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}