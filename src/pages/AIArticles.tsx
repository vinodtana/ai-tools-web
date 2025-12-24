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
  Calendar,
  Clock,
  User,
  BookOpen,
  TrendingUp,
  Eye,
  Star,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  fetchAIArticles,
  fetchArticleCategories,
} from "../store/features/contents/contentsSlice";

const AIArticles = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPricing, setSelectedPricing] = useState("all");

  const { aIArticles, isLoading, pagination, articleCategories } =
    useAppSelector((state: any) => state.content);
  console.log("aIArticles", aIArticles);
  console.log("articleCategories", articleCategories);

  useEffect(() => {
    // page, limit, search, type, status, isActive, categoryIds
    const jsonObj = { page: 1, limit: 50 };
    dispatch(fetchAIArticles(jsonObj));
    dispatch(
      fetchArticleCategories({
        page: 1,
        limit: 100,
        search: searchQuery,
        type: "articles",
      })
    );
  }, []);

  useEffect(() => {
    getAllAIToolsList();
  }, [searchQuery, selectedCategory]);
  const getAllAIToolsList = () => {
    const jsonObj = {
      page: 1,
      limit: 100,
      search: searchQuery,
      category_name: selectedCategory,
    };
    dispatch(fetchAIArticles(jsonObj));
  };
  // Mock data for articles

  const [showAllCategories, setShowAllCategories] = useState(false);
  const categoriesToShow = showAllCategories
    ? articleCategories.filter((c: any) => c?.tool_count > 2)
    : articleCategories.filter((c: any) => c?.tool_count > 2).slice(0, 4);

  const totalCategories = articleCategories.filter(
    (c: any) => c?.tool_count > 2
  ).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 inline-flex items-center gap-2">
                <span className="primary-gradient bg-clip-text text-transparent">
                  AI Articles
                </span>
                <span className="text-lg md:text-xl text-muted-foreground font-normal">
                  - In-depth articles, tutorials, and insights about artificial
                  intelligence
                </span>
              </h1>
              <div className="md:text-3xl max-w-6xl mx-auto">
                <h3 className="font-bold mb-4 text-center">Top Categories</h3>

                <div className="text-center">
                  {categoriesToShow.map((category: any) => (
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
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                {/* <div className="flex gap-2 flex-wrap">
                  {articleCategories?.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "primary-gradient text-white" : ""}
                    >
                      {category}
                    </Button>
                  ))}
                </div> */}
              </div>
            </div>

            {/* Featured Articles */}
            {selectedCategory === "" && searchQuery === "" && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  Featured Articles
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {aIArticles?.slice(0, 2)?.map((article) => (
                    <Link
                      to={`/ai-articles/${article?.name?.replace(
                        /\s+/g,
                        "-"
                      )}/${article.id}`}
                    >
                      <Card
                        key={article.id}
                        className="hover:border-primary-111 hover:shadow-2xl hover:scale-105-111 transition-all duration-500-111 group overflow-hidden"
                      >
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-muted/20 flex items-center justify-center">
                          {/* <BookOpen className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" /> */}
                          <img
                            src={
                              article?.bannerImage ||
                              article?.bannerImageTemp ||
                              article.logo ||
                              article?.logoTemp
                            }
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="primary-gradient text-white">
                              Featured
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {article.rating}
                            </div>
                          </div>
                          {/* <Badge variant="secondary" className="w-fit mb-2 bg-primary/5 text-primary border-primary/20">
                          {article.category}
                        </Badge> */}
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {article.name}
                          </CardTitle>
                          <p
                            className="truncate-3-lines"
                            dangerouslySetInnerHTML={{
                              __html: article.overview,
                            }}
                          ></p>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {article.categoryNamesList
                              ?.slice(0, 3)
                              .map((category, catIndex) => (
                                <Badge
                                  key={catIndex}
                                  variant="secondary"
                                  className="bg-primary/5 text-primary border-primary/20 text-xs"
                                >
                                  {category}
                                </Badge>
                              ))}
                            {article.categoryNamesList.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{article.categoryNamesList?.length - 3}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {article.author}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {article.readTime}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {article?.views?.toLocaleString()}
                            </div>
                          </div>

                          <Link
                            to={`/ai-articles/${article?.name?.replace(
                              /\s+/g,
                              "-"
                            )}/${article.id}`}
                          >
                            <Button className="w-full primary-gradient text-white hover:scale-105 transition-all duration-300">
                              Read Article
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

            {/* All Articles */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedCategory === "All"
                    ? "Latest Articles"
                    : `${selectedCategory} Articles`}
                  <span className="text-muted-foreground ml-2">
                    ({aIArticles.length})
                  </span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Sorted by date
                </div>
              </div>

              <div className="space-y-6">
                {aIArticles?.map((article) => (
                  <Link
                    to={`/ai-articles/${article?.name?.replace(/\s+/g, "-")}/${
                      article.id
                    }`}
                  >
                    <Card
                      key={article.id}
                      className="hover:border-primary-1111 hover:shadow-2xl-111 hover:scale-105 transition-all-111 duration-300 group"
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              {/* <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">
                              {article.category}
                            </Badge> */}
                              {/* {article.featured && ( */}
                              <Badge className="primary-gradient text-white">
                                Featured
                              </Badge>
                              {/* )} */}
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                {article.rating}
                              </div>
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                              {article.name}
                            </h3>
                            <p
                              className="truncate-3-lines"
                              dangerouslySetInnerHTML={{
                                __html: article.overview,
                              }}
                            ></p>

                            <div className="flex flex-wrap gap-2 mt-4 mb-4">
                              {article?.categoryNamesList
                                ?.slice(0, 3)
                                .map((category, catIndex) => (
                                  <Badge
                                    key={catIndex}
                                    variant="secondary"
                                    className="bg-primary/5 text-primary border-primary/20 text-xs"
                                  >
                                    {category}
                                  </Badge>
                                ))}
                              {article?.categoryNamesList?.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{article.categoryNamesList?.length - 3}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {/* <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {article.author}
                              </div> */}
                                {/* <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(article?.publishDate).toLocaleDateString()}
                              </div> */}
                                {/* <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {article.readTime}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {article?.views?.toLocaleString()}
                              </div> */}
                              </div>

                              <Link
                                to={`/ai-articles/${article?.name?.replace(
                                  /\s+/g,
                                  "-"
                                )}/${article.id}`}
                              >
                                <Button className="primary-gradient text-white hover:scale-105 transition-all duration-300">
                                  Read More
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>

                          <div className="w-32 h-24 bg-gradient-to-br from-primary/10 to-muted/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BookOpen className="h-8 w-8 text-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <br />
                  </Link>
                ))}
              </div>

              {aIArticles.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No articles found
                  </h3>
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

export default AIArticles;
