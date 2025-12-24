import ToolCard from "@/components/ToolCard";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

const FeaturedToolsSection = ({ tools }: { tools: any[] }) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/30 text-primary bg-primary/5">
            <Sparkles className="h-3 w-3 mr-2" />
            Featured Collection
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured AI Tools
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hand-picked AI tools to supercharge your productivity and creativity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools?.map((tool, index) => (
            <ToolCard key={tool.id || index} tool={tool} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedToolsSection;
