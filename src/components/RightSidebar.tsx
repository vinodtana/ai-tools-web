import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  FolderTree, 
  Bot, 
  Zap, 
  FileText, 
  Newspaper, 
  Users,
  Star,
  TrendingUp
} from 'lucide-react';


import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from 'react';
import { SubscribeNewsletter } from "../store/features/contents/contentsSlice";

import { useState } from 'react';

const RightSidebar = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleOnClick = async() => {
    if (email) {
      await dispatch(SubscribeNewsletter({ email }));
      setIsSubscribed(true);
    }
  };
  const popularCategories = [
    { name: 'Conversational AI', count: 25, icon: Bot, href: '/categories/conversational-ai' },
    { name: 'Image Generation', count: 18, icon: Zap, href: '/categories/image-generation' },
    { name: 'Writing & Content', count: 22, icon: FileText, href: '/categories/writing-content' },
    { name: 'Data Analysis', count: 15, icon: TrendingUp, href: '/categories/data-analysis' },
    { name: 'Productivity', count: 30, icon: Users, href: '/categories/productivity' },
    { name: 'News & Research', count: 12, icon: Newspaper, href: '/categories/news-research' },
  ];

  return (
    <div className="space-y-6">
      {/* Newsletter Signup */}
      <Card className="hover:scale-[1.02] transition-all duration-300">
        <CardHeader className="text-center pb-4">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-3">
              <Mail className="h-7 w-7 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl">AI Essentials Newsletter</CardTitle>
          <p className="text-muted-foreground text-sm">
            Stay ahead with weekly AI insights, tool reviews, and exclusive content
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {
            isSubscribed ? (
              <div className="text-center text-green-600 font-medium">
                🎉 Thank you for subscribing! Check your inbox for the latest edition.
              </div>
            ) : <div className="space-y-3">
            <Input 
              type="email" 
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
              placeholder="Enter your email" 
              className="border-primary/20 focus:border-primary/40"
            />
            <Button onClick={handleOnClick} className="w-full primary-gradient text-white hover:scale-105 transition-all duration-300">
              <Mail className="mr-2 h-4 w-4" />
              Subscribe Free
            </Button>
          </div>
          }
          
          
          {/* Newsletter Benefits */}
          <div className="pt-4 border-t border-primary/10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span>Join 50K+ subscribers</span>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Weekly AI tool roundups</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Exclusive prompts & guides</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Early access to new features</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Categories */}
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FolderTree className="h-5 w-5 text-primary" />
            Popular AI Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {popularCategories.map((category, index) => (
            <Link 
              key={index} 
              to={category.href}
              className="block group"
            >
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-200">
                  <category.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm group-hover:text-primary transition-colors">
                    {category.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {category.count} tools
                  </div>
                </div>
                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 text-xs">
                  {category.count}
                </Badge>
              </div>
            </Link>
          ))}
          
          <div className="pt-3 border-t border-primary/10">
            <Link to="/categories">
              <Button variant="outline" size="sm" className="w-full text-xs hover:bg-primary hover:text-white transition-all duration-200">
                View All Categories
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Featured Badge */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="text-center p-6">
          <div className="mb-3">
            <Star className="h-8 w-8 text-primary mx-auto fill-primary" />
          </div>
          <h3 className="font-semibold text-primary mb-2">Premium Directory</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Curated by AI experts with 4.9/5 rating from users
          </p>
          <Badge className="primary-gradient text-white text-xs">
            Trusted by 50K+ users
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSidebar;