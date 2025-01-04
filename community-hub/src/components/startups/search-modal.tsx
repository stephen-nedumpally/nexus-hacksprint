'use client';

import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  items: string[];
  selectedItems: string[];
  onSelect: (item: string) => void;
}

export function SearchModal({
  open,
  onOpenChange,
  title,
  items,
  selectedItems,
  onSelect,
}: SearchModalProps) {
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    if (search) {
      setFilteredItems(
        items.filter((item) =>
          item.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredItems(items);
    }
  }, [search, items]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[425px] gap-0 p-0">
        <DialogHeader className="px-4 pb-4 pt-5">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Command className="overflow-hidden rounded-t-none border-t">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <ScrollArea className="h-[300px]">
            <Command.List>
              {filteredItems.map((item) => (
                <Command.Item
                  key={item}
                  onSelect={() => {
                    onSelect(item);
                    setSearch('');
                  }}
                  className={`flex cursor-pointer items-center px-4 py-2 hover:bg-accent ${
                    selectedItems.includes(item)
                      ? 'bg-accent text-accent-foreground'
                      : ''
                  }`}
                >
                  {item}
                </Command.Item>
              ))}
            </Command.List>
          </ScrollArea>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
