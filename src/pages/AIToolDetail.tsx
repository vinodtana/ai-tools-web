import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ToolCard from "@/components/ToolCard";
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
  Heart,
} from "lucide-react";
import Layout from "@/components/Layout";
import RightSidebar from "@/components/RightSidebar";
import {
  fetchAIToolDetails,
  fetchAITools,
  setShowLoginModel,
  createClickOut,
  getAllContentLikesByUserId,
  handleLikeContent,
} from "../store/features/contents/contentsSlice";
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { triggerMixpanelEvent } from "../Scenes/common";
import CommentSection from "@/components/CommentSection";

const AIToolDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { cDetails, aiCategories, aiTools, user, userContentLikes } =
    useAppSelector((state: any) => state.content);

  console.log("cDetails", cDetails);
  console.log("user", user);
  useEffect(() => {
    dispatch(fetchAIToolDetails(id));
    const jsonObj = { page: 1, limit: 50 };
    // dispatch(fetchAITools(jsonObj));
    if (user?.id) {
      dispatch(
        getAllContentLikesByUserId({
          user_id: user?.id,
        })
      );
    }
  }, []);
  useEffect(() => {
    dispatch(fetchAIToolDetails(id));
    const jsonObj = { page: 1, limit: 50 };
    // dispatch(fetchAITools(jsonObj));
  }, [id]);
  useEffect(() => {
    if (cDetails?.categoryNamesList?.length > 0) {
      const jsonObj = {
        page: 1,
        limit: 50,
        category_name: cDetails?.categoryNamesList?.[0],
      };
      dispatch(fetchAITools(jsonObj));
    }
  }, [cDetails]);
  // Similar tools data
  const redirectToolUrl = (tUrl: string) => {
    if (user?.id) {
      triggerMixpanelEvent("click_tool_url", { tool_url: tUrl });
      if (tUrl) {
        const clickOutData = {
          user_id: user?.id,
          content_id: cDetails?.id,
          redirect_url: tUrl,
          type: "tools",
        };
        dispatch(createClickOut(clickOutData));
        window.open(tUrl, "_blank");
      } else if (cDetails?.name) {
        const nnurl = `https://www.google.com/search?q=${encodeURIComponent(
          cDetails?.name
        )}`;
        const clickOutData = {
          user_id: user?.id,
          content_id: cDetails?.id,
          redirect_url: nnurl,
          type: "tools",
        };
        dispatch(createClickOut(clickOutData));
        window.open(nnurl, "_blank");
      }
    } else {
      dispatch(setShowLoginModel(true));
    }
  };
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
        type: "tools",
        content_id: cDetails.id,
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

  const allIMages =
    cDetails?.images?.length === 0
      ? [
          cDetails?.bannerImage ||
            cDetails?.bannerImageTemp ||
            cDetails.logo ||
            cDetails?.logoTemp,
        ]
      : cDetails?.images;

  const isLiked = userContentLikes?.find(
    (like: any) => like?.content_id == cDetails?.id
  );
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

                    <p
                      className="text-muted-foreground leading-relaxed cursor-pointer mb-6"
                      onClick={() => redirectToolUrl(cDetails?.toolUrl)}
                    >
                      <img
                        src={cDetails?.bannerImage || cDetails?.bannerImageTemp}
                        alt={cDetails?.name}
                        className="w-full h-auto mb-4 rounded-lg"
                      />{" "}
                    </p>
                  </div>

                  {/* Sidebar Info */}
                  <Card className="w-full lg:w-80 bg-muted/30 hover:border-primary hover:shadow-2xl hover:scale-105-111 transition-all duration-500 relative">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg">
                        Tool Information
                      </CardTitle>
                      <div
                        className=""
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlecontentLike(isLiked);
                        }}
                      >
                        <div
                          className={`p-2 rounded-full transition-all duration-300 cursor-pointer ${
                            isLiked
                              ? "bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-indigo-500/30"
                              : "bg-gray-200/50 backdrop-blur-md hover:bg-gray-300/50"
                          }`}
                        >
                          <Heart
                            className={`h-4 w-4 transition-all duration-300 ${
                              isLiked
                                ? "fill-white text-white scale-110"
                                : "text-gray-600"
                            }`}
                          />
                        </div>
                      </div>
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
                          className="w-full cursor-pointer"
                          asChild
                          onClick={() => redirectToolUrl(cDetails?.toolUrl)}
                        >
                          <span>
                            {" "}
                            <Globe className="mr-2 h-4 w-4" />
                            Visit Website
                          </span>
                        </Button>
                        <br />
                        <br />
                        <div>
                          <Button
                            className="cursor-pointer primary-gradient w-100 text-white hover:scale-105 transition-all duration-300"
                            asChild
                            onClick={() => redirectToolUrl(cDetails?.toolUrl)}
                          >
                            <span>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Try Tool
                            </span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <div className="flex flex-wrap gap-4 p-2">
                <p
                  dangerouslySetInnerHTML={{
                    __html: cDetails?.overview?.replace(
                      /\n\n/g,
                      "\n\n<br/><br/>"
                    ),
                  }}
                ></p>
                <Button
                  className="primary-gradient text-white hover:scale-105 transition-all duration-300"
                  asChild
                  onClick={() => redirectToolUrl(cDetails?.toolUrl)}
                >
                  <span>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Try Tool
                  </span>
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
                            __html: cDetails.overview?.replace(
                              /\n\n/g,
                              "\n\n<br/><br/>"
                            ),
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

                    {cDetails?.toolPros?.length > 0 && (
                      <>
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
                      </>
                    )}

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
                        </div>
                      </>
                    )}
                    {allIMages?.length > 0 && (
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
            <div className="mt-12">
              <CommentSection contentId={cDetails?.id || id} type="tools" />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block w-80">
            <RightSidebar />
          </div>
        </div>

        <div className="mt-12">
          <Card className="hover:border-primary hover:shadow-2xl hover:scale-105-111 transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-2xl">Similar Tools</CardTitle>
              <p className="text-muted-foreground">
                Discover other AI tools in the same category
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 similar-tools-section-content">
                {aiTools?.map((similarTool, index) => (
                  <ToolCard tool={similarTool} index={index} />

                  //   <Card
                  //   key={similarTool.id}
                  //   className="group hover:border-primary hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden"
                  // >

                  //   <div className="relative h-32-test flex items-center justify-center bg-gradient-to-br from-primary/5 to-muted/20">
                  //     <div className="text-4xl group-hover:scale-110-111 transition-transform-111 duration-300-111">
                  //       {" "}
                  //       <img
                  //         src={
                  //           similarTool.bannerImage ||
                  //           similarTool?.bannerImageTemp ||
                  //           similarTool?.logoTemp
                  //         }
                  //       />{" "}
                  //     </div>
                  //     <div className="absolute top-4 right-4">
                  //       <Badge className="primary-gradient text-white shadow-lg">
                  //         <Star className="h-3 w-3 mr-1" />
                  //         {similarTool.rating}
                  //       </Badge>
                  //     </div>
                  //   </div>

                  //   <CardContent className="p-6">
                  //     <div className="mb-4">
                  //       <Link
                  //         to={`/ai-tools/${similarTool?.name?.replace(
                  //           /\s+/g,
                  //           "-"
                  //         )}/${similarTool.id}`}
                  //       >
                  //         <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  //           {similarTool.name}
                  //         </h4>
                  //       </Link>
                  //       <p className="text-muted-foreground text-sm font-medium mb-3">
                  //         {similarTool.company}
                  //       </p>
                  //       <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                  //         {similarTool.tagline}
                  //       </p>
                  //     </div>

                  //     {similarTool.planType &&
                  //       similarTool.planType !== "nan" && (
                  //         <div className="flex justify-center mb-4">
                  //           <Badge
                  //             variant="secondary"
                  //             className="bg-primary/5 text-primary border-primary/20 text-xs"
                  //           >
                  //             {similarTool.planType}
                  //           </Badge>
                  //         </div>
                  //       )}

                  //     <div className="flex flex-wrap gap-2 mb-6">
                  //       {similarTool?.categoryNamesList?.map(
                  //         (category, index) => (
                  //           <Badge
                  //             key={index}
                  //             variant="secondary"
                  //             className="bg-primary/5 text-primary text-transform-capitalize border-primary/20"
                  //           >
                  //             {category}
                  //           </Badge>
                  //         )
                  //       )}
                  //     </div>
                  //     <Link
                  //       to={`/ai-tools/${similarTool?.name?.replace(
                  //         /\s+/g,
                  //         "-"
                  //       )}/${similarTool.id}`}
                  //     >
                  //       <Button className="w-full group primary-gradient text-white hover:scale-105 transition-all duration-300">
                  //         View Details
                  //         <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  //       </Button>
                  //     </Link>
                  //   </CardContent>
                  // </Card>
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
