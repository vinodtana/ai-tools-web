import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Zap, 
  FileText, 
  Newspaper, 
  Users, 
  FolderTree, 
  ArrowRight, 
  Star,
  TrendingUp,
  Sparkles,
  Search
} from 'lucide-react';
import Layout from '@/components/Layout';
import heroImage from '@/assets/hero-light.jpg';
import chatgptIcon from '@/assets/chatgpt-icon.jpg';
import midjourneyIcon from '@/assets/midjourney-icon.jpg';
import claudeIcon from '@/assets/claude-icon.jpg';
import aiToolsSection from '@/assets/ai-tools-section.jpg';
import promptsSection from '@/assets/prompts-section.jpg';
import articlesSection from '@/assets/articles-section.jpg';
import newsSection from '@/assets/news-section.jpg';
import influencersSection from '@/assets/influencers-section.jpg';
import categoriesSection from '@/assets/categories-section.jpg';

import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchAITools } from "../store/features/contents/contentsSlice";
import { useState, useEffect } from "react";


const Index = () => {
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

 

  const sections = [
    {
      title: 'AI Tools',
      description: 'Discover 100+ cutting-edge AI tools for every use case',
      extendedDescription: 'From content creation to data analysis, find the perfect AI tool for your workflow. Our curated collection includes free and premium options across 40+ categories.',
      features: ['100+ Tools', 'Free & Premium', '40+ Categories', 'Expert Reviews'],
      icon: Bot,
      href: '/ai-tools',
      count: '100+',
      gradient: 'from-blue-500 to-purple-600',
      image: aiToolsSection,
    },
    {
      title: 'ChatGPT Prompts',
      description: 'Ready-to-use prompts for maximum productivity',
      extendedDescription: 'Professional-grade prompts tested and optimized for ChatGPT, Claude, and other AI models. Save hours with our productivity-focused prompt library.',
      features: ['20+ Prompts', 'Copy & Use', 'Multi-Model', 'Productivity Focus'],
      icon: Zap,
      href: '/chatgpt-prompts',
      count: '20+',
      gradient: 'from-yellow-500 to-orange-600',
      image: promptsSection,
    },
    {
      title: 'AI Articles',
      description: 'In-depth analysis and insights about AI trends',
      extendedDescription: 'Expert analysis, tutorials, and deep dives into AI technology. Stay informed with comprehensive articles written by industry professionals.',
      features: ['30+ Articles', 'Expert Authors', 'Weekly Updates', 'Technical Depth'],
      icon: FileText,
      href: '/ai-articles',
      count: '30+',
      gradient: 'from-green-500 to-teal-600',
      image: articlesSection,
    },
    {
      title: 'AI News',
      description: 'Stay updated with the latest AI developments',
      extendedDescription: 'Breaking news, product launches, and industry updates from the fast-paced world of artificial intelligence. Never miss important developments.',
      features: ['Daily Updates', 'Breaking News', 'Industry Insights', 'Trending Topics'],
      icon: Newspaper,
      href: '/ai-news',
      count: '10+',
      gradient: 'from-red-500 to-pink-600',
      image: newsSection,
    },
    {
      title: 'AI Influencers',
      description: 'Follow leading voices in the AI community',
      extendedDescription: 'Connect with thought leaders, researchers, and innovators shaping the future of AI. Discover their insights and latest projects.',
      features: ['10+ Influencers', 'Industry Leaders', 'Social Links', 'Latest Updates'],
      icon: Users,
      href: '/ai-influencers',
      count: '10+',
      gradient: 'from-purple-500 to-indigo-600',
      image: influencersSection,
    },
    {
      title: 'Categories',
      description: 'Explore AI tools by category and use case',
      extendedDescription: 'Browse AI tools organized by specific use cases and industries. Find exactly what you need with our detailed categorization system.',
      features: ['40+ Categories', 'Use Case Focus', 'Industry Specific', 'Easy Browse'],
      icon: FolderTree,
      href: '/categories',
      count: '40+',
      gradient: 'from-cyan-500 to-blue-600',
      image: categoriesSection,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[95vh] flex items-center">
        {/* Premium Animated Background Elements */}
        <div className="absolute inset-0 purple-light-gradient">
          {/* Multiple animated orbs for premium effect */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-float opacity-60"></div>
          <div className="absolute top-32 right-10 w-80 h-80 bg-primary/12 rounded-full blur-3xl animate-float opacity-80" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-primary/6 rounded-full blur-3xl animate-float opacity-70" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float opacity-50" style={{ animationDelay: '4.5s' }}></div>
          <div className="absolute bottom-10 right-20 w-88 h-88 bg-primary/5 rounded-full blur-3xl animate-float opacity-60" style={{ animationDelay: '2.5s' }}></div>
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
              animation: 'float 8s ease-in-out infinite'
            }}></div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-primary/60 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-primary/30 rounded-full animate-float" style={{ animationDelay: '5s' }}></div>
        </div>
        
        {/* Hero Image Overlay with premium effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 transition-opacity duration-1000 hover:opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        {/* Premium glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-primary/5 backdrop-blur-[0.5px]"></div>
        
        <div className="relative container mx-auto px-4 py-24 z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Enhanced badge with premium animation */}
            <div className="mb-8 animate-slide-up">
              <Badge className="relative mb-2 animate-pulse-glow purple-light-gradient border-primary/30 px-6 py-2 text-sm font-semibold shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full blur-md"></div>
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                <span className="relative z-10">Top AI Tools Directory</span>
              </Badge>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>Trusted by 50K+ AI enthusiasts</span>
                <Star className="h-4 w-4 fill-primary text-primary" />
              </div>
            </div>
            
            {/* Enhanced title with staggered animation */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight">
              <div className="animate-slide-up">
                <span className="primary-gradient bg-clip-text text-transparent hover:scale-105 transition-transform duration-500 inline-block">
                  Discover the
                </span>
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <span className="primary-gradient bg-clip-text text-transparent hover:scale-105 transition-transform duration-500 inline-block">
                  Future
                </span>
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <span className="text-foreground hover:text-primary transition-colors duration-500">of <span className='ai-name-top-primary'>AI</span> Tools</span>
              </div>
            </h1>
            
            {/* Enhanced description */}
            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed">
                Your ultimate destination for AI tools, news, articles, and insights. 
                Stay ahead with the best AI resources curated for professionals.
              </p>
              <p className="text-lg text-muted-foreground/80 mb-10 max-w-2xl mx-auto">
                Join thousands of innovators who trust our platform to discover cutting-edge AI solutions
              </p>
            </div>
            
            {/* Enhanced buttons with premium effects */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-scale-bounce" style={{ animationDelay: '0.8s' }}>
              <Link to="/ai-tools">
                <Button size="lg" className="group relative primary-gradient text-lg px-10 py-4 soft-shadow hover:scale-110 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  <Search className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="relative z-10">Explore AI Tools</span>
                </Button>
              </Link>
              <Link to="/ai-news">
                <Button size="lg" variant="outline" className="group text-lg px-10 py-4 bg-white/60 backdrop-blur-sm border-primary/30 hover:bg-white/80 hover:scale-110 transition-all duration-300 hover:border-primary/60 hover:shadow-xl">
                  <TrendingUp className="mr-3 h-6 w-6 group-hover:translate-y-[-2px] transition-transform duration-300" />
                  Latest AI News
                </Button>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 animate-slide-up" style={{ animationDelay: '1s' }}>
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <span>100+ AI Tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <span>50K+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                  </div>
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-16 bg-gradient-to-br from-primary-light to-white relative">
        {/* Floating decoration elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured AI Tools</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Most popular and highly-rated AI tools used by millions worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {aiTools?.map((tool, index) => (
              <Card key={tool.id} className="group hover:bg-transparent hover:border-primary hover:shadow-2xl transition-all duration-500 animate-slide-up overflow-hidden hover:scale-105" style={{ animationDelay: `${index * 0.15}s` }}>
                {/* Tool Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={tool.bannerImage} 
                    alt={tool.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
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
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{tool.name}</h3>
                    <p className="text-muted-foreground text-sm font-medium mb-3">{tool.tagline}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">{tool.description}</p>
                  </div>
                  
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool?.categories?.slice(0, 2).map((category, catIndex) => (
                      <Badge key={catIndex} variant="secondary" className="bg-primary/5 text-primary border-primary/20 text-xs">
                        {category}
                      </Badge>
                    ))}
                    {tool?.categories?.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{tool.categories.length - 2}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-primary/10 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{tool.users} users</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tool?.prices?.map((price, priceIndex) => (
                        <Badge key={priceIndex} className="primary-gradient text-white text-xs">
                          {price}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* View Details Button */}
                  <Link to={`/ai-tools/${tool.id}`}>
                    <Button className="w-full group primary-gradient text-white hover:scale-105 transition-all duration-300">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12 animate-scale-bounce" style={{ animationDelay: '0.8s' }}>
            <Link to="/ai-tools">
              <Button size="lg" variant="outline" className="group bg-white/60 backdrop-blur-sm border-primary/30 hover:bg-white/80 hover:scale-105 transition-all hover:border-primary/50">
                View All Tools
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Explore Our Sections */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        {/* Premium animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/8 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-32 right-10 w-64 h-64 bg-primary/12 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-80 h-80 bg-primary/6 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Sections</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover comprehensive AI resources organized for your needs with premium quality content
            </p>
          </div>
          
          {/* Each section in one row */}
          <div className="space-y-16 max-w-7xl mx-auto">
            {sections.map((section, index) => (
              <div key={section.title} className="animate-slide-up border border-primary/20 rounded-2xl p-8 bg-white/50 backdrop-blur-sm hover:border-primary/40 hover:shadow-xl transition-all duration-300" style={{ animationDelay: `${index * 0.2}s` }}>
                {index > 0 && <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-16"></div>}
                
                <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                  {/* Section Image */}
                  <div className="flex-1 relative group">
                    <div className="relative h-80 rounded-2xl overflow-hidden hover:bg-transparent hover:border-primary border-2 border-transparent hover:scale-105 transition-all duration-500">
                      <img 
                        src={section.image} 
                        alt={section.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-primary/60 transition-all duration-500"></div>
                      <div className="absolute top-6 right-6">
                        <Badge className="primary-gradient text-white shadow-lg">
                          {section.count}
                        </Badge>
                      </div>
                      <div className="absolute bottom-6 left-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <section.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section Content */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-primary transition-colors">{section.title}</h3>
                      <p className="text-muted-foreground text-lg mb-4 leading-relaxed">{section.description}</p>
                      <p className="text-muted-foreground leading-relaxed">{section.extendedDescription}</p>
                    </div>
                    
                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {section.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm font-medium text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* View All Button */}
                    <div className="pt-4">
                      <Link to={section.href}>
                        <Button size="lg" className="group primary-gradient text-white px-8 py-4 hover:scale-105 transition-all duration-300">
                          <span className="mr-3">View All {section.title}</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <p className="text-muted-foreground text-sm mt-3">
                        Explore {section.count} curated {section.title.toLowerCase()} in our collection
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Industry Insights Section */}
      <section className="py-20 bg-gradient-to-br from-white to-primary-light relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-primary/8 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-slide-up">
            <Badge className="primary-gradient text-white px-6 py-2 mb-4">
              <TrendingUp className="mr-2 h-4 w-4" />
              Industry Insights
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">AI Market Trends & Analytics</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              Stay ahead of the curve with real-time AI industry data, market trends, and comprehensive analytics from leading research firms.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Bot, title: 'AI Tools Released', value: '2,500+', subtitle: 'This Year', color: 'from-blue-500 to-cyan-500' },
              { icon: TrendingUp, title: 'Market Growth', value: '47%', subtitle: 'YoY Increase', color: 'from-green-500 to-emerald-500' },
              { icon: Users, title: 'Active Users', value: '1.2B+', subtitle: 'Globally', color: 'from-purple-500 to-pink-500' },
              { icon: Sparkles, title: 'Investment', value: '$50B+', subtitle: 'In AI Startups', color: 'from-orange-500 to-red-500' }
            ].map((stat, index) => (
              <Card key={index} className="group hover:bg-transparent hover:border-primary hover:scale-105 transition-all duration-500 text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold primary-gradient bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{stat.title}</h3>
                  <p className="text-muted-foreground text-sm">{stat.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button variant="outline" className="group bg-white/60 backdrop-blur-sm border-primary/30 hover:bg-primary hover:text-white hover:scale-105 transition-all duration-300">
              <FileText className="mr-2 h-4 w-4" />
              View Detailed Analytics
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* AI Success Stories Section */}
      <section className="py-20 bg-muted/20 relative overflow-hidden">
        {/* Premium background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-slide-up">
            <Badge className="primary-gradient text-white px-6 py-2 mb-4">
              <Star className="mr-2 h-4 w-4" />
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Transforming Businesses with AI</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              Discover how leading companies are leveraging AI tools to drive innovation, increase productivity, and achieve remarkable results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                company: 'TechCorp Inc.',
                result: '300% Productivity Boost',
                description: 'Automated content creation and customer service using ChatGPT and Claude, reducing response time from hours to minutes.',
                category: 'Content & Support',
                tools: ['ChatGPT', 'Claude'],
                metric: '95% Customer Satisfaction'
              },
              {
                company: 'Creative Studio',
                result: '500% Faster Design Process',
                description: 'Revolutionary design workflow using Midjourney and AI tools, creating stunning visuals in minutes instead of days.',
                category: 'Design & Creative',
                tools: ['Midjourney', 'DALL-E'],
                metric: '10x More Projects Delivered'
              },
              {
                company: 'DataFlow Solutions',
                result: '80% Cost Reduction',
                description: 'Streamlined data analysis and reporting using advanced AI analytics tools, eliminating manual processing.',
                category: 'Data & Analytics',
                tools: ['Analytics AI', 'AutoML'],
                metric: '$2M Annual Savings'
              }
            ].map((story, index) => (
              <Card key={index} className="group hover:bg-transparent hover:border-primary hover:scale-105 transition-all duration-500 animate-slide-up overflow-hidden" style={{ animationDelay: `${index * 0.15}s` }}>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary mb-3">
                      {story.category}
                    </Badge>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{story.company}</h3>
                    <div className="text-2xl font-bold primary-gradient bg-clip-text text-transparent mb-3">
                      {story.result}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {story.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {story.tools.map((tool, toolIndex) => (
                        <Badge key={toolIndex} className="primary-gradient text-white text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-primary/10">
                      <span className="text-xs text-muted-foreground">Key Metric</span>
                      <span className="text-sm font-semibold text-primary">{story.metric}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button className="group primary-gradient text-white px-8 py-4 hover:scale-105 transition-all duration-300">
              <Users className="mr-2 h-5 w-5" />
              Read More Success Stories
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why AI Tools Matter Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-slide-up">
            <Badge className="primary-gradient text-white px-6 py-2 mb-4">
              <Bot className="mr-2 h-4 w-4" />
              The AI Revolution
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why We Need AI Tools Today</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              In today's fast-paced digital world, AI tools have become essential for staying competitive, efficient, and innovative across all industries.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: TrendingUp,
                title: 'Efficiency Boost',
                description: 'Automate repetitive tasks and increase productivity by 10x',
                statistic: '400% faster workflows'
              },
              {
                icon: Sparkles,
                title: 'Enhanced Creativity',
                description: 'Generate innovative ideas and creative solutions instantly',
                statistic: 'Unlimited inspiration'
              },
              {
                icon: Bot,
                title: 'Smart Automation',
                description: 'Reduce human error and streamline complex processes',
                statistic: '95% accuracy improvement'
              },
              {
                icon: Users,
                title: 'Competitive Edge',
                description: 'Stay ahead of competitors with cutting-edge technology',
                statistic: '3x faster time-to-market'
              }
            ].map((need, index) => (
              <Card key={index} className="group hover:border-primary hover:scale-105 transition-all duration-500 text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <need.icon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">{need.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{need.description}</p>
                  <div className="text-primary font-semibold text-sm">{need.statistic}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button onClick={()=>{navigate("/ai-tools") }} variant="outline" className="group bg-white/60 backdrop-blur-sm border-primary/30 hover:bg-primary hover:text-white hover:scale-105 transition-all duration-300">
              <Zap className="mr-2 h-4 w-4" />
              Discover AI Solutions
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* AI Tools Benefits Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Premium background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-slide-up">
            <Badge className="primary-gradient text-white px-6 py-2 mb-4">
              <Sparkles className="mr-2 h-4 w-4" />
              Key Benefits
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Transform Your Work with AI</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              Experience the game-changing benefits that AI tools bring to modern businesses and professionals worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: TrendingUp,
                title: 'Increased Productivity',
                description: 'Complete tasks in minutes that previously took hours. AI handles repetitive work while you focus on strategy and creativity.',
                benefits: ['Save 5+ hours daily', 'Automate workflows', 'Reduce manual errors', 'Scale operations'],
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Sparkles,
                title: 'Enhanced Decision Making',
                description: 'Make data-driven decisions with AI-powered insights and analytics that reveal hidden patterns and opportunities.',
                benefits: ['Real-time analytics', 'Predictive insights', 'Risk assessment', 'Market intelligence'],
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Users,
                title: 'Improved Customer Experience',
                description: 'Deliver personalized experiences and instant support that delights customers and builds lasting relationships.',
                benefits: ['24/7 availability', 'Personalization', 'Instant responses', 'Multi-language support'],
                color: 'from-green-500 to-emerald-500'
              }
            ].map((benefit, index) => (
              <Card key={index} className="group hover:border-primary hover:scale-105 transition-all duration-500 animate-slide-up overflow-hidden" style={{ animationDelay: `${index * 0.15}s` }}>
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${benefit.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{benefit.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{benefit.description}</p>
                  <div className="space-y-3">
                    {benefit.benefits.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button onClick={()=>{navigate("/ai-tools") }} className="group primary-gradient text-white px-8 py-4 hover:scale-105 transition-all duration-300">
              <Bot className="mr-2 h-5 w-5" />
              Start Your AI Journey Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-20 bg-gradient-to-br from-primary-light to-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-32 right-20 w-32 h-32 bg-primary/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-primary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Our Platform?</h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              We're not just another AI directory. We're your comprehensive AI companion with premium features and expert curation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {[
              {
                icon: Sparkles,
                title: 'Expert Curation',
                description: 'Every tool is hand-picked and tested by AI experts to ensure quality and relevance.',
                features: ['Quality Verified', 'Expert Reviews', 'Regular Updates']
              },
              {
                icon: TrendingUp,
                title: 'Latest Trends',
                description: 'Stay ahead with real-time AI news, trending tools, and emerging technologies.',
                features: ['Daily Updates', 'Trend Analysis', 'Industry Insights']
              },
              {
                icon: Users,
                title: 'Community Driven',
                description: 'Join a thriving community of AI enthusiasts sharing knowledge and experiences.',
                features: ['User Reviews', 'Community Forums', 'Networking']
              }
            ].map((feature, index) => (
              <Card key={index} className="group hover:border-primary hover:scale-105 transition-all duration-500 animate-slide-up text-center overflow-hidden" style={{ animationDelay: `${index * 0.15}s` }}>
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl primary-gradient shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Premium CTA */}
          <div className="text-center">
            <Button onClick={()=>{navigate("/ai-tools") }} size="lg" className="group primary-gradient text-white text-lg px-12 py-6 shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <Sparkles className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
              <span className="relative z-10">Start Exploring Premium AI Tools</span>
            </Button>
            <p className="text-muted-foreground mt-4">Join 50K+ professionals who trust our platform</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-white to-primary-light relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-32 right-20 w-32 h-32 bg-primary/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-primary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 animate-slide-up">Trusted by AI Enthusiasts Worldwide</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="animate-scale-bounce">
                <div className="text-3xl md:text-4xl font-bold primary-gradient bg-clip-text text-transparent">100+</div>
                <div className="text-muted-foreground">AI Tools</div>
              </div>
              <div className="animate-scale-bounce" style={{ animationDelay: '0.1s' }}>
                <div className="text-3xl md:text-4xl font-bold primary-gradient bg-clip-text text-transparent">50K+</div>
                <div className="text-muted-foreground">Monthly Users</div>
              </div>
              <div className="animate-scale-bounce" style={{ animationDelay: '0.2s' }}>
                <div className="text-3xl md:text-4xl font-bold primary-gradient bg-clip-text text-transparent">30+</div>
                <div className="text-muted-foreground">Articles</div>
              </div>
              <div className="animate-scale-bounce" style={{ animationDelay: '0.3s' }}>
                <div className="text-3xl md:text-4xl font-bold primary-gradient bg-clip-text text-transparent">40+</div>
                <div className="text-muted-foreground">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
