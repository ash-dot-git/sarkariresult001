import { NextResponse } from 'next/server';
import { callMongoFunction } from '@/lib/mongo-app';
import { cors } from '@/lib/cors';
import { createApiResponse } from '@/lib/api-helpers';

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

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const record = await request.json();

    const backendPayload = {
      data: { id, ...record },
      srvc: 'web-client'
    };

    const realmResponse = await callMongoFunction('updateRecord', backendPayload);
    const response = createApiResponse(realmResponse);

    return applyCors(response);
  } catch (e) {
    console.error("API Error updating record:", e);
    const response = createApiResponse({
      stat: false,
      code: '500',
      message: "Failed to update record",
      data: { error: e.message },
      trxn: `txn_${Date.now()}`,
      srvc: "api-gateway"
    });
    return applyCors(response);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const backendPayload = {
      data: { id },
      srvc: 'web-client'
    };

    const realmResponse = await callMongoFunction('deleteRecord', backendPayload);
    const response = createApiResponse(realmResponse);

    return applyCors(response);
  } catch (e) {
    console.error("API Error deleting record:", e);
    const response = createApiResponse({
      stat: false,
      code: '500',
      message: "Failed to delete record",
      data: { error: e.message },
      trxn: `txn_${Date.now()}`,
      srvc: "api-gateway"
    });
    return applyCors(response);
  }
}