/**
 * Commissions API Route
 * Handle CRUD operations for art commissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// GET /api/commissions - List commissions with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const clientId = searchParams.get('clientId');
    const artistId = searchParams.get('artistId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('commissions')
      .select(`
        *,
        client:users!client_id(id, username, full_name, avatar_url, reputation_score),
        artist:users!artist_id(id, username, full_name, avatar_url, reputation_score)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (status) query = query.eq('status', status);
    if (category) query = query.eq('category', category);
    if (clientId) query = query.eq('client_id', clientId);
    if (artistId) query = query.eq('artist_id', artistId);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        limit,
        offset,
        total: count || 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching commissions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/commissions - Create new commission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientId,
      title,
      description,
      category,
      budget,
      deadline,
      referenceImages = [],
      metadataCid,
    } = body;

    // Validation
    if (!clientId || !title || !description || !category || !budget || !deadline) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call database function
    const { data, error } = await supabase.rpc('create_commission', {
      p_client_id: clientId,
      p_title: title,
      p_description: description,
      p_category: category,
      p_budget: budget,
      p_deadline: deadline,
      p_reference_images: referenceImages,
      p_metadata_cid: metadataCid,
    });

    if (error) throw error;

    // Fetch the created commission
    const { data: commission } = await supabase
      .from('commissions')
      .select('*')
      .eq('id', data)
      .single();

    return NextResponse.json({
      success: true,
      data: commission,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating commission:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
