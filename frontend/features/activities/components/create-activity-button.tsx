"use client"

import { Button } from "@/components/ui/button"
import { Layers } from "lucide-react"
import { useRouter } from "next/navigation"

interface CreateActivityButtonProps {
  className?: string
}

export function CreateActivityButton({ className }: CreateActivityButtonProps) {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.push("/tasks?createActivity=true")}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
    >
      <Layers className="h-4 w-4 mr-2" />
      Nova Atividade
    </Button>
  )
}
