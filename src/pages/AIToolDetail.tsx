import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  ExternalLink,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Share2,
  Building,
  Globe,
  Check,
  Play,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import Layout from "@/components/Layout";
import RightSidebar from "@/components/RightSidebar";
import {
  fetchAIToolDetails,
  fetchAITools,
} from "../store/features/contents/contentsSlice";
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AIToolDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const { cDetails, aiCategories, aiTools } = useAppSelector(
    (state: any) => state.content
  );
  console.log("cDetails", cDetails);
  useEffect(() => {
    dispatch(fetchAIToolDetails(id));
    const jsonObj = { page: 1, limit: 50 };
    dispatch(fetchAITools(jsonObj));
  }, []);
  useEffect(() => {
    dispatch(fetchAIToolDetails(id));
    const jsonObj = { page: 1, limit: 50 };
    dispatch(fetchAITools(jsonObj));
  }, [id]);

  // Similar tools data
  const similarTools = [
    {
      id: 3,
      name: "Claude",
      company: "Anthropic",
      tagline: "Constitutional AI for safe and helpful assistance",
      logo: "🧠",
      planType: "Freemium",
      rating: 4.7,
      price: "Free / $20/mo",
    },
    {
      id: 17,
      name: "Character.AI",
      company: "Character Technologies",
      tagline: "Create and chat with AI characters",
      logo: "🎭",
      planType: "Freemium",
      rating: 4.3,
      price: "Free / $10/mo",
    },
    {
      id: 16,
      name: "Perplexity AI",
      company: "Perplexity",
      tagline: "AI-powered search and research assistant",
      logo: "🔍",
      planType: "Freemium",
      rating: 4.6,
      price: "Free / $20/mo",
    },
  ];
  const allIMages = cDetails?.images?.length ===0 ?[cDetails?.bannerImage || cDetails?.bannerImageTemp, cDetails.logo || cDetails?.logoTemp]: cDetails?.images;
  const nespp =
    "Transform your everyday selfies into professional-quality headshots with Secta AI. In a process that takes under an hour, the advanced algorithms scan through 25 of your chosen photos to produce a multitude of distinctive, professionally styled headshots. Whether you're in a suit or pajamas, the platform eliminates the need for costly studio visits, saving you time and money.<\n\n>This AI platform doesn't just stop at the initial batch; it enables you to create an even broader portfolio of images through the New Photoshoot Tool. This tool allows for an unparalleled level of customization, giving you the power to generate additional headshots in styles that you specifically desire. Whether you're looking for formal attire, casual wear, or specific backdrops, the choices are virtually endless.\n\nBut this offering goes beyond mere convenience. User privacy and data protection are prioritized. Your images are securely stored in a private gallery that only you can access. This gallery is not only a vault but also a curation tool that lets you save your top picks for easy future reference and usage. You have the flexibility to export these images as and when you need them.\n\nAI technology can sometimes yield unpredictable results. That's why Secta AI offers a 100% money-back guarantee for users who aren't satisfied with the outcome, provided they haven't downloaded any images from their gallery. This assures a risk-free experience as you explore the numerous features and benefits this platform has to offer.\n\nThus, Secta AI delivers a trifecta of speed, flexibility, and security, revolutionizing the way you approach photography and personal branding. With hundreds of style combinations at your fingertips, you'll never have to settle for mediocre headshots ever again.";
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Back Button */}
            <div className="mb-8">
              <Link to="/ai-tools">
                <Button
                  variant="outline"
                  className="group hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to AI Tools
                </Button>
              </Link>
            </div>
            {/* <p>{nespp}</p>
            <img
              src={
                "https://res.cloudinary.com/topaitools/image/upload/f_webp,q_20,w_250,h_250/logos/rket4z9osy8htxb8ilvs?_a=BAMClqTE0"
              }
            />
            <br />
            <br />
            <p
              dangerouslySetInnerHTML={{
                __html: nespp.replace(/\n\n/g, "\n\n<br/><br/>"),
              }}
            ></p> */}
            {/* Tool Header */}
            <Card className="mb-8 hover:border-primary hover:shadow-2xl-111 hover:scale-105-111 transition-all-111 duration-500-111">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-6">
                      {/* tool?.bannerImageTemp || tool?.logoTemp */}
                      <div className="text-6xl logo-image">
                        <img src={cDetails.logo || cDetails?.logoTemp} />{" "}
                      </div>
                      <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-2">
                          {cDetails.name}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-4">
                          {cDetails.tagline}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">
                              {cDetails?.rating}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-5 w-5" />
                            <span>{cDetails.users} users</span>
                          </div>
                          <Badge className="primary-gradient text-white">
                            {cDetails.planType}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {cDetails?.categoryNamesList?.map(
                            (category, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-primary/5 text-primary text-transform-capitalize border-primary/20"
                              >
                                {category}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-6">
                      <a
                        target="_blank"
                        href={cDetails.toolUrl}
                        className="underline hover:text-primary transition-colors"
                      >
                        <img
                          src={cDetails?.bannerImage || cDetails?.bannerImageTemp}
                          alt={cDetails?.name}
                          className="w-full h-auto mb-4 rounded-lg"
                        />{" "}
                      </a>
                     
                    </p>

                   
                  </div>

                  {/* Sidebar Info */}
                  <Card className="w-full lg:w-80 bg-muted/30 hover:border-primary hover:shadow-2xl hover:scale-105-111 transition-all duration-500">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Tool Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {cDetails.companyName && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Company</span>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span className="font-medium">
                              {cDetails.companyName}
                            </span>
                          </div>
                        </div>
                      )}
                      {cDetails.authorBy && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Created by
                          </span>
                          <span className="font-medium">
                            {cDetails.authorBy}
                          </span>
                        </div>
                      )}
                      {cDetails.price && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Pricing</span>
                          <span className="font-medium">{cDetails.price}</span>
                        </div>
                      )}
                      {cDetails.launchDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Launch Date
                          </span>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">
                              {new Date(
                                cDetails.launchDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-primary/10">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <a
                            href={cDetails?.toolUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Globe className="mr-2 h-4 w-4" />
                            Visit Website
                          </a>
                        </Button>
                        <br/>
                        <br/>
                     <div>
                          <Button
                        className="primary-gradient w-100 text-white hover:scale-105 transition-all duration-300"
                        asChild
                      >
                        <a
                          href={cDetails.toolUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Try Tool
                        </a>
                      </Button>
                     </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
               <div className="flex flex-wrap gap-4 p-8">
                       <p
                        dangerouslySetInnerHTML={{
                          __html: cDetails?.overview?.replace(/\n\n/g, "\n\n<br/><br/>"),
                        }}
                      ></p>
                      <Button
                        className="primary-gradient text-white hover:scale-105 transition-all duration-300"
                        asChild
                      >
                        <a
                          href={cDetails.toolUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Try Tool
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        className="hover:bg-primary hover:text-white transition-all duration-200"
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Tool
                      </Button>
                    </div>
            </Card>
            
            {/* Detailed Information Tabs */}
            <Card className="hover:border-primary hover:shadow-2xl hover:scale-105-111 transition-all duration-500">
              <CardContent className="p-8">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 mb-8">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
                    <TabsTrigger value="pros-cons">Pros & Cons</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Overview</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: cDetails.overview?.replace(/\n\n/g, "\n\n<br/><br/>"),
                          }}
                        ></p>
                      </p>
                      {cDetails?.description && (
                      <div>
                        <h4 className="text-lg font-semibold mb-3">
                          Description
                        </h4>
                        <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                          <p
                            dangerouslySetInnerHTML={{
                              __html: cDetails?.description,
                            }}
                          ></p>
                        </div>
                      </div>
                      )}
                      
                    </div>
                    {cDetails?.features?.length > 0 && (
                      <div>
                      <h3 className="text-2xl font-bold mb-4">Features: </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cDetails?.features?.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-4 rounded-lg border hover:border-primary transition-colors"
                          >
                            <Check className="h-5 w-5 text-primary flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    )}
                    
                    {cDetails?.useCases?.length > 0 && (
                      <div>
                      <h3 className="text-2xl font-bold mb-4">Use Cases: </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cDetails?.useCases?.map((useCase, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-4 rounded-lg border hover:border-primary transition-colors"
                          >
                            <Check className="h-5 w-5 text-primary flex-shrink-0" />
                            <span>{useCase}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    )}
                   
                    {cDetails?.toolPros?.length > 0 && (<>
                     <h3 className="text-xl font-bold mb-4 text-green-600">
                          Pros:
                        </h3>
                        <div className="space-y-3">
                          {cDetails?.toolPros?.map((pro, index) => (
                            <>
                              {pro && (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 p-3 rounded-lg border border-green-200 hover:border-green-400 transition-colors dark:border-green-800 dark:hover:border-green-600"
                                >
                                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span>{pro}</span>
                                </div>
                              )}
                            </>
                          ))}
                          </div>
                    </> )}
                   
                          {cDetails?.toolCons?.length > 0 && (
                            <>
                            <h3 className="text-xl font-bold mb-4 text-green-600">
                          Cons:
                        </h3>
                        <div className="space-y-3">
                          {cDetails?.toolCons?.map((pro, index) => (
                            <>
                              {pro && (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 p-3 rounded-lg border border-green-200 hover:border-green-400 transition-colors dark:border-green-800 dark:hover:border-green-600"
                                >
                                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span>{pro}</span>
                                </div>
                              )}
                            </>
                          ))}
                        </div></>
                          )}
                           
                  </TabsContent>

                  <TabsContent value="features" className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cDetails?.features?.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-4 rounded-lg border hover:border-primary transition-colors"
                          >
                            <Check className="h-5 w-5 text-primary flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="use-cases" className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Use Cases</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cDetails?.useCases?.map((useCase, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-4 rounded-lg border hover:border-primary transition-colors"
                          >
                            <Check className="h-5 w-5 text-primary flex-shrink-0" />
                            <span>{useCase}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="pros-cons" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-green-600">
                          Pros
                        </h3>
                        <div className="space-y-3">
                          {cDetails?.toolPros?.length <= 0 && (
                            <div>
                              <p>Not Available.</p>
                            </div>
                          )}
                          {cDetails?.toolPros?.map((pro, index) => (
                            <>
                              {pro && (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 p-3 rounded-lg border border-green-200 hover:border-green-400 transition-colors dark:border-green-800 dark:hover:border-green-600"
                                >
                                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span>{pro}</span>
                                </div>
                              )}
                            </>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-orange-600">
                          Cons
                        </h3>
                        <div className="space-y-3">
                          {cDetails?.toolCons?.length <= 0 && (
                            <div>
                              <p>Not Available.</p>
                            </div>
                          )}
                          {cDetails?.toolCons?.map((con, index) => (
                            <>
                              {con && (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 p-3 rounded-lg border border-orange-200 hover:border-orange-400 transition-colors dark:border-orange-800 dark:hover:border-orange-600"
                                >
                                  <XCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                  <span>{con}</span>
                                </div>
                              )}
                            </>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">
                        Screenshots & Media
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allIMages?.map((image, index) => (
                          <Card
                            key={index}
                            className="group hover:border-primary hover:scale-105 transition-all duration-300"
                          >
                            <CardContent className="p-4">
                              <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                                <img
                                  src={image}
                                  alt={`Screenshot ${index + 1}`}
                                  className="object-cover w-full h-full rounded-lg"
                                />
                              </div>
                              <h4 className="font-medium">
                                Screenshot {index + 1}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Tool Interface
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block w-80">
            <RightSidebar />
          </div>
        </div>

        {/* Similar Tools Section */}
        <div className="mt-12">
          <Card className="hover:border-primary hover:shadow-2xl hover:scale-105-111 transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-2xl">Similar Tools</CardTitle>
              <p className="text-muted-foreground">
                Discover other AI tools in the same category
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiTools?.map((similarTool, index) => (
                  <Card
                    key={similarTool.id}
                    className="group hover:border-primary hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden"
                  >
                    {/* Tool Logo/Icon */}
                    <div className="relative h-32-test flex items-center justify-center bg-gradient-to-br from-primary/5 to-muted/20">
                      <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                        {" "}
                        <img src={similarTool.bannerImage || similarTool?.bannerImageTemp || similarTool?.logoTemp} />{" "}
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="primary-gradient text-white shadow-lg">
                          <Star className="h-3 w-3 mr-1" />
                          {similarTool.rating}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-4">
                        <Link
                          to={`/ai-tools/${similarTool?.name?.replace(
                            /\s+/g,
                            "-"
                          )}/${similarTool.id}`}
                        >
                          <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                            {similarTool.name}
                          </h4>
                        </Link>
                        <p className="text-muted-foreground text-sm font-medium mb-3">
                          {similarTool.company}
                        </p>
                        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                          {similarTool.tagline}
                        </p>
                      </div>

                      {/* Plan Type Badge */}
                      <div className="flex justify-center mb-4">
                        <Badge
                          variant="secondary"
                          className="bg-primary/5 text-primary border-primary/20 text-xs"
                        >
                          {similarTool.planType}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-center pt-4 border-t border-primary/10 mb-4">
                        <div className="text-center">
                          <span className="font-medium text-primary text-sm">
                            {similarTool.price}
                          </span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <Link
                        to={`/ai-tools/${similarTool?.name?.replace(
                          /\s+/g,
                          "-"
                        )}/${similarTool.id}`}
                      >
                        <Button className="w-full group primary-gradient text-white hover:scale-105 transition-all duration-300">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link to="/ai-tools">
                  <Button
                    variant="outline"
                    className="hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    View All AI Tools
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AIToolDetail;
