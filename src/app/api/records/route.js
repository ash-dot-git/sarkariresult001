import { NextResponse } from 'next/server';
import * as RecordService from '@/lib/services/recordService';
import { createApiResponse } from '@/lib/api-helpers';
import { cors } from '@/lib/cors';

/**
 * Records API — Main Route
 *
 * POST /api/records
 *   Routes actions from the client-side api.js to the service layer.
 *   Kept as a POST endpoint for backward compatibility with the existing
 *   client-side code (api.js sends { action, payload, srvc }).
 *
 * GET /api/records?search=&page=1&limit=25&categories=
 *   RESTful alternative for fetching records via query params.
 */

// ─── CORS ──────────────────────────────────────────────────────────────────────

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

// ─── ACTION MAP ────────────────────────────────────────────────────────────────

/**
 * Maps client action names to service functions.
 * This is the single source of truth for which actions are callable via the API.
 */
const ACTION_MAP = {
  getAllRecords:              RecordService.getAllRecords,
  getRecordDetails:          RecordService.getRecordDetails,
  getCategoryRecords:        RecordService.getCategoryRecords,
  getFilteredRecords:        RecordService.getFilteredRecords,
  getLatestImportantRecords: RecordService.getLatestImportantRecords,
  getAllSlugs:               RecordService.getAllSlugs,
  addRecord:                 RecordService.addRecord,
  updateRecord:              RecordService.updateRecord,
  deleteRecord:              RecordService.deleteRecord,
};

// ─── POST Handler (Legacy + Admin) ─────────────────────────────────────────────

export async function POST(request) {
  let action;
  try {
    const body = await request.json();
    action = body.action;
    const payload = body.payload;

    if (!action) {
      return applyCors(createApiResponse({
        stat: false,
        code: '400',
        message: 'Action not specified in the request body.',
        trxn: `txn_${Date.now()}`,
        srvc: 'api-gateway',
      }));
    }

    const handler = ACTION_MAP[action];
    if (!handler) {
      return applyCors(createApiResponse({
        stat: false,
        code: '400',
        message: `Unknown action: '${action}'.`,
        trxn: `txn_${Date.now()}`,
        srvc: 'api-gateway',
      }));
    }

    const serviceResponse = await handler(payload);

    return applyCors(createApiResponse({
      stat: true,
      code: '200',
      message: `Action '${action}' executed successfully.`,
      data: serviceResponse,
      trxn: `txn_${Date.now()}`,
      srvc: 'api-gateway',
    }));

  } catch (error) {
    console.error(`[API] POST /api/records (action: ${action}) failed:`, error.message);
    return applyCors(createApiResponse({
      stat: false,
      code: '500',
      message: 'An unexpected error occurred on the server.',
      data: { error: error.message },
      trxn: `txn_${Date.now()}`,
      srvc: 'api-gateway',
    }));
  }
}

// ─── GET Handler (RESTful) ─────────────────────────────────────────────────────

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const categories = searchParams.get('categories')
      ? searchParams.get('categories').split(',')
      : [];

    const serviceResponse = await RecordService.getAllRecords({
      searchTerm: search,
      index: page,
      items: limit,
      categories,
    });

    return applyCors(createApiResponse({
      stat: true,
      code: '200',
      message: 'Records fetched successfully.',
      data: serviceResponse,
      trxn: `txn_${Date.now()}`,
      srvc: 'api-gateway',
    }));

  } catch (error) {
    console.error('[API] GET /api/records failed:', error.message);
    return applyCors(createApiResponse({
      stat: false,
      code: '500',
      message: 'Failed to fetch records.',
      data: { error: error.message },
      trxn: `txn_${Date.now()}`,
      srvc: 'api-gateway',
    }));
  }
}
