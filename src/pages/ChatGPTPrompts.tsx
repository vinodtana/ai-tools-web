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
  Copy, 
  Heart, 
  Star, 
  TrendingUp, 
  Clock,
  Tag,
  Filter,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

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

import { fetchAIPromots } from "../store/features/contents/contentsSlice";

const ChatGPTPrompts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();


  const [selectedCategory, setSelectedCategory] = useState('All');
const { aIPromots, isLoading, pagination, aiCategories } = useAppSelector(
    (state: any) => state.content
  );
  console.log("aIPromots", aIPromots);
  console.log("aiCategories", aiCategories);

  useEffect(() => {
    // page, limit, search, type, status, isActive, categoryIds
    const jsonObj = { page: 1, limit: 50 };
    dispatch(fetchAIPromots(jsonObj));
  }, []);
  // Mock data for prompts
  

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-4">
                <span className="primary-gradient bg-clip-text text-transparent">ChatGPT Prompts</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover and use the best ChatGPT prompts curated by the community
              </p>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search prompts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {aiCategories.map((category: any) => (
                <SelectItem key={category?.id} value={category?.id}>
                  {selectedCategory === "all"
                    ? "All Categories"
                    : category?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
              </div>
            </div>

            {/* Featured Prompts */}
            {selectedCategory === 'All' && searchTerm === '' && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  Featured Prompts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aIPromots?.map(prompt => (
                    <Card key={prompt.id} className="hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-500 group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <Badge className="primary-gradient text-white mb-2">Featured</Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {prompt.rating}
                          </div>
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {prompt.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground"> <p
                                  dangerouslySetInnerHTML={{
                                    __html: prompt.overview,
                                  }}
                                ></p></p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {prompt?.tags?.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-primary/5 text-primary border-primary/20">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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
                        </div>

                        <Link to={`/chatgpt-prompts/${prompt.id}`}>
                          <Button className="w-full primary-gradient text-white hover:scale-105 transition-all duration-300">
                            View Prompt
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* All Prompts */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedCategory === 'All' ? 'All Prompts' : `${selectedCategory} Prompts`}
                  <span className="text-muted-foreground ml-2">({aIPromots?.length})</span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Sorted by popularity
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aIPromots?.map(prompt => (
                  <Card key={prompt.id} className="hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
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
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {prompt.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground"> <p
                                  dangerouslySetInnerHTML={{
                                    __html: prompt.overview,
                                  }}
                                ></p></p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {prompt?.tags?.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-primary/5 text-primary border-primary/20">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="bg-muted/30 p-3 rounded-lg mb-4 text-sm">
                        <p className="line-clamp-2 text-muted-foreground">
                          {prompt.prompt}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Link to={`/chatgpt-prompts/${prompt.id}`} className="flex-1">
                          <Button size="sm" className="w-full primary-gradient text-white">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {aIPromots?.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No prompts found</h3>
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

export default ChatGPTPrompts;