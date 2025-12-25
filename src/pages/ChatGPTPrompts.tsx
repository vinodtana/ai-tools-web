import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import RightSidebar from "@/components/RightSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Copy,
  Heart,
  Star,
  TrendingUp,
  Clock,
  Tag,
  Filter,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import {
  fetchAIPromots,
  fetchPromptCategories,
  getAllContentLikesByUserId,
} from "../store/features/contents/contentsSlice";
import PromptCard from "@/components/PromtCard";

const ChatGPTPrompts = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPricing, setSelectedPricing] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    aIPromots,
    isLoading,
    pagination,
    aiCategories,
    promptCategories,
    user,
  } = useAppSelector((state: any) => state.content);
  console.log("aIPromots", aIPromots);
  console.log("promptCategories", promptCategories);

  useEffect(() => {
    // page, limit, search, type, status, isActive, categoryIds
    const jsonObj = { page: 1, limit: 50 };
    dispatch(fetchAIPromots(jsonObj));
    dispatch(
      fetchPromptCategories({
        page: 1,
        limit: 100,
        search: "",
        type: "prompts",
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
  // Mock data for prompts

  useEffect(() => {
    getAllAIToolsList();
  }, [searchQuery, currentPage, selectedCategory]);
  const getAllAIToolsList = () => {
    const jsonObj = {
      page: currentPage,
      limit: 100,
      search: searchQuery,
      category_name: selectedCategory,
    };
    dispatch(fetchAIPromots(jsonObj));
  };
  const [showAllCategories, setShowAllCategories] = useState(false);
  const categoriesToShow = showAllCategories
    ? promptCategories.filter((c: any) => c?.tool_count > 2)
    : promptCategories.filter((c: any) => c?.tool_count > 2).slice(0, 4);

  const totalCategories = promptCategories.filter(
    (c: any) => c?.tool_count > 2
  ).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8 text-center">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 inline-flex items-center gap-2">
                <span className="primary-gradient bg-clip-text text-transparent">
                  ChatGPT Prompts
                </span>
                <span className="text-lg md:text-xl text-muted-foreground font-normal">
                  - Discover and use the best ChatGPT prompts curated by the
                  community
                </span>
              </h1>
              <div className="md:text-3xl max-w-6xl mx-auto">
                <h3 className="font-bold mb-4">Top Categories</h3>

                <div className="text-center">
                  {categoriesToShow.map((category: any) => (
                    <Button
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === category?.category_name
                            ? ""
                            : category?.category_name
                        )
                      }
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

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mt-2 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search prompts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full sm:w-48 ">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {promptCategories.map((category: any) => (
                      <SelectItem
                        key={category?.category_name}
                        value={category?.category_name}
                      >
                        {/* {selectedCategory === "all"
                    ? "All Categories"
                    : category?.name} */}
                    <span className="text-sm text-muted-foreground text-transform-capitalize ">
                        {category?.category_name} ({category?.tool_count})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Featured Prompts */}
            {selectedCategory === "" && searchQuery === "" && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  Featured Prompts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aIPromots?.map((prompt, index) => (
                    <PromptCard prompt={prompt} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* All Prompts */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedCategory === "All"
                    ? "All Prompts"
                    : `${selectedCategory} Prompts`}
                  <span className="text-muted-foreground ml-2">
                    ({aIPromots?.length})
                  </span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Sorted by popularity
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aIPromots?.map((prompt, index) => (
                  <PromptCard prompt={prompt} index={index} newDesign={true} />
                ))}
              </div>

              {aIPromots?.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No prompts found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block w-80">
            <RightSidebar />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatGPTPrompts;
