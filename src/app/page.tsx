import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/index.html')
  return null
}
