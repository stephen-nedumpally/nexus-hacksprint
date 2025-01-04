import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { isSkillInOtherLevels } from "@/lib/validations";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { allSkills } from "@/data/skills-data";

// Combine tech stack and skills into a single array
// const allSkills = Array.from(
//   new Set([
//     ...techStack.languages,
//     ...techStack.frameworks,
//     ...techStack.databases,
//     ...techStack.tools,
//     ...techStack.platforms,
//   ])
// ).sort();

interface SkillSelectorProps {
  level: "advanced" | "intermediate" | "beginner";
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  advancedSkills: string[];
  intermediateSkills: string[];
  beginnerSkills: string[];
}

export function SkillSelector({
  level,
  selectedSkills,
  onSkillsChange,
  advancedSkills,
  intermediateSkills,
  beginnerSkills,
}: SkillSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const filteredSkills = allSkills.filter((skill) =>
    skill.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      toast({
        title: "Skill already added",
        variant: "destructive",
      });
      return;
    }

    if (selectedSkills.length >= 5) {
      toast({
        title: "Maximum 5 skills allowed",
        variant: "destructive",
      });
      return;
    }

    if (
      isSkillInOtherLevels(
        skill,
        level,
        advancedSkills,
        intermediateSkills,
        beginnerSkills
      )
    ) {
      toast({
        title: "Skill already exists in another level",
        description: "A skill can only be added to one proficiency level.",
        variant: "destructive",
      });
      return;
    }

    onSkillsChange([...selectedSkills, skill]);
    setOpen(false);
  };

  const handleRemove = (skillToRemove: string) => {
    onSkillsChange(selectedSkills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={selectedSkills.length >= 5}
          >
            {selectedSkills.length === 0
              ? "Select skills..."
              : `${selectedSkills.length}/5 skills selected`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search skills..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No skills found.</CommandEmpty>
              <CommandGroup>
                {filteredSkills.map((skill) => (
                  <CommandItem
                    key={skill}
                    value={skill}
                    onSelect={() => handleSelect(skill)}
                  >
                    {skill}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {selectedSkills.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="px-3 py-1 space-x-2"
          >
            <span>{skill}</span>
            <button
              onClick={() => handleRemove(skill)}
              className="hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
