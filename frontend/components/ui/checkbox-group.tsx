"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CheckboxGroupProps {
  items: { id: string; label: string }[]
  selectedItems: string[]
  onChange: (selectedItems: string[]) => void
  disabled?: boolean
  emptyMessage?: string
  title?: string
}

export function CheckboxGroup({
  items,
  selectedItems,
  onChange,
  disabled = false,
  emptyMessage = "Nenhum item disponível.",
  title,
}: CheckboxGroupProps) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredItems = items.filter((item) => item.label.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleItemChange = (id: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedItems, id])
    } else {
      onChange(selectedItems.filter((item) => item !== id))
    }
  }

  const handleSelectAll = () => {
    onChange(filteredItems.map((item) => item.id))
  }

  const handleClearSelection = () => {
    onChange([])
  }

  return (
    <div className="space-y-2">
      {title && <div className="text-sm font-medium mb-1">{title}</div>}

      <div className="relative mb-2">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
          disabled={disabled}
        />
      </div>

      <div className="flex justify-between mb-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          disabled={disabled || filteredItems.length === 0}
          className="text-xs h-7 px-2"
        >
          Selecionar todos
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClearSelection}
          disabled={disabled || selectedItems.length === 0}
          className="text-xs h-7 px-2"
        >
          Limpar seleção
        </Button>
      </div>

      <ScrollArea className="h-[150px] border rounded-md p-2">
        {filteredItems.length > 0 ? (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`item-${item.id}`}
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={(checked) => handleItemChange(item.id, checked === true)}
                  disabled={disabled}
                />
                <label
                  htmlFor={`item-${item.id}`}
                  className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    disabled ? "opacity-70" : ""
                  }`}
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">{emptyMessage}</div>
        )}
      </ScrollArea>
    </div>
  )
}
