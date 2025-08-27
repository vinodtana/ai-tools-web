import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import RightSidebar from '@/components/RightSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ArrowRight,
  Sparkles,
  Brain,
  MessageSquare,
  Code,
  Image,
  FileText,
  Music,
  Video,
  BarChart,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Grid3X3
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchAITools } from "../store/features/contents/contentsSlice";

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState('');
 const { aiInfluencers, isLoading, pagination, aiCategories } = useAppSelector(
    (state: any) => state.content
  );
  // Mock data for categories



  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'border-blue-200 dark:border-blue-800',
      purple: 'border-purple-200 dark:border-purple-800',
      green: 'border-green-200 dark:border-green-800',
      orange: 'border-orange-200 dark:border-orange-800',
      cyan: 'border-cyan-200 dark:border-cyan-800',
      red: 'border-red-200 dark:border-red-800',
      pink: 'border-pink-200 dark:border-pink-800',
      yellow: 'border-yellow-200 dark:border-yellow-800',
      emerald: 'border-emerald-200 dark:border-emerald-800',
      indigo: 'border-indigo-200 dark:border-indigo-800',
      violet: 'border-violet-200 dark:border-violet-800',
      teal: 'border-teal-200 dark:border-teal-800'
    };
    return colorMap[color as keyof typeof colorMap] || 'border-primary/20';
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
                <span className="primary-gradient bg-clip-text text-transparent">AI Tool Categories</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Explore AI tools organized by category and use case
              </p>

              {/* Search */}
              <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Card className="hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{aiCategories.length}</div>
                    <div className="text-sm text-muted-foreground">Total Categories</div>
                  </CardContent>
                </Card>
                <Card className="hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {aiCategories?.reduce((sum, cat) => sum + cat.toolCount, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Tools</div>
                  </CardContent>
                </Card>
                <Card className="hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{aiCategories.length}</div>
                    <div className="text-sm text-muted-foreground">Trending Categories</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Featured Categories */}
            {searchTerm === '' && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                  Featured Categories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiCategories.map(category => {
                    const IconComponent = category.icon;
                    return (
                      <Card key={category.id} className={`hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-500 group overflow-hidden border ${getColorClasses(category.color)}`}>
                        <div className="h-32 bg-primary/5 flex items-center justify-center">
                          {/* <IconComponent className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" /> */}
                        </div>
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="primary-gradient text-white">Featured</Badge>
                            {category.trending && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {category.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <div className="text-lg font-bold text-primary">{category.toolCount}</div>
                            <div className="text-sm text-muted-foreground">Tools Available</div>
                          </div>
                          
                          <div className="space-y-3 mb-4">
                            <div>
                              <div className="text-xs font-medium text-muted-foreground mb-1">Popular Tools:</div>
                              <div className="flex flex-wrap gap-1">
                                {category?.tools?.slice(0, 2).map(tool => (
                                  <Badge key={tool} variant="secondary" className="text-xs bg-primary/5 text-primary border-primary/20">
                                    {tool}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <Link to={`/categories/${category.id}`}>
                            <Button className="w-full primary-gradient text-white hover:scale-105 transition-all duration-300">
                              Explore Category
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}

            {/* All Categories */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {searchTerm ? `Search Results` : 'All Categories'}
                  <span className="text-muted-foreground ml-2">({aiCategories.length})</span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Grid3X3 className="h-4 w-4" />
                  Grid view
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiCategories.map(category => {
                  const IconComponent = category.icon;
                  return (
                    <Card key={category.id} className={`hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-300 group border ${getColorClasses(category.color)}`}>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            {/* <IconComponent className="h-6 w-6 text-primary" /> */}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {category.featured && (
                                <Badge className="primary-gradient text-white text-xs">Featured</Badge>
                              )}
                              {category.trending && (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  Trending
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm font-bold text-primary">{category.toolCount} tools</div>
                          </div>
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {category.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-4">
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-1">Use Cases:</div>
                            <div className="flex flex-wrap gap-1">
                              {category?.useCases?.slice(0, 3).map(useCase => (
                                <Badge key={useCase} variant="secondary" className="text-xs bg-primary/5 text-primary border-primary/20">
                                  {/* {useCase} */}
                                  {'useCase'}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <Link to={`/categories/${category.id}`}>
                          <Button className="w-full group hover:bg-primary hover:text-white transition-all duration-200" variant="outline">
                            View {category?.toolCount} Tools
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {aiCategories.length === 0 && (
                <div className="text-center py-12">
                  <Grid3X3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No categories found</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms</p>
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

export default Categories;