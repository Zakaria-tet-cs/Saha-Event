import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: salleId } = await params;

  try {
    const body = await request.json()

    if (!salleId) {
      return NextResponse.json(
        { error: 'ID de la salle manquant' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('salles')
      .update(body)
      .eq('id', salleId)
      .select()

    if (error) {
      console.error('Erreur Supabase PATCH:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Salle introuvable ou non modifiée' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { data: data[0], message: 'Salle mise à jour avec succès' },
      { status: 200 }
    )

  } catch (err: unknown) {
    console.error('Erreur inattendue PATCH:', err)
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: salleId } = await params;

  try {
    const { error } = await supabaseAdmin
      .from('salles')
      .delete()
      .eq('id', salleId)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Salle supprimée avec succès' },
      { status: 200 }
    )

  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    )
  }
}
