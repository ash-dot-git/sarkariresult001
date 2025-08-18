import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { secret } = await request.json();

    if (secret === process.env.ADMIN_SECRET) {
      const response = NextResponse.json({ success: true, message: 'Authentication successful' });
      // Prevent caching
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      response.headers.set('Surrogate-Control', 'no-store');
      return response;
    } else {
      return NextResponse.json({ success: false, message: 'Invalid secret' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}