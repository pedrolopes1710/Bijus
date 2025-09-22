"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

interface MultiSelectProps {
  items: { id: string; label: string }[]
  placeholder?: string
  selectedItems: string[]
  onChange: (selectedItems: string[]) => void
  disabled?: boolean
  emptyMessage?: string
}

export function MultiSelect({
  items,
  placeholder = "Selecione itens...",
  selectedItems,
  onChange,
  disabled = false,
  emptyMessage = "Nenhum item encontrado.",
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = (item: string) => {
    onChange(selectedItems.filter((i) => i !== item))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && selectedItems.length > 0) {
          onChange(selectedItems.slice(0, -1))
        }
      }
      // Prevent keyboard navigation from going out of the input
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault()
      }
    }
  }

  const selectables = items.filter((item) => !selectedItems.includes(item.id))

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent" shouldFilter={false}>
      <div
        className={`group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.focus()
          }
        }}
      >
        <div className="flex flex-wrap gap-1">
          {selectedItems.map((item) => {
            const selectedItem = items.find((i) => i.id === item)
            return (
              <Badge key={item} variant="secondary" className="rounded-sm">
                {selectedItem?.label || item}
                {!disabled && (
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={() => handleUnselect(item)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </Badge>
            )
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={selectedItems.length === 0 ? placeholder : ""}
            disabled={disabled}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative">
        {open && selectables.length > 0 && (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto max-h-[200px]">
              {selectables
                .filter((item) => item.label.toLowerCase().includes(inputValue.toLowerCase()))
                .map((item) => {
                  return (
                    <CommandItem
                      key={item.id}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onSelect={() => {
                        setInputValue("")
                        onChange([...selectedItems, item.id])
                      }}
                      className={"cursor-pointer"}
                    >
                      {item.label}
                    </CommandItem>
                  )
                })}
              {selectables.filter((item) => item.label.toLowerCase().includes(inputValue.toLowerCase())).length ===
                0 && <CommandItem className="cursor-default">{emptyMessage}</CommandItem>}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  )
}
