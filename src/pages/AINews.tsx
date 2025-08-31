import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import RightSidebar from '@/components/RightSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Calendar, 
  Clock, 
  ExternalLink,
  TrendingUp,
  Newspaper,
  Share2,
  Bookmark,
  ArrowRight,
  AlertCircle,
  Zap
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchAINews } from "../store/features/contents/contentsSlice";

const AINews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPricing, setSelectedPricing] = useState("all");

  const { aINews, isLoading, pagination, aiCategories } = useAppSelector(
    (state: any) => state.content
  );
  console.log("aIArticles", aINews);
  console.log("aiCategories", aiCategories);

  useEffect(() => {
    // page, limit, search, type, status, isActive, categoryIds
    const jsonObj = { page: 1, limit: 50 };
    dispatch(fetchAINews(jsonObj));
  }, []);
  // Mock data for news
 

  const categories = ['All', 'Product Launch', 'Research', 'Regulation', 'Funding', 'Product Update'];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-4">
                <span className="primary-gradient bg-clip-text text-transparent">AI News</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Stay updated with the latest developments in artificial intelligence
              </p>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search news..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map(category => (
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
                </div>
              </div>
            </div>

            {/* Breaking News */}
            {aINews?.length > 0 && selectedCategory === 'All' && searchTerm === '' && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                  Breaking News
                </h2>
                <div className="space-y-4">
                  {aINews?.map(item => (
                    <Card key={item.id} className="hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-500 group border-red-200 dark:border-red-800">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge className="bg-red-500 text-white">Breaking</Badge>
                              <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">
                                {item.category}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {formatTimeAgo(item.createdAt)}
                              </div>
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {item.tagline}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{item.source}</span>
                                <span>by {item.author}</span>
                                <span>{item.readTime}</span>
                              </div>

                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Share
                                </Button>
                                <Button size="sm" className="primary-gradient text-white" asChild>
                                  <a href={item.newslink} target="_blank" rel="noopener noreferrer">
                                    Read Full Story
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="w-32 h-24 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Newspaper className="h-8 w-8 text-red-600 dark:text-red-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Trending News */}
            {aINews.length > 0 && selectedCategory === 'All' && searchTerm === '' && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Trending News
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aINews.slice(0, 4).map(item => (
                    <Card key={item.id} className="hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-500 group">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-muted/20 flex items-center justify-center">
                        <Newspaper className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-orange-500 text-white">
                            <Zap className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                          <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">
                            {item.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {item.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.tagline}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item?.tags?.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-primary/5 text-primary border-primary/20">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <span>{item.source}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(item.createdAt)}</span>
                          </div>
                          <span>{item.readTime}</span>
                        </div>

                        <Button className="w-full primary-gradient text-white hover:scale-105 transition-all duration-300" asChild>
                          <a href={item.newslink} target="_blank" rel="noopener noreferrer">
                            Read Article
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* All News */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedCategory === 'All' ? 'Latest News' : `${selectedCategory} News`}
                  <span className="text-muted-foreground ml-2">({aINews.length})</span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Sorted by date
                </div>
              </div>

              <div className="space-y-6">
                {aINews.map(item => (
                  <Card key={item.id} className="hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">
                              {item.category}
                            </Badge>
                            {item.isBreaking && (
                              <Badge className="bg-red-500 text-white">Breaking</Badge>
                            )}
                            {item.trending && (
                              <Badge className="bg-orange-500 text-white">
                                <Zap className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {formatTimeAgo(item.createdAt)}
                            </div>
                          </div>

                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {item.tagline}
                          </p>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {item?.tags?.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs bg-primary/5 text-primary border-primary/20">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{item.source}</span>
                              {item.authorBy && (
                                <span>by {item.authorBy}</span>
                              )}
                             
                              <span>{item.readTime}</span>
                            </div>

                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Bookmark className="h-4 w-4 mr-2" />
                                Save
                              </Button>
                              <Button size="sm" className="primary-gradient text-white" asChild>
                                <a href={item.newslink} target="_blank" rel="noopener noreferrer">
                                  Read More
                                  <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="w-32 h-24 bg-gradient-to-br from-primary/10 to-muted/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Newspaper className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {aINews.length === 0 && (
                <div className="text-center py-12">
                  <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No news found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
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

export default AINews;