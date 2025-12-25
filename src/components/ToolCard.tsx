import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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

const ToolCard = (props: any) => {
  const { tool, index } = props;
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
  // console.log("tool", tool);
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
        content_id: tool.id,
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

  const handleContentClick = (tool: any) => {
    if (tool?.id) {
      window.open(
        `/ai-tools/${tool.name?.replace(/\s+/g, "-")}/${tool.id}`,
        "_blank"
      );
    } else if (tool?.website_url) {
      if (user?.id) {
        if (tool.website_url.startsWith("http")) {
          window.open(tool.website_url, "_blank");
        } else {
          window.open(`https://${tool.website_url}`, "_blank");
        }
      } else {
        dispatch(setShowLoginModel(true));
      }
    }
  };
  const isLiked = userContentLikes?.find(
    (like: any) => like?.content_id == tool?.id
  );
  return (
    <div
      onClick={() => handleContentClick(tool)}
      className="cursor-pointer block h-full"
    >
      <Card
        key={tool.id}
        className="group hover:bg-transparent hover:border-primary-111 hover:shadow-2xl-111 transition-all-111 duration-500-111 animate-slide-up-111 overflow-hidden-111 hover:scale-105-111"
        style={{ animationDelay: `${index * 0.15}s` }}
      >
        {/* Tool Image */}
        <div className="relative h-48 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <div className="text-6xl">
              <img
                src={
                  tool.bannerImage || tool?.bannerImageTemp || tool?.logoTemp
                }
                alt={tool?.name}
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-primary/20 transition-all duration-500"></div>
          <div className="absolute top-4 left-4">
            <Badge className="primary-gradient text-white shadow-lg">
              <Star className="h-3 w-3 mr-1" />
              {tool.rating !== "0.0" ? tool.rating : ""}
            </Badge>
          </div>
          {tool?.id && (
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
                    : "bg-white/10 backdrop-blur-md hover:bg-white/20"
                }`}
              >
                <Heart
                  className={`h-4 w-4 transition-all duration-300 ${
                    isLiked ? "fill-white text-white scale-110" : "text-white"
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {tool.name}
            </h3>
            <p className="text-muted-foreground text-sm font-medium mb-3">
              {tool.tagline}
            </p>
            {tool?.companyName && (
              <p className="text-muted-foreground text-sm font-medium mb-3">
                {tool.companyName}
              </p>
            )}

            <p className="text-muted-foreground text-xs leading-relaxed">
              {/* {tool.overview} */}
              <p
                className="truncate-3-lines"
                dangerouslySetInnerHTML={{
                  __html: tool.overview || tool?.description || "",
                }}
              ></p>
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* {tool?.category_names_list?,length > 0 ?  */}
            {(tool?.categoryNamesList || tool?.category_names_list || [])?.slice(0, 2).map((category, catIndex) => (
              <Badge
                key={catIndex}
                variant="secondary"
                className="bg-primary/5 text-primary border-primary/20 text-xs capitalize"
              >
                {category}
              </Badge>
            ))}
            {tool?.categoryNamesList?.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{tool?.categoryNamesList?.length - 2}
              </Badge>
            )}
          </div>
          {tool?.planType && (
            <p className="text-muted-foreground text-sm font-medium mb-3 capitalize">
              {tool.planType}
            </p>
          )}
          {/* <div className="flex items-center justify-between pt-4 border-t border-primary/10 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{tool.users} users</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge className="primary-gradient text-white text-xs">
                      {tool.price}
                    </Badge>
                  </div>
                </div> */}

          {/* View Details Button */}
          <Button className="w-full group primary-gradient text-white hover:scale-105 transition-all duration-300">
            View Details
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolCard;
