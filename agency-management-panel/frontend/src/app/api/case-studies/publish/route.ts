import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

interface PublishRequest {
  caseStudyId: string
  markdown: string
  projectType: 'www' | 'shopify' | 'mvp' | 'ux'
  client: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PublishRequest = await request.json()
    const { caseStudyId, markdown, projectType, client } = body

    // Ścieżka do folderu dokumentacji
    const docsPath = join(process.cwd(), '..', '..', 'dokumentacja-ecm', 'portfolio-case-studies', projectType)
    
    // Nazwa pliku na podstawie nazwy klienta
    const fileName = `${client.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.md`
    const filePath = join(docsPath, fileName)

    try {
      // Stwórz folder jeśli nie istnieje
      await mkdir(docsPath, { recursive: true })
      
      // Zapisz plik markdown
      await writeFile(filePath, markdown, 'utf8')
      
      return NextResponse.json({
        success: true,
        message: 'Case study został opublikowany',
        filePath: `dokumentacja-ecm/portfolio-case-studies/${projectType}/${fileName}`
      })
    } catch (fileError) {
      console.error('File operation error:', fileError)
      return NextResponse.json({
        success: false,
        error: 'Błąd podczas zapisywania pliku'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Publish error:', error)
    return NextResponse.json({
      success: false,
      error: 'Błąd podczas publikacji case study'
    }, { status: 500 })
  }
}

// Endpoint do pobierania listy istniejących case studies
export async function GET() {
  try {
    const { readdir } = await import('fs/promises')
    const { join } = await import('path')
    
    const docsPath = join(process.cwd(), '..', '..', 'dokumentacja-ecm', 'portfolio-case-studies')
    const categories = ['www', 'shopify', 'mvp', 'ux']
    
    const existingCaseStudies = []
    
    for (const category of categories) {
      try {
        const categoryPath = join(docsPath, category)
        const files = await readdir(categoryPath)
        
        for (const file of files) {
          if (file.endsWith('.md') && file !== 'README.md') {
            existingCaseStudies.push({
              category,
              fileName: file,
              slug: file.replace('.md', ''),
              path: `dokumentacja-ecm/portfolio-case-studies/${category}/${file}`
            })
          }
        }
      } catch (categoryError) {
        // Kategoria może nie istnieć - to OK
        console.log(`Category ${category} not found, skipping`)
      }
    }
    
    return NextResponse.json({
      success: true,
      caseStudies: existingCaseStudies
    })
    
  } catch (error) {
    console.error('Get case studies error:', error)
    return NextResponse.json({
      success: false,
      error: 'Błąd podczas pobierania listy case studies'
    }, { status: 500 })
  }
}