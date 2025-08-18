import { callMongoFunction } from '@/lib/mongo-app';
import { createApiResponse } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { cors } from '@/lib/cors';

// === CORS helper to apply headers ===
function applyCors(response) {
  const corsHeaders = cors(); // or pass request if needed
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// === OPTIONS handler ===
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: cors()
  });
}

// === POST handler ===
export async function POST(request) {
  let action;
  try {
    const { action: clientAction, payload: clientPayload, srvc } = await request.json();
    action = clientAction;

    if (!action) {
      const response = createApiResponse({
        stat: false,
        code: '400',
        message: "Action not specified in the request body.",
        trxn: `txn_${Date.now()}`,
        srvc: "api-gateway"
      });
      return applyCors(response);
    }

    const backendPayload = {
      data: clientPayload,
      srvc: srvc || 'web-client'
    };

    const realmResponse = await callMongoFunction(action,   backendPayload);

    // Ensure the response is in the standardized format before creating the API response.
    const formattedResponse = {
      stat: true,
      code: '200',
      message: `Action '${action}' executed successfully.`,
      data: realmResponse, // The actual data from the Mongo function
      trxn: `txn_${Date.now()}`,
      srvc: "api-gateway"
    };

    const response = createApiResponse(formattedResponse);

    return applyCors(response);

  } catch (e) {
    const response = createApiResponse({
      stat: false,
      code: '500',
      message: "An unexpected error occurred on the server.",
      data: { error: e.message },
      trxn: `txn_${Date.now()}`,
      srvc: "api-gateway"
    });
    return applyCors(response);
  }
}
