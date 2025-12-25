import { useState, useEffect, useRef } from "react";
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
  Heart,
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
  Mic,
} from "lucide-react";
import Layout from "@/components/Layout";
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  fetchAITools,
  fetchToolCategories,
  handleLikeContent,
  getAllContentLikesByUserId,
} from "../store/features/contents/contentsSlice";
import { ITEMS_LIMIT } from "../config";
import Loader from "@/components/Common/Loader";
import ToolCard from "@/components/ToolCard";

const AITools = () => {
  const { category_name } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPricing, setSelectedPricing] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const lastFetchRef = useRef<any>(null);
  const {
    aiTools,
    isLoading,
    aiToolsPagination,
    aiCategories,
    toolCategories,
    promptCategories,
    user,
    userContentLikes,
  } = useAppSelector((state: any) => state.content);
  // const { user } = useAppSelector((state: any) => state.auth);
  console.log("aiTools", aiTools);
  console.log("aiToolsPagination", aiToolsPagination);
  console.log("toolCategories", toolCategories);
  console.log("selectedCategory", selectedCategory);
  console.log("category_name", category_name);
  console.log("userContentLikes", userContentLikes);

  useEffect(() => {
    // page, limit, search, type, status, isActive, categoryIds
    const jsonObj = { page: currentPage, limit: ITEMS_LIMIT };
    lastFetchRef.current?.abort?.();
    lastFetchRef.current = dispatch(fetchAITools(jsonObj));
    dispatch(
      fetchToolCategories({
        page: 1,
        limit: 100,
        search: searchQuery,
        type: "tools",
      })
    );
    if (user?.id) {
      dispatch(
        getAllContentLikesByUserId({
          user_id: user?.id,
        })
      );
    }
  }, []);

  useEffect(() => {
    setSearchQuery("");
    getAllAIToolsList("");
  }, [ selectedCategory]);
   useEffect(() => {
    getAllAIToolsList();
  }, [currentPage]);
  useEffect(() => {
    const timer = setTimeout(() => {
      getAllAIToolsList();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (category_name) {
      setSelectedCategory(category_name?.replace(/-/g, " "));
    }
    getAllAIToolsList();
  }, [category_name]);
  const getAllAIToolsList = (searchvv?: string) => {
    const jsonObj = {
      page: currentPage,
      limit: ITEMS_LIMIT,
      search:  searchvv || searchQuery || "",
      category_name: selectedCategory,
      user_id: user?.id || ""
    };
    lastFetchRef.current?.abort?.();
    lastFetchRef.current = dispatch(fetchAITools(jsonObj));
  };

  const startVoiceSearch = () => {
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
        setSearchQuery(transcript);
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
  const handleChangeStatus = (e: any) => {
    setCurrentPage(e);
    // setStatus(e.value);
  };
  // Mock data - in real app this would come from API

  const pricingOptions = ["all", "Free", "Freemium", "Paid"];
  console.log("aiToolsaiTools", aiTools);

  const [showAllCategories, setShowAllCategories] = useState(false);
  const categoriesToShow = showAllCategories
    ? toolCategories.filter((c: any) => c?.tool_count > 50)
    : toolCategories.filter((c: any) => c?.tool_count > 50).slice(0, 5);

  const totalCategories = toolCategories.filter(
    (c: any) => c?.tool_count > 50
  ).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {loading && <Loader />}
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 inline-flex items-center gap-2">
            <span className="primary-gradient bg-clip-text text-transparent">
              AI Tools
            </span>
            <span className="text-lg md:text-xl text-muted-foreground font-normal">
              - Discover the best AI tools for every use case.
            </span>
          </h1>
        </div>
        <div className="md:text-3xl max-w-6xl mx-auto">
          <h3 className="font-bold mb-4 text-center">Top Categories</h3>

          <div className="text-center">
            {categoriesToShow.map((category: any) => (
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
            ))}
            {totalCategories > 5 && (
              <Button
                onClick={() => setShowAllCategories(!showAllCategories)}
                variant="ghost"
                className="m-2 text-primary hover:text-primary/80"
              >
                {showAllCategories ? "Show Less" : "View All Categories"}
              </Button>
            )}
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
              className="pl-9 pr-10 h-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={startVoiceSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2"
              aria-label="Start voice search"
            >
              <Mic className={`h-4 w-4 ${isListening ? "text-primary" : "text-muted-foreground"}`} />
            </Button>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 h-12">
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
                 <span className="text-sm text-muted-foreground text-transform-capitalize ">{category?.category_name} ({category?.tool_count})</span>
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
          {aiTools?.map((tool, index) => {
            console.log("tool parent", tool);
            return <ToolCard tool={tool} index={index} />;
          })}
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
          {aiToolsPagination && aiToolsPagination?.total > 0 && (
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
