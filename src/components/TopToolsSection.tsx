import ToolCard from "@/components/ToolCard";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import ToolCardSkeleton from "@/components/ToolCardSkeleton";

const TopToolsSection = ({ tools, searchQuery, aiTools, loading }: { tools: any[]; searchQuery: string; aiTools: any[]; loading: boolean }) => {

  const display_tools = searchQuery!==""?aiTools: tools;
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        
        {loading? <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[...Array(9)].map((_, index) => (
              <ToolCardSkeleton key={index} />
            ))} </div>:
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {display_tools?.map((tool, index) => (
            <ToolCard key={tool.id || index} tool={tool} index={index} />
          ))}
        </div>
        }
      </div>
    </section>
  );
};

export default TopToolsSection;
