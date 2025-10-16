/**
 * Commission Detail API Route
 * Get, update, and delete specific commission
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// GET /api/commissions/[id] - Get commission details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data, error } = await supabase.rpc('get_commission_details', {
      p_commission_id: id,
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Commission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
    });
  } catch (error: any) {
    console.error('Error fetching commission:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/commissions/[id] - Update commission
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('commissions')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Error updating commission:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/commissions/[id] - Cancel commission
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Soft delete by updating status
    const { data, error } = await supabase
      .from('commissions')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .eq('status', 'open') // Can only cancel open commissions
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Error cancelling commission:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
