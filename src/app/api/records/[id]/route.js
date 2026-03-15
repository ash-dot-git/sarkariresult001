import { NextResponse } from 'next/server';
import * as RecordService from '@/lib/services/recordService';
import { createApiResponse } from '@/lib/api-helpers';
import { cors } from '@/lib/cors';

/**
 * Records API — Single Record Operations
 * Route: /api/records/[id]
 *
 * PUT    → Update a record by unique_id (admin only)
 * DELETE → Delete a record by unique_id (admin only)
 */

function applyCors(response) {
  const corsHeaders = cors();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: cors() });
}

// ─── PUT: Update record ────────────────────────────────────────────────────────

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const updateData = await request.json();

    const serviceResponse = await RecordService.updateRecord({
      unique_id: id,
      updateData,
    });

    return applyCors(createApiResponse({
      stat: serviceResponse.stat,
      code: serviceResponse.stat ? '200' : '404',
      message: serviceResponse.stat ? 'Record updated successfully.' : serviceResponse.message,
      data: serviceResponse.data || {},
      trxn: `txn_${Date.now()}`,
      srvc: 'api-gateway',
    }));
  } catch (error) {
    console.error('[API] PUT /api/records/[id] failed:', error.message);
    return applyCors(createApiResponse({
      stat: false,
      code: '500',
      message: 'Failed to update record.',
      data: { error: error.message },
      trxn: `txn_${Date.now()}`,
      srvc: 'api-gateway',
    }));
  }
}

// ─── DELETE: Remove record ─────────────────────────────────────────────────────

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const serviceResponse = await RecordService.deleteRecord({ unique_id: id });

    return applyCors(createApiResponse({
      stat: serviceResponse.stat,
      code: serviceResponse.stat ? '200' : '404',
      message: serviceResponse.stat ? 'Record deleted successfully.' : serviceResponse.message,
      data: serviceResponse.data || {},
      trxn: `txn_${Date.now()}`,
      srvc: 'api-gateway',
    }));
  } catch (error) {
    console.error('[API] DELETE /api/records/[id] failed:', error.message);
    return applyCors(createApiResponse({
      stat: false,
      code: '500',
      message: 'Failed to delete record.',
      data: { error: error.message },
      trxn: `txn_${Date.now()}`,
      srvc: 'api-gateway',
    }));
  }
}