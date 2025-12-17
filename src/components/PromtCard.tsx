import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Users,
  Calendar,
  Clock,
  Eye,
  User,
  ArrowRight,
  BookOpen,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  handleLikeContent,
  getAllContentLikesByUserId,
  setShowLoginModel,
} from "../store/features/contents/contentsSlice";
import { Heart } from "lucide-react";

const PromptCard = (props: any) => {
  const { prompt, index, newDesign } = props;
  // Get default image based on type
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const {
    aiTools,
    isLoading,
    aiToolsPagination,
    aiCategories,
    toolCategories,
    promptCategories,
    user,
    userContentLikes,
  } = useAppSelector((state: any) => state.content);
  console.log("prompt prompt", prompt);
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
        content_id: prompt.id,
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
    (like: any) => like?.content_id == prompt?.id
  );
  return (
    <>
      {newDesign ? (
        <Link
          to={`/chatgpt-prompts/${prompt?.name}/${prompt.id}`}
          className="flex-1"
        >
          <Card
            key={prompt.id}
            className="relative hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
          >
            <div
              className="absolute top-4 right-4 z-10"
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
            <CardHeader>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {prompt.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {" "}
                <p
                  className="truncate-3-lines"
                  dangerouslySetInnerHTML={{
                    __html: prompt.overview,
                  }}
                ></p>
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {prompt.categoryNamesList
                  ?.slice(0, 4)
                  ?.map((category, catIndex) => (
                    <Badge
                      key={catIndex}
                      variant="secondary"
                      className="bg-primary/5 text-primary border-primary/20 text-xs"
                    >
                      {category}
                    </Badge>
                  ))}
                {prompt?.categoryNamesList?.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{prompt?.categoryNamesList?.length - 4}
                  </Badge>
                )}
              </div>
              <div className="bg-muted/30 p-3 rounded-lg mb-4 text-sm">
                <p className="line-clamp-2 text-muted-foreground">
                  {prompt.prompt}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Link
                  to={`/chatgpt-prompts/${prompt?.name}/${prompt.id}`}
                  className="flex-1"
                >
                  <Button
                    size="sm"
                    className="w-full primary-gradient text-white"
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </Link>
      ) : (
        <Link
          to={`/chatgpt-prompts/${prompt?.name?.replace(/\s+/g, "-")}/${
            prompt.id
          }`}
        >
          <Card
            key={prompt.id}
            className="hover:border-primary hover:shadow-2xl hover:scale-105-111 transition-all duration-500 group"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge className="primary-gradient text-white mb-2">
                  Featured
                </Badge>
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
              </div>
              <Link
                to={`/chatgpt-prompts/${prompt?.name?.replace(/\s+/g, "-")}/${
                  prompt.id
                }`}
                className="flex-1"
              >
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {prompt.name}
                </CardTitle>
              </Link>
              <p className="text-sm text-muted-foreground">
                {" "}
                <p
                  className="truncate-3-lines"
                  dangerouslySetInnerHTML={{
                    __html: prompt.overview,
                  }}
                ></p>
              </p>
            </CardHeader>
            <CardContent>
              {/* <div className="flex flex-wrap gap-1 mb-4">
                          {prompt?.categoryNamesList?.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-primary/5 text-primary border-primary/20">
                              {tag}
                            </Badge>
                          ))}
                        </div> */}
              <div className="flex flex-wrap gap-2 mb-4">
                {prompt.categoryNamesList
                  ?.slice(0, 2)
                  ?.map((category, catIndex) => (
                    <Badge
                      key={catIndex}
                      variant="secondary"
                      className="bg-primary/5 text-primary border-primary/20 text-xs"
                    >
                      {category}
                    </Badge>
                  ))}
                {prompt?.categoryNamesList?.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{prompt?.categoryNamesList?.length - 2}
                  </Badge>
                )}
              </div>

              {/* <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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
                        </div> */}

              <Link
                to={`/chatgpt-prompts/${prompt?.name?.replace(/\s+/g, "-")}/${
                  prompt.id
                }`}
              >
                <Button className="w-full primary-gradient text-white hover:scale-105 transition-all duration-300">
                  View Prompt
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Link>
      )}
    </>
  );
};

export default PromptCard;
