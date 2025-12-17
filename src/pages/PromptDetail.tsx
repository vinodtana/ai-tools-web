import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Copy,
  Share2,
  Zap,
  Target,
  Users,
  CheckCircle,
  Star,
  Clock,
  Tag,
} from "lucide-react";
import Layout from "@/components/Layout";
import RightSidebar from "@/components/RightSidebar";
import SimilarItemCard from "@/components/SimilarItemCard";
import {
  fetchAIToolDetails,
  fetchAIPromots,
  fetchPromptCategories,
  getAllContentLikesByUserId,
} from "../store/features/contents/contentsSlice";
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PromptDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const { cDetails, aiCategories, aIPromots, promptCategories, user } =
    useAppSelector((state: any) => state.content);
  console.log("cDetails", cDetails);
  useEffect(() => {
    dispatch(fetchAIToolDetails(id));
    dispatch(fetchPromptCategories({ page: 1, limit: 100, search: "" })); // type:"prompts"
  }, []);
  useEffect(() => {
    dispatch(fetchAIToolDetails(id));
    // const jsonObj = { page: 1, limit: 50 };
    //  dispatch(fetchAIPromots(jsonObj));
     if(user?.id){
              dispatch(
              getAllContentLikesByUserId({
                user_id: user?.id,
              })
            );
            }
  }, [id]);
  useEffect(() => {
    if (cDetails?.categoryNamesList?.length > 0) {
      const jsonObj = {
        page: 1,
        limit: 50,
        category_name: cDetails?.categoryNamesList?.[0],
      };
      dispatch(fetchAIPromots(jsonObj));
    }
  }, [cDetails]);

  const copyPrompt = () => {
    navigator.clipboard.writeText(cDetails.promptText);
    // You could add a toast notification here
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Back Button */}
            <div className="mb-8">
              <Link to="/chatgpt-prompts">
                <Button
                  variant="outline"
                  className="group hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Prompts
                </Button>
              </Link>
            </div>

            {/* Prompt Header */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="primary-gradient text-white">
                      {cDetails.category}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={`
                      ${
                        cDetails.difficulty === "Beginner"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : cDetails.difficulty === "Intermediate"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }
                    `}
                    >
                      {cDetails.difficulty}
                    </Badge>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    {cDetails.name}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-6">
                    {cDetails.tagline}
                  </p>
                  <img
                    src={cDetails?.bannerImage || cDetails?.bannerImageTemp}
                    alt={cDetails?.name}
                    className="w-full h-auto mb-4 rounded-lg"
                  />{" "}
                  <p className="text-xl text-muted-foreground mb-6">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: cDetails.overview?.replace(
                          /\n\n/g,
                          "\n\n<br/><br/>"
                        ),
                      }}
                    ></p>
                  </p>
                </div>

                {/* Prompt Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{cDetails.rating} rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{cDetails.uses} uses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>{cDetails.saves} saves</span>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Updated {new Date(cDetails.lastUpdated).toLocaleDateString()}</span>
                  </div> */}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {cDetails?.tags?.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-primary/5 text-primary border-primary/20"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={copyPrompt}
                    className="primary-gradient text-white hover:scale-105 transition-all duration-300"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Prompt
                  </Button>
                  <Button
                    variant="outline"
                    className="hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Prompt
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Prompt Text */}
            {cDetails.promptTemplate && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Prompt Template
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted/30 p-6 rounded-lg whitespace-pre-wrap text-sm leading-relaxed overflow-x-auto">
                      {cDetails.promptTemplate}
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-4 right-4"
                      onClick={copyPrompt}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Use Cases */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Use Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {cDetails?.useCases?.map((useCase, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      {/* <span>{useCase}</span> */}
                      <p
                        dangerouslySetInnerHTML={{
                          __html: useCase?.replace(/\n\n/g, "\n\n<br/><br/>"),
                        }}
                      ></p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            {cDetails?.instructions?.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>How to Use This Prompt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cDetails?.instructions?.map((instruction, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-muted-foreground">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Examples */}
            {cDetails?.examples?.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Example Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cDetails?.examples?.map((example, index) => (
                    <div key={index} className="border rounded-lg p-6">
                      <h4 className="font-semibold mb-3">{example.title}</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            Input:
                          </p>
                          <div className="bg-muted/30 p-3 rounded text-sm">
                            {example.input}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            Output Preview:
                          </p>
                          <div className="bg-primary/5 p-3 rounded text-sm">
                            {example.output}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block w-80">
            <RightSidebar categories1={aiCategories.slice(0, 10) || []} />
          </div>
        </div>

        {/* Similar Prompts - Full Width */}
        <div className="mt-12">
          <Card className="">
            <CardHeader>
              <CardTitle>Similar Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {aIPromots?.map((similarPrompt, index) => (
                  <SimilarItemCard
                    key={index}
                    item={similarPrompt}
                    linkTo={`/chatgpt-prompts/${similarPrompt?.name?.replace(
                      /\s+/g,
                      "-"
                    )}/${similarPrompt.id}`}
                    type="prompt"
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

export default PromptDetail;
