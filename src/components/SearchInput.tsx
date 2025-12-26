import { useState } from "react";
import { Search, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export const SearchInput = ({
  value,
  onChange,
  onSearch,
  className = "",
  placeholder = "Search AI tools for design, coding, marketing, sales…",
}: SearchInputProps) => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);

  const startVoiceSearch = () => {
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast({
          title: "Voice search not supported",
        description: "Please use a supported browser like Chrome or Edge.",
          variant: "destructive",
        });
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event?.results?.[0]?.[0]?.transcript || "";
        onChange(transcript);
        onSearch?.(transcript);
      };
      recognition.onerror = () => {
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch?.(value);
    }
  };

  return (
    <div className={`relative ${className}`}>
            {/* titlassName="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /> */}
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-9 pr-10 h-12 w-full"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={startVoiceSearch}
        className="absolute rig        onChange(transcript);
        onSearch?.(transcript);
      }"
      >
        {isListening ? (
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-primary/50 opacity-75"></span>
            <Mic className="h-4 w-4 text-primary relative z-10" />
          </div>
        ) : (
          <Mic className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
};
