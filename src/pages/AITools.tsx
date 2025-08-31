import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  Search,
  Filter,
  ExternalLink,
  Users,
  ArrowRight,
} from "lucide-react";
import Layout from "@/components/Layout";
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchAITools } from "../store/features/contents/contentsSlice";
const AITools = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPricing, setSelectedPricing] = useState("all");

  const { aiTools, isLoading, pagination, aiCategories } = useAppSelector(
    (state: any) => state.content
  );
  console.log("aiTools", aiTools);
  console.log("aiCategories", aiCategories);

  useEffect(() => {
    // page, limit, search, type, status, isActive, categoryIds
    const jsonObj = { page: 1, limit: 50 };
    dispatch(fetchAITools(jsonObj));
  }, []);
  // Mock data - in real app this would come from API

  const pricingOptions = ["all", "Free", "Freemium", "Paid"];

 
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="primary-gradient bg-clip-text text-transparent">
              AI Tools
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the best AI tools for every use case. From conversational
            AI to image generation, find the perfect tool to boost your
            productivity.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search AI tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {aiCategories.map((category: any) => (
                <SelectItem key={category?.id} value={category?.id}>
                  {selectedCategory === "all"
                    ? "All Categories"
                    : category?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPricing} onValueChange={setSelectedPricing}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Pricing" />
            </SelectTrigger>
            <SelectContent>
              {pricingOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === "all" ? "All Pricing" : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {aiTools?.map((tool, index) => (
            <Card
              key={tool.id}
              className="group hover:bg-transparent hover:border-primary hover:shadow-2xl transition-all duration-500 animate-slide-up overflow-hidden hover:scale-105"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Tool Image */}
              <div className="relative h-48 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <div className="text-6xl">
                    <img src={tool.bannerImage} alt={tool?.name} onClick={()=>{window.open(`/ai-tools/${tool.name?.replace(/\s+/g, '-')}/${tool.id}`, "_blank")}} />
              
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-primary/20 transition-all duration-500"></div>
                <div className="absolute top-4 right-4">
                  <Badge className="primary-gradient text-white shadow-lg">
                    <Star className="h-3 w-3 mr-1" />
                    {tool.rating}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <a target="_blank" href={`/ai-tools/${tool.name?.replace(/\s+/g, '-')}/${tool.id}`} className="no-underline">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  </a>
                  <p className="text-muted-foreground text-sm font-medium mb-3">
                    {tool.tagline}
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {/* {tool.overview} */}
                     <p className="truncate-3-lines"
                                  dangerouslySetInnerHTML={{
                                    __html: tool.overview,
                                  }}
                                ></p>
                   
                  </p>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.category_names?.slice(0, 2).map((category, catIndex) => (
                    <Badge
                      key={catIndex}
                      variant="secondary"
                      className="bg-primary/5 text-primary border-primary/20 text-xs"
                    >
                      {category}
                    </Badge>
                  ))}
                  {tool.categories.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{tool.categories?.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-primary/10 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{tool.users} users</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge className="primary-gradient text-white text-xs">
                      {tool.price}
                    </Badge>
                  </div>
                </div>

                {/* View Details Button */}
                <Link target="_blank" to={`/ai-tools/${tool.name?.replace(/\s+/g, '-')}/${tool.id}`}>
                  <Button className="w-full group primary-gradient text-white hover:scale-105 transition-all duration-300">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {aiTools?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No tools found matching your criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedPricing("all");
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AITools;
