import { useState , useEffect} from 'react';
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
  User,
  BookOpen,
  TrendingUp,
  Eye,
  Star,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchAIArticles } from "../store/features/contents/contentsSlice";

const AIArticles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPricing, setSelectedPricing] = useState("all");

  const { aIArticles, isLoading, pagination, aiCategories } = useAppSelector(
    (state: any) => state.content
  );
  console.log("aIArticles", aIArticles);
  console.log("aiCategories", aiCategories);

  useEffect(() => {
    // page, limit, search, type, status, isActive, categoryIds
    const jsonObj = { page: 1, limit: 50 };
    dispatch(fetchAIArticles(jsonObj));
  }, []);
  // Mock data for articles


  const categories = ['All', 'Technology', 'Ethics', 'Tutorial', 'Industry', 'Technical', 'Healthcare'];


  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-4">
                <span className="primary-gradient bg-clip-text text-transparent">AI Articles</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                In-depth articles, tutorials, and insights about artificial intelligence
              </p>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search articles..."
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

            {/* Featured Articles */}
            {selectedCategory === 'All' && searchTerm === '' && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  Featured Articles
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {aIArticles?.slice(0, 2)?.map(article => (
                    <Card key={article.id} className="hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-500 group overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-muted/20 flex items-center justify-center">
                        {/* <BookOpen className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" /> */}
                        <img src={article.bannerImage} className="h-full w-full object-cover"/>
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="primary-gradient text-white">Featured</Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {article.rating}
                          </div>
                        </div>
                        <Badge variant="secondary" className="w-fit mb-2 bg-primary/5 text-primary border-primary/20">
                          {article.category}
                        </Badge>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {article.name}
                        </CardTitle>
                        <p className='truncate-3-lines'
                                  dangerouslySetInnerHTML={{
                                    __html: article.overview,
                                  }}
                                ></p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {article?.tags?.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-primary/5 text-primary border-primary/20">
                              {tag}
                            </Badge>
                          ))}
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

                        <Link to={`/ai-articles/${article?.name?.replace(/\s+/g, '-')}/${article.id}`}>
                          <Button className="w-full primary-gradient text-white hover:scale-105 transition-all duration-300">
                            Read Article
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* All Articles */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedCategory === 'All' ? 'Latest Articles' : `${selectedCategory} Articles`}
                  <span className="text-muted-foreground ml-2">({aIArticles.length})</span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Sorted by date
                </div>
              </div>

              <div className="space-y-6">
                {aIArticles?.map(article => (
                  <Card key={article.id} className="hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">
                              {article.category}
                            </Badge>
                            {article.featured && (
                              <Badge className="primary-gradient text-white">Featured</Badge>
                            )}
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {article.rating}
                            </div>
                          </div>

                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {article.name}
                          </h3>
                          <p className='truncate-3-lines'
                                  dangerouslySetInnerHTML={{
                                    __html: article.overview,
                                  }}
                                ></p>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {article?.tags?.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs bg-primary/5 text-primary border-primary/20">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {article.author}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(article?.publishDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {article.readTime}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {article?.views?.toLocaleString()}
                              </div>
                            </div>

                            <Link to={`/ai-articles/${article?.name?.replace(/\s+/g, '-')}/${article.id}`}>
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
                ))}
              </div>

              {aIArticles.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No articles found</h3>
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

export default AIArticles;