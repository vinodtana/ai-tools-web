import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  BookOpen,
  Heart,
  MessageCircle,
  Eye,
} from "lucide-react";
import Layout from "@/components/Layout";
import RightSidebar from "@/components/RightSidebar";
import SimilarItemCard from "@/components/SimilarItemCard";
import CommentSection from "@/components/CommentSection";
import ShareModal from "@/components/Common/ShareModal";
import {
  fetchAIToolDetails,
  fetchAIArticles,
  getAllContentLikesByUserId,
  handleLikeContent,
  setShowLoginModel,
} from "../store/features/contents/contentsSlice";
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ArticleDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [openShareModel, setOpenShareModel] = useState(false);
  const shareURL = window.location.href;
  const commentSectionRef = useRef<HTMLDivElement>(null);

  const { cDetails, aiCategories, aIArticles, user, userContentLikes } = useAppSelector(
    (state: any) => state.content
  );
  console.log("cDetails", cDetails);
  useEffect(() => {
    dispatch(fetchAIToolDetails(id));
    if (user?.id) {
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
      dispatch(fetchAIArticles(jsonObj));
    }
  }, [cDetails?.id]);

  const handlecontentLike = async (isLiked: boolean) => {
    setLoading(true);
    if (!user?.id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to like articles",
        variant: "destructive",
      });
      dispatch(setShowLoginModel(true));
      return;
    }
    await dispatch(
      handleLikeContent({
        type: "articles",
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

  const handleScrollToComments = () => {
    commentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isLiked = userContentLikes?.find(
    (like: any) => like?.content_id == cDetails?.id
  );

  // Mock article data

  return (
    <Layout>
      <ShareModal
        show={openShareModel}
        url={shareURL}
        title="Share on"
        handleClose={() => {
          setOpenShareModel(false);
        }}
        onCopyClick={() => {
          navigator.clipboard.writeText(shareURL);
        }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Back Button */}
            <div className="mb-8">
              <Link to="/ai-articles">
                <Button
                  variant="outline"
                  className="group hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Articles
                </Button>
              </Link>
            </div>

            {/* Article Header */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="mb-6">
                  <Badge className="primary-gradient text-white mb-4">
                    {cDetails.category}
                  </Badge>
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
                </div>

                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{cDetails.authorBy || `TopAITools Author`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(cDetails.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{cDetails?.readTime || `5 mins`}</span>
                  </div>
                  {cDetails.views && (
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{cDetails.views} views</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {cDetails?.tags?.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-primary/5 text-primary border-primary/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="outline"
                    className={`hover:bg-primary hover:text-white transition-all duration-200 ${
                      isLiked ? "bg-primary text-white" : ""
                    }`}
                    onClick={() => handlecontentLike(!!isLiked)}
                    disabled={loading}
                  >
                    <Heart
                      className={`mr-2 h-4 w-4 ${
                        isLiked ? "fill-white text-white" : ""
                      }`}
                    />
                    {isLiked ? "Liked" : "Like"}
                    {/* ({cDetails.likes}) */}
                  </Button>
                  <Button
                    variant="outline"
                    className="hover:bg-primary hover:text-white transition-all duration-200"
                    onClick={handleScrollToComments}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Comments
                    {/* ({cDetails.comments}) */}
                  </Button>
                  <Button
                    variant="outline"
                    className="hover:bg-primary hover:text-white transition-all duration-200"
                    onClick={() => setOpenShareModel(true)}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Article Content */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div className="whitespace-pre-line leading-relaxed">
                    {cDetails?.overviewList?.map((overText) => {
                      return (
                        <p
                          className="mb-5"
                          dangerouslySetInnerHTML={{
                            __html: overText?.replace(
                              /\n\n/g,
                              "\n\n<br/><br/>"
                            ),
                          }}
                        ></p>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Author Bio */}
            {cDetails.authorBy && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        About the Author
                      </h3>
                      <p className="font-semibold text-primary mb-2">
                        Name: {cDetails.authorBy}
                      </p>
                      <p className="font-semibold text-primary mb-2">
                        Location: {cDetails.authorLocation}
                      </p>
                      <p className="font-semibold text-primary mb-2">
                        Role: {cDetails.authorRole}
                      </p>
                      <p className="text-muted-foreground">
                        {cDetails.authorBio}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div ref={commentSectionRef} className="mt-8">
              <CommentSection contentId={cDetails?.id || id} type="articles" />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block w-80">
            <RightSidebar />
          </div>
        </div>

        {/* Similar Articles - Full Width */}
        <div className="mt-12">
          <Card className="">
            <CardHeader>
              <CardTitle>Similar Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {aIArticles?.map((similarArticle, index) => (
                  <SimilarItemCard
                    key={index}
                    item={similarArticle}
                    linkTo={`/ai-articles/${similarArticle?.name?.replace(
                      /\s+/g,
                      "-"
                    )}/${similarArticle.id}`}
                    type="article"
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

export default ArticleDetail;
