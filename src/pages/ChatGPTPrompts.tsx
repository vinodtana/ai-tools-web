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
} from "../store/features/contents/contentsSlice";

const ChatGPTPrompts = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPricing, setSelectedPricing] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { aIPromots, isLoading, pagination, aiCategories, promptCategories } =
    useAppSelector((state: any) => state.content);
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
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8 text-center">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-4">
                <span className="primary-gradient bg-clip-text text-transparent">
                  ChatGPT Prompts
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover and use the best ChatGPT prompts curated by the
                community
              </p>
              <div className="md:text-3xl max-w-6xl mx-auto">
                <h3 className="font-bold mb-4">Top Categories</h3>

                <div className="text-center">
                  {promptCategories.map((category: any) => (
                    <>
                      {category?.tool_count > 2 && (
                        <Button
                          onClick={() =>
                            setSelectedCategory(category?.category_name)
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
                      )}
                    </>
                  ))}
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
                    className="pl-10"
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full sm:w-48">
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
                        {category?.category_name} ({category?.tool_count})
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
                  {aIPromots?.map((prompt) => (
                    <Link
                      to={`/chatgpt-prompts/${prompt?.name?.replace(
                        /\s+/g,
                        "-"
                      )}/${prompt.id}`}
                    >
                      <Card
                        key={prompt.id}
                        className="hover:border-primary hover:shadow-2xl hover:scale-105-111 transition-all duration-500 group"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <Badge className="primary-gradient text-white mb-2">
                              Featured
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {prompt.rating}
                            </div>
                          </div>
                          <Link
                            to={`/chatgpt-prompts/${prompt?.name?.replace(
                              /\s+/g,
                              "-"
                            )}/${prompt.id}`}
                            className="flex-1"
                          >
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {prompt.name}
                            </CardTitle>
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {" "}
                            <p
                              className="truncate-3-lines"
                              dangerouslySetInnerHTML={{
                                __html: prompt.overview,
                              }}
                            ></p>
                          </p>
                        </CardHeader>
                        <CardContent>
                          {/* <div className="flex flex-wrap gap-1 mb-4">
                          {prompt?.categoryNamesList?.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-primary/5 text-primary border-primary/20">
                              {tag}
                            </Badge>
                          ))}
                        </div> */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {prompt.categoryNamesList
                              ?.slice(0, 2)
                              ?.map((category, catIndex) => (
                                <Badge
                                  key={catIndex}
                                  variant="secondary"
                                  className="bg-primary/5 text-primary border-primary/20 text-xs"
                                >
                                  {category}
                                </Badge>
                              ))}
                            {prompt?.categoryNamesList?.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{prompt?.categoryNamesList?.length - 2}
                              </Badge>
                            )}
                          </div>

                          {/* <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {prompt.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <Copy className="h-4 w-4" />
                              {prompt.uses}
                            </div>
                          </div>
                          <span className="text-xs">by {prompt.author}</span>
                        </div> */}

                          <Link
                            to={`/chatgpt-prompts/${prompt?.name?.replace(
                              /\s+/g,
                              "-"
                            )}/${prompt.id}`}
                          >
                            <Button className="w-full primary-gradient text-white hover:scale-105 transition-all duration-300">
                              View Prompt
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </Link>
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
                {aIPromots?.map((prompt) => (
                  <Link
                    to={`/chatgpt-prompts/${prompt?.name}/${prompt.id}`}
                    className="flex-1"
                  >
                    <Card
                      key={prompt.id}
                      className="hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                    >
                      <CardHeader>
                        {/* <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">
                            {prompt.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {prompt.rating}
                          </div>
                        </div>
                        {prompt.featured && (
                          <Badge className="primary-gradient text-white">Featured</Badge>
                        )}
                      </div> */}
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {prompt.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {" "}
                          <p
                            className="truncate-3-lines"
                            dangerouslySetInnerHTML={{
                              __html: prompt.overview,
                            }}
                          ></p>
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {prompt.categoryNamesList
                            ?.slice(0, 4)
                            ?.map((category, catIndex) => (
                              <Badge
                                key={catIndex}
                                variant="secondary"
                                className="bg-primary/5 text-primary border-primary/20 text-xs"
                              >
                                {category}
                              </Badge>
                            ))}
                          {prompt?.categoryNamesList?.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{prompt?.categoryNamesList?.length - 4}
                            </Badge>
                          )}
                        </div>
                        <div className="bg-muted/30 p-3 rounded-lg mb-4 text-sm">
                          <p className="line-clamp-2 text-muted-foreground">
                            {prompt.prompt}
                          </p>
                        </div>

                        {/* <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {prompt.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {prompt.uses} uses
                          </div>
                        </div>
                        <span className="text-xs">by {prompt.author}</span>
                      </div> */}

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Link
                            to={`/chatgpt-prompts/${prompt?.name}/${prompt.id}`}
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              className="w-full primary-gradient text-white"
                            >
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
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
