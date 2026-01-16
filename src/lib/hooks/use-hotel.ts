'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import type { Hotel } from '@/types/database'

export function useHotel() {
    const { user } = useAuth()
    const [hotel, setHotel] = useState<Hotel | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchHotel() {
            if (!user) {
                setLoading(false)
                return
            }

            try {
                const supabase = createClient()
                const { data, error } = await supabase
                    .from('hotels') // Assuming table name is 'hotels' based on types/database.ts usually mapping 1:1, but might be 'hotel_profiles' based on previous context. Let's verify table name if this fails, but 'hotels' is standard. Wait, user prompt mentioned "hotels table" explicitly.
                    .select('*')
                    .eq('user_id', user.id)
                    .single()

                if (error) {
                    if (error.code !== 'PGRST116') { // PGRST116 is "Results contain 0 rows" which is fine (onboarding case)
                        console.error('Error fetching hotel:', error)
                        setError(error.message)
                    }
                } else {
                    setHotel(data)
                }
            } catch (err) {
                console.error('Unexpected error fetching hotel:', err)
                setError('An unexpected error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchHotel()
    }, [user])

    return { hotel, loading, error }
}
