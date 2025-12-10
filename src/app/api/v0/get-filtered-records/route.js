// src/app/api/get-latest-important-records/route.js

import { NextResponse } from 'next/server';
import { getFilteredRecords } from '@/services/services-mndb';

export async function POST(req) {
  let result = { data: {}, code: 0, stat: false, message: '*****', trxn: '*****', srvc: '*****' };

  let body;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json(
      { ...result, code: 400, message: 'Invalid JSON', trxn: '*****', srvc: '*****' },
      { status: 400 }
    );
  }

  const { data, srvc } = body || {};

  if (!srvc) {
    return NextResponse.json(
      { ...result, code: 401, message: 'srvc not found', data: data || {}, trxn: '*****', srvc: srvc || '*****' },
      { status: 401 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { ...result, code: 400, message: 'data not found', trxn: '*****', srvc: srvc || '*****' },
      { status: 400 }
    );
  }

  try {
    const resultm = await getFilteredRecords({ data, srvc });
    console.log(resultm)
    result.data = resultm.data;
    result.code = resultm.code;
    result.stat = resultm.stat;
    result.message = resultm.message;
    result.trxn = resultm.trxn || '*****';
    result.srvc = resultm.srvc || '*****';

    return NextResponse.json(result, { status: result.code });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { ...result, code: 500, message: error.message, trxn: '*****', srvc: '*****' },
      { status: 500 }
    );
  }
}
