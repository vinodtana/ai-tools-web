import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ExternalLink, 
  Share2,
  MapPin,
  Building,
  Calendar,
  Users,
  Award,
  BookOpen,
  Youtube,
  Twitter,
  Linkedin,
  Globe,
  Star
} from 'lucide-react';
import Layout from '@/components/Layout';
import RightSidebar from '@/components/RightSidebar';
import SimilarItemCard from '@/components/SimilarItemCard';
import { fetchAIToolDetails, fetchAIInfluencers } from "../store/features/contents/contentsSlice";
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from 'react';
const InfluencerDetail = () => {
  const { id } = useParams();
  
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { toast } = useToast();
  
  
    const {  cDetails, aiCategories, aiInfluencers } = useAppSelector(
      (state: any) => state.content
    );
  console.log("cDetails", cDetails);
   useEffect(() => {
      dispatch(fetchAIToolDetails(id));
          const jsonObj = { page: 1, limit: 50 };
          dispatch(fetchAIInfluencers(jsonObj));
      
    }, []);
  
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Back Button */}
            <div className="mb-8">
              <Link to="/ai-influencers">
                <Button variant="outline" className="group hover:bg-primary hover:text-white transition-all duration-200">
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to AI Influencers
                </Button>
              </Link>
            </div>

            {/* Influencer Header */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="text-6xl">{cDetails.avatar}</div>
                      <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-2">{cDetails.name}</h1>
                        <p className="text-xl text-primary font-semibold mb-4">{cDetails.tagline}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{cDetails.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span>{cDetails.company}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{cDetails.followers} followers</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{cDetails.rating} rating</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {cDetails?.specialties?.map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="bg-primary/5 text-primary border-primary/20">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {cDetails.bio}
                    </p>
                    
                    {/* Social Links */}
                    <div className="flex flex-wrap gap-4">
                      <Button variant="outline" size="sm" asChild>
                        <a href={cDetails?.socialLinks?.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="mr-2 h-4 w-4" />
                          Twitter
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={cDetails?.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="mr-2 h-4 w-4" />
                          LinkedIn
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={cDetails?.socialLinks?.youtube} target="_blank" rel="noopener noreferrer">
                          <Youtube className="mr-2 h-4 w-4" />
                          YouTube
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={cDetails?.socialLinks?.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="mr-2 h-4 w-4" />
                          Website
                        </a>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Profile
                      </Button>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <Card className="w-full lg:w-80 bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Followers</span>
                        <span className="font-medium">{cDetails.followers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Rating</span>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{cDetails.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Since</span>
                        <span className="font-medium">{new Date(cDetails.joinDate).getFullYear()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Specialties</span>
                        <span className="font-medium">{cDetails?.specialties?.length}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Full Biography */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Biography
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div className="whitespace-pre-line leading-relaxed text-muted-foreground">
                  <p
                                  dangerouslySetInnerHTML={{
                                    __html: cDetails.overview,
                                  }}
                                ></p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Achievements */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Key Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cDetails?.achievements?.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Contributions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Key Contributions to AI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cDetails?.keyContributions?.map((contribution, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                      <span>{contribution}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Content */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recent Content & Activities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cDetails?.recentContent?.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {content.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{content.platform}</span>
                      </div>
                      <h4 className="font-medium mb-1">{content.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(content.date).toLocaleDateString()}</span>
                        </div>
                        <span>{content.engagement}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block w-80">
            <RightSidebar />
          </div>
        </div>

        {/* Similar Influencers - Full Width */}
        <div className="mt-12">
          <Card className="">
            <CardHeader>
              <CardTitle>Similar AI Influencers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {aiInfluencers?.map((similarInfluencer, index) => (
                  <SimilarItemCard
                    key={index}
                    item={similarInfluencer}
                    linkTo={`/ai-influencers/${similarInfluencer.id}`}
                    type="influencer"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default InfluencerDetail;