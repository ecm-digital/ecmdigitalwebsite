import { supabase } from './client'

// Funkcja do dodawania przykładowych danych dla zalogowanego użytkownika
export async function createDemoDataForUser() {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    // Wywołaj funkcję SQL do tworzenia przykładowych projektów
    const { data, error } = await supabase.rpc('create_sample_projects_for_user', {
      user_id: user.id
    })

    if (error) throw error

    return { success: true, message: 'Przykładowe dane zostały dodane!' }
  } catch (error) {
    console.error('Error creating demo data:', error)
    return { success: false, error: error.message }
  }
}

// Funkcja do usuwania przykładowych danych
export async function removeDemoData() {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    // Usuń wszystkie projekty demo
    const { error: projectsError } = await supabase
      .from('projects')
      .delete()
      .eq('client_id', user.id)
      .like('name', '%[DEMO]%')

    if (projectsError) throw projectsError

    return { success: true, message: 'Przykładowe dane zostały usunięte!' }
  } catch (error) {
    console.error('Error removing demo data:', error)
    return { success: false, error: error.message }
  }
}

// Sprawdź czy użytkownik ma przykładowe dane
export async function hasDemoData() {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .eq('client_id', user.id)
      .like('name', '%[DEMO]%')
      .limit(1)

    if (error) throw error

    return data && data.length > 0
  } catch (error) {
    console.error('Error checking demo data:', error)
    return false
  }
}