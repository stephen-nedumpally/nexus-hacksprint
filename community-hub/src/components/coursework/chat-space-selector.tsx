'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ChatSpace } from '@/lib/types/chat';

interface ChatSpaceSelectorProps {
  spaces: ChatSpace[];
  selectedSpace: ChatSpace | null;
  onSelect: (space: ChatSpace) => void;
}

export function ChatSpaceSelector({
  spaces,
  selectedSpace,
  onSelect,
}: ChatSpaceSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedSpace ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                {selectedSpace.type === 'DM' && selectedSpace.members?.[0]?.avatarUrl && (
                  <AvatarImage src={selectedSpace.members[0].avatarUrl} />
                )}
                <AvatarFallback>
                  {selectedSpace.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{selectedSpace.displayName}</span>
              <Badge variant="secondary" className="ml-2">
                {selectedSpace.type}
              </Badge>
            </div>
          ) : (
            "Select a chat space..."
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search chat spaces..." />
          <CommandEmpty>No chat space found.</CommandEmpty>
          <CommandGroup>
            {spaces.map((space) => (
              <CommandItem
                key={space.name}
                onSelect={() => {
                  onSelect(space);
                  setOpen(false);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Avatar className="h-8 w-8">
                  {space.type === 'DM' && space.members?.[0]?.avatarUrl && (
                    <AvatarImage src={space.members[0].avatarUrl} />
                  )}
                  <AvatarFallback>
                    {space.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{space.displayName}</span>
                  <span className="text-xs text-muted-foreground">
                    {space.members?.length || 0} members
                  </span>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  {space.type}
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
