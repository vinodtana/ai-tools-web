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
  Users, 
  ExternalLink,
  Star,
  TrendingUp,
  Twitter,
  Linkedin,
  Youtube,
  ArrowRight,
  Crown,
  Award,
  MessageCircle,
  Globe
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchAIInfluencers } from "../store/features/contents/contentsSlice";

const AIInfluencers = () => {
const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPricing, setSelectedPricing] = useState("all");

  const { aiInfluencers, isLoading, pagination, aiCategories } = useAppSelector(
    (state: any) => state.content
  );
  console.log("aIArticles", aiInfluencers);
  console.log("aiCategories", aiCategories);

  useEffect(() => {
    // page, limit, search, type, status, isActive, categoryIds
    const jsonObj = { page: 1, limit: 50 };
    dispatch(fetchAIInfluencers(jsonObj));
  }, []);
  // Mock data for news
 


  const categories = ['All', 'Academic', 'Industry Expert', 'Content Creator', 'Developer'];


  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count?.toString();
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
                <span className="primary-gradient bg-clip-text text-transparent">AI Influencers</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Follow the most influential voices in artificial intelligence
              </p>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search influencers..."
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

            {/* Featured Influencers */}
            {selectedCategory === 'All' && searchTerm === '' && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  Top Influencers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiInfluencers?.map(influencer => (
                    <Card key={influencer.id} className="hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-500 group">
                      <CardHeader className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-muted/40 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Users className="h-10 w-10 text-primary" />
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Badge className="primary-gradient text-white">Top Influencer</Badge>
                          {influencer.verified && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              <Award className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {influencer.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{influencer.name}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{influencer.rating}</span>
                            <span className="text-muted-foreground">rating</span>
                          </div>

                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{formatFollowers(influencer.totalFollowers)}</div>
                            <div className="text-sm text-muted-foreground">Total Followers</div>
                          </div>

                          <div className="flex justify-center gap-4">
                            {influencer?.socialLinks?.twitter && (
                              <a href={influencer?.socialLinks?.twitter} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm">
                                  <Twitter className="h-4 w-4" />
                                </Button>
                              </a>
                            )}
                            {influencer?.socialLinks?.linkedin && (
                              <a href={influencer?.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm">
                                  <Linkedin className="h-4 w-4" />
                                </Button>
                              </a>
                            )}
                            {influencer?.socialLinks?.youtube && (
                              <a href={influencer?.socialLinks?.youtube} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm">
                                  <Youtube className="h-4 w-4" />
                                </Button>
                              </a>
                            )}
                          </div>

                          <Link to={`/ai-influencers/${influencer?.id}`}>
                            <Button className="w-full primary-gradient text-white hover:scale-105 transition-all duration-300">
                              View Profile
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* All Influencers */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedCategory === 'All' ? 'All Influencers' : `${selectedCategory} Influencers`}
                  <span className="text-muted-foreground ml-2">({aiInfluencers.length})</span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Sorted by followers
                </div>
              </div>

              <div className="space-y-6">
                {aiInfluencers?.map(influencer => (
                  <Card key={influencer.id} className="hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-muted/40 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <Users className="h-8 w-8 text-primary" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                  {influencer.name}
                                </h3>
                                {influencer.verified && (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                    <Award className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                                {influencer.featured && (
                                  <Badge className="primary-gradient text-white">Featured</Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground font-medium">{influencer.name}</p>
                              <Badge variant="secondary" className="mt-2 bg-primary/5 text-primary border-primary/20">
                                {influencer.tagline}
                              </Badge>
                            </div>

                            <div className="text-right">
                              <div className="flex items-center gap-1 text-sm mb-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{influencer.rating}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {influencer.engagement}% engagement
                              </div>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {influencer.bio}
                          </p>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {influencer?.recentTopics?.map(topic => (
                              <Badge key={topic} variant="secondary" className="text-xs bg-primary/5 text-primary border-primary/20">
                                {topic}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span className="font-medium">{formatFollowers(influencer.totalFollowers)}</span>
                                <span>followers</span>
                              </div>
                              
                              <div className="flex gap-3">
                                {influencer?.socialLinks?.twitter && (
                                  <div className="flex items-center gap-1">
                                    <Twitter className="h-4 w-4" />
                                    {formatFollowers(influencer?.followers?.twitter)}
                                  </div>
                                )}
                                {influencer?.socialLinks?.linkedin && (
                                  <div className="flex items-center gap-1">
                                    <Linkedin className="h-4 w-4" />
                                    {formatFollowers(influencer?.followers?.linkedin)}
                                  </div>
                                )}
                                {influencer?.socialLinks?.youtube && (
                                  <div className="flex items-center gap-1">
                                    <Youtube className="h-4 w-4" />
                                    {formatFollowers(influencer?.followers?.youtube)}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <div className="flex gap-1">
                                {influencer?.socialLinks?.twitter && (
                                  <a href={influencer?.socialLinks?.twitter} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm">
                                      <Twitter className="h-4 w-4" />
                                    </Button>
                                  </a>
                                )}
                                {influencer?.socialLinks?.linkedin && (
                                  <a href={influencer?.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm">
                                      <Linkedin className="h-4 w-4" />
                                    </Button>
                                  </a>
                                )}
                                {influencer?.socialLinks?.website && (
                                  <a href={influencer?.socialLinks?.website} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm">
                                      <Globe className="h-4 w-4" />
                                    </Button>
                                  </a>
                                )}
                              </div>
                              
                              <Link to={`/ai-influencers/${influencer.id}`}>
                                <Button className="primary-gradient text-white hover:scale-105 transition-all duration-300">
                                  View Profile
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {aiInfluencers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No influencers found</h3>
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

export default AIInfluencers;