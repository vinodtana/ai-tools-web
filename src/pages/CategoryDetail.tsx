import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Star, 
  ExternalLink, 
  Users, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  Tag,
  Building,
  Calendar,
  Award
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/Layout';
import RightSidebar from '@/components/RightSidebar';
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchACategoryDetails } from "../store/features/contents/contentsSlice";
import { useState, useEffect } from "react";
const CategoryDetail = () => {
  const { name, id } = useParams();
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
  console.log("name", name);
  console.log("aiCategories", aiCategories);

  useEffect(() => {
    // page, limit, search, type, status, isActive, categoryIds
    const jsonObj = { page: 1, limit: 50 };
    dispatch(fetchACategoryDetails(id));
  }, []);
  // Mock category data
  const category = {
    id: parseInt(id || '1'),
    name: 'Conversational AI',
    description: 'AI tools designed for natural language conversations, customer support, and interactive communication.',
    fullDescription: `Conversational AI represents one of the most transformative categories in artificial intelligence, focusing on creating systems that can understand, process, and respond to human language in a natural and meaningful way. These tools are revolutionizing how businesses interact with customers, how individuals access information, and how we communicate with technology.

The category encompasses a wide range of applications, from sophisticated chatbots that handle customer service inquiries to advanced virtual assistants that can help with complex tasks. Modern conversational AI systems leverage natural language processing (NLP), machine learning, and deep learning to understand context, intent, and nuance in human communication.

Key technological foundations include natural language understanding (NLU), natural language generation (NLG), dialogue management, and sentiment analysis. These systems can handle multiple languages, understand colloquial expressions, maintain context across extended conversations, and even detect emotional undertones.

The business impact of conversational AI is substantial, with organizations seeing improvements in customer satisfaction, reduced response times, 24/7 availability, and significant cost savings in customer support operations.`,
    icon: '🤖',
    color: 'blue',
    toolCount: 24,
    totalUsers: '150M+',
    avgRating: 4.6,
    featured: true,
    trending: true,
    useCases: [
      'Customer Support',
      'Virtual Assistants',
      'Sales Automation',
      'Content Creation',
      'Language Translation',
      'Educational Tutoring',
      'Mental Health Support',
      'E-commerce Assistance'
    ],
    keyFeatures: [
      'Natural Language Processing',
      'Multi-language Support',
      'Context Awareness',
      'Sentiment Analysis',
      'Voice Integration',
      'Real-time Responses',
      'Learning Capabilities',
      'API Integration'
    ],
    industries: [
      'E-commerce',
      'Healthcare',
      'Education',
      'Financial Services',
      'Travel & Hospitality',
      'Technology',
      'Media & Entertainment',
      'Government'
    ],
    marketStats: {
      growth: '+45%',
      marketSize: '$24.3B',
      projectedGrowth: '$80.7B by 2030',
      adoptionRate: '67%'
    }
  };

  // Mock tools data for this category
  const categoryTools = [
    {
      id: 1,
      name: 'ChatGPT',
      company: 'OpenAI',
      tagline: 'Advanced AI conversational assistant',
      logo: '🤖',
      rating: 4.8,
      users: '100M+',
      planType: 'Freemium',
      price: 'Free / $20/mo',
      categories: ['Conversational AI', 'Writing'],
      featured: true
    },
    {
      id: 3,
      name: 'Claude',
      company: 'Anthropic', 
      tagline: 'Constitutional AI for safe assistance',
      logo: '🧠',
      rating: 4.7,
      users: '15M+',
      planType: 'Freemium',
      price: 'Free / $20/mo',
      categories: ['Conversational AI', 'Analysis']
    },
    {
      id: 17,
      name: 'Character.AI',
      company: 'Character Technologies',
      tagline: 'Create and chat with AI characters',
      logo: '🎭',
      rating: 4.3,
      users: '8M+',
      planType: 'Freemium',
      price: 'Free / $10/mo',
      categories: ['Conversational AI', 'Entertainment']
    },
    {
      id: 16,
      name: 'Perplexity AI',
      company: 'Perplexity',
      tagline: 'AI-powered search and research assistant',
      logo: '🔍',
      rating: 4.6,
      users: '12M+',
      planType: 'Freemium',
      price: 'Free / $20/mo',
      categories: ['Conversational AI', 'Research']
    },
    {
      id: 24,
      name: 'Replika',
      company: 'Luka Inc.',
      tagline: 'Personal AI companion for emotional support',
      logo: '💬',
      rating: 4.2,
      users: '5M+',
      planType: 'Freemium',
      price: 'Free / $15/mo',
      categories: ['Conversational AI', 'Wellness']
    },
    {
      id: 25,
      name: 'Jasper Chat',
      company: 'Jasper',
      tagline: 'AI assistant for marketing and content',
      logo: '📝',
      rating: 4.5,
      users: '3M+',
      planType: 'Paid',
      price: '$49/mo',
      categories: ['Conversational AI', 'Marketing']
    }
  ];

  // Related categories
  const relatedCategories = [
    {
      id: 2,
      name: 'Writing & Content',
      icon: '✍️',
      toolCount: 18,
      color: 'green'
    },
    {
      id: 5,
      name: 'Customer Support',
      icon: '🎧',
      toolCount: 12,
      color: 'purple'
    },
    {
      id: 8,
      name: 'Language Translation',
      icon: '🌍',
      toolCount: 9,
      color: 'orange'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Back Button */}
            <div className="mb-8">
              <Link to="/categories">
                <Button variant="outline" className="group hover:bg-primary hover:text-white transition-all duration-200">
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Categories
                </Button>
              </Link>
            </div>

            {/* Category Header */}
            <Card className="mb-8 hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="text-6xl">{category.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          {category.featured && (
                            <Badge className="primary-gradient text-white">Featured</Badge>
                          )}
                          {category.trending && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        
                        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
                        <p className="text-xl text-muted-foreground mb-6">{category.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span>{category.toolCount} AI Tools</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{category.totalUsers} Total Users</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{category.avgRating} Avg Rating</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Market Stats */}
                  <Card className="w-full lg:w-80 bg-muted/30 hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-500">
                    <CardHeader>
                      <CardTitle className="text-lg">Market Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Growth Rate</span>
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          {category.marketStats.growth}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Market Size</span>
                        <span className="font-medium">{category.marketStats.marketSize}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">2030 Projection</span>
                        <span className="font-medium text-primary">{category.marketStats.projectedGrowth}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Adoption Rate</span>
                        <span className="font-medium">{category.marketStats.adoptionRate}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Category Content Sections */}
            <div className="space-y-8">
              {/* AI Tools Section */}
              <Card className="hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-2xl">AI Tools in {category.name}</span>
                    <Link to="/ai-tools">
                      <Button variant="outline" size="sm">
                        View All Tools
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryTools.slice(0, 6).map((tool) => (
                      <Card key={tool.id} className="group hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
                        <div className="relative h-32 flex items-center justify-center bg-gradient-to-br from-primary/5 to-muted/20">
                          <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{tool.logo}</div>
                          <div className="absolute top-4 right-4">
                            <Badge className="primary-gradient text-white shadow-lg">
                              <Star className="h-3 w-3 mr-1" />
                              {tool.rating}
                            </Badge>
                          </div>
                        </div>
                        
                        <CardContent className="p-6">
                          <div className="mb-4">
                            <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{tool.name}</h4>
                            <p className="text-muted-foreground text-sm font-medium mb-3">{tool.company}</p>
                            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{tool.tagline}</p>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3" />
                              <span>{tool.users}</span>
                            </div>
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 text-xs">
                              {tool.planType}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 primary-gradient text-white hover:scale-105 transition-all duration-300" asChild>
                              <Link to={`/ai-tools/${tool.id}`}>
                                View Tool
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* ChatGPT Prompts Section */}
              <Card className="hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-2xl">ChatGPT Prompts for {category.name}</span>
                    <Link to="/chatgpt-prompts">
                      <Button variant="outline" size="sm">
                        View All Prompts
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        id: 1,
                        title: 'Customer Service Chatbot Prompts',
                        description: 'Professional prompts for creating responsive customer service conversations.',
                        category: 'Customer Support',
                        rating: 4.8,
                        uses: '15.2K',
                        difficulty: 'Beginner'
                      },
                      {
                        id: 2,
                        title: 'AI Assistant Personality Builder',
                        description: 'Create engaging AI personalities for various conversational scenarios.',
                        category: 'Character Development',
                        rating: 4.7,
                        uses: '12.3K',
                        difficulty: 'Intermediate'
                      },
                      {
                        id: 3,
                        title: 'Context-Aware Conversation Starter',
                        description: 'Generate conversation starters that maintain context and engagement.',
                        category: 'Conversation',
                        rating: 4.6,
                        uses: '9.8K',
                        difficulty: 'Beginner'
                      }
                    ].map((prompt) => (
                      <Card key={prompt.id} className="group hover:border-primary hover:shadow-lg hover:scale-105 transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge className="primary-gradient text-white">
                                {prompt.category}
                              </Badge>
                              <Badge variant="secondary" className={`text-xs
                                ${prompt.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 border-green-200' :
                                  prompt.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                  'bg-red-100 text-red-700 border-red-200'}
                              `}>
                                {prompt.difficulty}
                              </Badge>
                            </div>
                            <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{prompt.title}</h4>
                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{prompt.description}</p>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{prompt.rating}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{prompt.uses} uses</span>
                            </div>
                          </div>
                          
                          <Button size="sm" className="w-full primary-gradient text-white hover:scale-105 transition-all duration-300" asChild>
                            <Link to={`/chatgpt-prompts/${prompt.id}`}>
                              View Prompt
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Articles Section */}
              <Card className="hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-2xl">Articles about {category.name}</span>
                    <Link to="/ai-articles">
                      <Button variant="outline" size="sm">
                        View All Articles
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        id: 1,
                        title: 'The Future of Conversational AI: Trends and Predictions',
                        description: 'Exploring the latest developments in conversational AI and what the future holds.',
                        category: 'AI Trends',
                        author: 'Dr. Sarah Chen',
                        publishDate: '2024-01-15',
                        readTime: '8 min read',
                        views: '12.5K'
                      },
                      {
                        id: 2,
                        title: 'Building Better Chatbots: UX Design Principles',
                        description: 'Essential design principles for creating user-friendly conversational interfaces.',
                        category: 'UX Design',
                        author: 'Michael Thompson',
                        publishDate: '2024-01-12',
                        readTime: '6 min read',
                        views: '9.3K'
                      },
                      {
                        id: 3,
                        title: 'Natural Language Processing in Customer Service',
                        description: 'How NLP is revolutionizing customer support and service automation.',
                        category: 'Technology',
                        author: 'Prof. Emily Davis',
                        publishDate: '2024-01-10',
                        readTime: '10 min read',
                        views: '15.7K'
                      }
                    ].map((article) => (
                      <Card key={article.id} className="group hover:border-primary hover:shadow-lg hover:scale-105 transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="mb-4">
                            <Badge className="primary-gradient text-white mb-3">
                              {article.category}
                            </Badge>
                            <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h4>
                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{article.description}</p>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                            <span>{article.author}</span>
                            <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                            <span>{article.readTime}</span>
                            <span>{article.views} views</span>
                          </div>
                          
                          <Button size="sm" className="w-full primary-gradient text-white hover:scale-105 transition-all duration-300" asChild>
                            <Link to={`/ai-articles/${article.id}`}>
                              Read Article
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* News Section */}
              <Card className="hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-2xl">Latest {category.name} News</span>
                    <Link to="/ai-news">
                      <Button variant="outline" size="sm">
                        View All News
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        id: 1,
                        title: 'OpenAI Announces Major ChatGPT Updates',
                        summary: 'New features include improved context understanding and faster response times.',
                        source: 'TechCrunch',
                        publishDate: '2024-01-20',
                        category: 'Product Updates',
                        readTime: '3 min read'
                      },
                      {
                        id: 2,
                        title: 'Google Bard Gets Conversational AI Enhancements',
                        summary: 'Enhanced natural language processing capabilities announced at Google I/O.',
                        source: 'The Verge',
                        publishDate: '2024-01-18',
                        category: 'Industry News',
                        readTime: '4 min read'
                      },
                      {
                        id: 3,
                        title: 'Enterprise Adoption of Conversational AI Surges',
                        summary: 'New report shows 300% increase in business chatbot implementations.',
                        source: 'AI News',
                        publishDate: '2024-01-16',
                        category: 'Market Research',
                        readTime: '5 min read'
                      }
                    ].map((news) => (
                      <Card key={news.id} className="group hover:border-primary hover:shadow-lg hover:scale-105 transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="mb-4">
                            <Badge className="primary-gradient text-white mb-3">
                              {news.category}
                            </Badge>
                            <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{news.title}</h4>
                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{news.summary}</p>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                            <span>{news.source}</span>
                            <span>{new Date(news.publishDate).toLocaleDateString()}</span>
                            <span>{news.readTime}</span>
                          </div>
                          
                          <Button size="sm" className="w-full primary-gradient text-white hover:scale-105 transition-all duration-300" asChild>
                            <Link to={`/ai-news/${news.id}`}>
                              Read News
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
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

export default CategoryDetail;