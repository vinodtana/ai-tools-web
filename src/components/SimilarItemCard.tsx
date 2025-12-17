import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Calendar, Clock, Eye, User, ArrowRight, BookOpen, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  handleLikeContent,
  getAllContentLikesByUserId,
  setShowLoginModel,
} from "../store/features/contents/contentsSlice";

const SimilarItemCard = ({ item, linkTo, type }: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { user, userContentLikes } = useAppSelector((state: any) => state.content);

  const handlecontentLike = async (isLiked: boolean) => {
    setLoading(true);
    if (!user?.id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to like tools",
        variant: "destructive",
      });
      dispatch(setShowLoginModel(true));
      return;
    }
    await dispatch(
      handleLikeContent({
        type: "prompts",
        content_id: item.id,
        isLiked: !isLiked,
        user_id: user?.id || 1,
      })
    );
    await dispatch(
      getAllContentLikesByUserId({
        user_id: user?.id || 1,
      })
    );
    setLoading(false);
  };

  const isLiked = userContentLikes?.find(
    (like: any) => like?.content_id == item?.id
  );

  // Get default image based on type
  const getDefaultImage = () => {
    const gradients = {
      prompt: 'from-yellow-500/20 to-orange-600/20',
      article: 'from-green-500/20 to-teal-600/20', 
      influencer: 'from-purple-500/20 to-indigo-600/20'
    };
    
    const icons = {
      prompt: '⚡',
      article: '📄',
      influencer: '👤'
    };
    
    return { gradient: gradients[type], icon: icons[type] };
  };

  const defaultStyle = getDefaultImage();

  const renderPromptCard = () => (
    <Link to={`/chatgpt-prompts/${item?.name?.replace(/\s+/g, '-')}/${item.id}`}>
    <Card className="group hover:bg-transparent hover:border-primary hover:shadow-2xl transition-all duration-500 animate-fade-in overflow-hidden hover:scale-105">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {item?.bannerImage || item?.bannerImageTemp ? (
          <img 
            src={item?.bannerImage || item?.bannerImageTemp} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${defaultStyle.gradient} flex items-center justify-center`}>
            <div className="text-6xl">{defaultStyle.icon}</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-primary/20 transition-all duration-500"></div>
        <div className="absolute top-4 right-4 z-10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlecontentLike(isLiked);
          }}
        >
          <div className={`p-2 rounded-full transition-all duration-300 cursor-pointer ${
            isLiked
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-indigo-500/30"
              : "bg-white/10 backdrop-blur-md hover:bg-white/20"
          }`}>
            <Heart className={`h-4 w-4 transition-all duration-300 ${
              isLiked ? "fill-white text-white scale-110" : "text-white"
            }`} />
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          {/* <div className="flex items-center gap-3 mb-3">
            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">
              {item.category}
            </Badge>
          </div> */}
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
          {item.tagline && (
            <p className="text-muted-foreground text-sm leading-relaxed">{item.tagline}</p>
          )}
        </div>
        
        {item.uses && (
          <div className="flex items-center justify-between pt-4 border-t border-primary/10">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span>{item.uses} uses</span>
            </div>
          </div>
        )}
        <Link to={`/chatgpt-prompts/${item?.name?.replace(/\s+/g, '-')}/${item.id}`}>
                          <Button className="w-full primary-gradient text-white hover:scale-105 transition-all duration-300">
                            View Prompt
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
      </CardContent>
    </Card>
    </Link>
  );

  const renderArticleCard = () => (
    <Card className="group hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/30 bg-card">
      <CardContent className="p-6">
        {/* Header with badges and rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
              {item.category}
            </Badge>
            {/* Featured badge - you can add logic to show this conditionally */}
            <Badge className="bg-purple-600 text-white px-3 py-1">
              Featured
            </Badge>
          </div>
          {item.rating && (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">{item.rating}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
          {item.name}
        </h3>

        {/* Description */}
        {item?.tagline && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
            {item.tagline}
          </p>
        )}

        {/* Tags */}
        {item.specialties && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.specialties.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs px-2 py-1 border-primary/20 text-primary bg-primary/5">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Article meta info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {item.author && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{item.author}</span>
              </div>
            )}
            {item.publishDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(item.publishDate).toLocaleDateString()}</span>
              </div>
            )}
            {item.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{item.readTime}</span>
              </div>
            )}
            {item.views && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{item.views}</span>
              </div>
            )}
          </div>
        </div>

        {/* Read More button and Book icon */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors group-hover:bg-primary/90">
            Read More
            <ArrowRight className="h-4 w-4" />
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderInfluencerCard = () => (
    <Card className="group hover:bg-transparent hover:border-primary hover:shadow-2xl transition-all duration-500 animate-fade-in overflow-hidden hover:scale-105">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${defaultStyle.gradient} flex items-center justify-center`}>
            <div className="text-6xl">{item.avatar || defaultStyle.icon}</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-primary/20 transition-all duration-500"></div>
        <div className="absolute top-4 right-4">
          {item.rating && (
            <Badge className="primary-gradient text-white shadow-lg">
              <Star className="h-3 w-3 mr-1" />
              {item.rating}
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">
              {item.category}
            </Badge>
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
          {item.company && (
            <p className="text-muted-foreground text-sm font-medium mb-2">{item.company}</p>
          )}
          {item.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-primary/10 mb-3">
          {item.followers && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{item.followers}</span>
            </div>
          )}
        </div>
        
        {item.specialties && (
          <div className="flex flex-wrap gap-1">
            {item.specialties.slice(0, 2).map((specialty, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs bg-primary/5 text-primary border-primary/20">
                {specialty}
              </Badge>
            ))}
            {item.specialties.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{item.specialties.length - 2}
              </Badge>
            )}
          </div>
        )}
         <Link to={`/ai-influencers/${item?.name?.replace(/\s+/g, '-')}/${item.id}`}>
                          <Button className="w-full primary-gradient text-white hover:scale-105 transition-all duration-300">
                            View Profile
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>

      </CardContent>
    </Card>
  );

  const renderCard = () => {
    switch (type) {
      case 'prompt':
        return renderPromptCard();
      case 'article':
        return renderArticleCard();
      case 'influencer':
        return renderInfluencerCard();
      default:
        return renderPromptCard();
    }
  };

  return (
    <Link to={linkTo} className="block">
      {renderCard()}
    </Link>
  );
};

export default SimilarItemCard;