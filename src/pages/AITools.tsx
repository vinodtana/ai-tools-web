import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pagination } from "antd";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

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
import {
  fetchAITools,
  fetchToolCategories,
} from "../store/features/contents/contentsSlice";
import { ITEMS_LIMIT } from "../config";

const AITools = () => {
  const { category_name } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPricing, setSelectedPricing] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    aiTools,
    isLoading,
    aiToolsPagination,
    aiCategories,
    toolCategories,
    promptCategories,
  } = useAppSelector((state: any) => state.content);
  console.log("aiTools", aiTools);
  console.log("aiToolsPagination", aiToolsPagination);
  console.log("toolCategories", toolCategories);
  console.log("selectedCategory", selectedCategory);
  console.log("category_name", category_name);

  useEffect(() => {
    // page, limit, search, type, status, isActive, categoryIds
    const jsonObj = { page: currentPage, limit: ITEMS_LIMIT };
    dispatch(fetchAITools(jsonObj));
    dispatch(
      fetchToolCategories({
        page: 1,
        limit: 100,
        search: searchQuery,
        type: "tools",
      })
    );
  }, []);

  useEffect(() => {
    getAllAIToolsList();
  }, [searchQuery, currentPage, selectedCategory]);
  useEffect(() => {
    if (category_name) {
      setSelectedCategory(category_name?.replace(/-/g, ' '));
    }
    getAllAIToolsList();
  }, [category_name]);
  const getAllAIToolsList = () => {
    const jsonObj = {
      page: currentPage,
      limit: ITEMS_LIMIT,
      search: searchQuery,
      category_name: selectedCategory,
    };
    dispatch(fetchAITools(jsonObj));
  };
  const handleChangeStatus = (e: any) => {
    setCurrentPage(e);
    // setStatus(e.value);
  };
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
        <div className="md:text-3xl max-w-6xl mx-auto">
          <h3 className="font-bold mb-4 text-center">Top Categories</h3>

          <div className="text-center">
            {toolCategories.map((category: any) => (
              <>
                {category?.tool_count > 50 && (
                  <Button
                    onClick={() => setSelectedCategory(category?.category_name)}
                    variant={
                      selectedCategory === category?.category_name
                        ? "default"
                        : "outline"
                    }
                    className="m-2 text-transform-capitalize"
                    key={category?.category_name}
                  >
                    {category?.category_name} ({category?.tool_count})
                  </Button>
                )}
              </>
            ))}
          </div>
        </div>
        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-6xl mx-auto mt-2 ">
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
              {toolCategories.map((category: any) => (
                <SelectItem
                  key={category?.category_name}
                  value={category?.category_name}
                >
                  {/* {selectedCategory === "all"
                    ? "All Categories"
                    : category?.name} */}
                  {category?.category_name} ({category?.tool_count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* <Select value={selectedPricing} onValueChange={setSelectedPricing}>
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
          </Select> */}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {aiTools?.map((tool, index) => (
            <Link
              target="_blank"
              to={`/ai-tools/${tool.name?.replace(/\s+/g, "-")}/${tool.id}`}
            >
              <Card
                key={tool.id}
                className="group hover:bg-transparent hover:border-primary-111 hover:shadow-2xl-111 transition-all-111 duration-500-111 animate-slide-up-111 overflow-hidden-111 hover:scale-105-111"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Tool Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <div className="text-6xl">
                      <img
                        src={
                          tool.bannerImage ||
                          tool?.bannerImageTemp ||
                          tool?.logoTemp
                        }
                        alt={tool?.name}
                        onClick={() => {
                          window.open(
                            `/ai-tools/${tool.name?.replace(/\s+/g, "-")}/${
                              tool.id
                            }`,
                            "_blank"
                          );
                        }}
                      />
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
                    <a
                      target="_blank"
                      href={`/ai-tools/${tool.name?.replace(/\s+/g, "-")}/${
                        tool.id
                      }`}
                      className="no-underline"
                    >
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {tool.name}
                      </h3>
                    </a>
                    <p className="text-muted-foreground text-sm font-medium mb-3">
                      {tool.tagline}
                    </p>
                    {tool?.companyName && (
                      <p className="text-muted-foreground text-sm font-medium mb-3">
                        {tool.companyName}
                      </p>
                    )}

                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {/* {tool.overview} */}
                      <p
                        className="truncate-3-lines"
                        dangerouslySetInnerHTML={{
                          __html: tool.overview,
                        }}
                      ></p>
                    </p>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.categoryNamesList
                      ?.slice(0, 2)
                      .map((category, catIndex) => (
                        <Badge
                          key={catIndex}
                          variant="secondary"
                          className="bg-primary/5 text-primary border-primary/20 text-xs"
                        >
                          {category}
                        </Badge>
                      ))}
                    {tool.categoryNamesList.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{tool.categoryNamesList?.length - 2}
                      </Badge>
                    )}
                  </div>
                  {tool?.planType && (
                    <p className="text-muted-foreground text-sm font-medium mb-3">
                      {tool.planType}
                    </p>
                  )}
                  {/* <div className="flex items-center justify-between pt-4 border-t border-primary/10 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{tool.users} users</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge className="primary-gradient text-white text-xs">
                      {tool.price}
                    </Badge>
                  </div>
                </div> */}

                  {/* View Details Button */}
                  <Button className="w-full group primary-gradient text-white hover:scale-105 transition-all duration-300">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="ai-summary-pagination max-w-6xl mx-auto">
          {/* <Pagination
              defaultCurrent={1}
              current={currentPage}
              total={aiToolsPagination?.total}
              onChange={(val) => {
                console.log("val", val);
                handleChangeStatus(val);
              }}
              pageSize={10}
              showSizeChanger={false}
              // size="small"
            /> */}
          {aiToolsPagination && (
            <div className="flex items-center justify-between ai-pagination-content mt-4">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                {(aiToolsPagination.page - 1) * aiToolsPagination.limit + 1} to{" "}
                {Math.min(
                  aiToolsPagination.page * aiToolsPagination.limit,
                  aiToolsPagination.total
                )}{" "}
                of {aiToolsPagination.total} results
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={aiToolsPagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <span className="text-sm">
                  Page {aiToolsPagination.page} of{" "}
                  {aiToolsPagination?.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={
                    aiToolsPagination.page >= aiToolsPagination?.totalPages
                  }
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
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
                setSelectedCategory("");
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
