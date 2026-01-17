import { useState } from "react";
import { languages } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Check } from "lucide-react";

type LanguageSelectorProps = {
  currentLanguage: string;
  onSelect: (languageId: string) => void;
};

export function LanguageSelector({
  currentLanguage,
  onSelect,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);

  // Get language info from API (in a real app you might want to fetch this)
  const { data: languageOptions } = useQuery({
    queryKey: ["/api/languages"],
    initialData: languages,
  });

  const selectedLanguage =
    languageOptions.find(lang => lang.id === currentLanguage) ||
    languageOptions[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-sm rounded-lg px-3 py-1.5 h-auto bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
        >
          <i className={`${selectedLanguage.icon} ${selectedLanguage.iconColor} text-base`}></i>
          <span className="font-medium text-foreground">
            {selectedLanguage.name}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-1.5 glass border-white/10" align="start">
        <div className="space-y-0.5">
          {languageOptions.map(language => (
            <button
              key={language.id}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center transition-all duration-200 ${
                language.id === currentLanguage
                  ? "bg-gradient-to-r from-violet-500/15 to-purple-500/15 border border-violet-500/20 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
              onClick={() => {
                onSelect(language.id);
                setOpen(false);
              }}
            >
              <i className={`${language.icon} ${language.iconColor} mr-2.5 text-base`}></i>
              <span className="flex-1 font-medium">{language.name}</span>
              {language.id === currentLanguage && (
                <Check className="w-4 h-4 text-violet-400" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
