import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db/connection';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const skip = (page - 1) * limit;

    const collection = await getCollection('news_articles');
    
    let query = {};
    if (search) {
      query = { seoTitle: { $regex: search, $options: 'i' } };
    }

    const totalCount = await collection.countDocuments(query);
    const list = await collection.find(query).sort({ pubDate: -1, generatedAt: -1 }).skip(skip).limit(limit).toArray();

    return NextResponse.json({
      stat: true,
      data: {
        list,
        count: totalCount,
        index: page,
        items: limit
      }
    });

  } catch (error) {
    console.error('[API] GET /api/admin/news failed:', error.message);
    return NextResponse.json({ stat: false, message: 'Failed to fetch news.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ stat: false, message: 'Article ID is required.' }, { status: 400 });
    }

    const collection = await getCollection('news_articles');
    
    // Clean up _id from updateData if it exists to avoid MongoDB immutable field errors
    delete updateData._id;

    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...updateData, updatedAt: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ stat: false, message: 'Article not found.' }, { status: 404 });
    }

    return NextResponse.json({
      stat: true,
      message: 'Article updated successfully.'
    });

  } catch (error) {
    console.error('[API] PUT /api/admin/news failed:', error.message);
    return NextResponse.json({ stat: false, message: 'Failed to update news.' }, { status: 500 });
  }
}
