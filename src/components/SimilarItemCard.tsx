import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Calendar, Clock, Eye, User, ArrowRight, BookOpen } from 'lucide-react';

const 
SimilarItemCard = ({ item, linkTo, type }: any) => {
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
            <div className="text-6xl">{defaultStyle.icon}</div>
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
      </CardContent>
    </Card>
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