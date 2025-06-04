"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"

interface ClassroomSearchProps {
  initialSearchTerm: string
}

export default function ClassroomSearch({ initialSearchTerm }: ClassroomSearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Update URL with search term
  const updateSearchParams = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("search", term)
    } else {
      params.delete("search")
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, 300)

  useEffect(() => {
    updateSearchParams(searchTerm)
  }, [searchTerm, updateSearchParams])

  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        placeholder="Search classrooms..."
        className="pl-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}
