import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pagination } from "antd";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Heart,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  Search,
  Filter,
  ExternalLink,
  Users,
  ArrowRight,
  Mic,
} from "lucide-react";
import Layout from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import {
  JsonLd,
  buildBreadcrumbListLd,
  buildCollectionPageLd,
  type ItemListEntry,
} from "@/components/JsonLd";
import {
  buildCanonical,
  SITE_URL,
  SITE_NAME,
  slugToLabel,
  DEFAULT_OG_IMAGE,
  truncate,
} from "@/lib/seo";
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  fetchAITools,
  fetchToolCategories,
  handleLikeContent,
  getAllContentLikesByUserId,
} from "../store/features/contents/contentsSlice";
import { ITEMS_LIMIT } from "../config";
import Loader from "@/components/Common/Loader";
import ToolCard from "@/components/ToolCard";

import ToolCardSkeleton from "@/components/ToolCardSkeleton";

const AITools = () => {
  const { category_name } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPricing, setSelectedPricing] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const lastFetchRef = useRef<any>(null);
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

  useEffect(() => {
    const categoryLabel = category_name ? slugToLabel(category_name) : "";
    const canonicalPath = category_name
      ? `/ai-category-tools/${category_name}`
      : "/ai-tools";

    const seoTitle = category_name
      ? `Best AI Tools for ${categoryLabel} – Compare & Pricing | TopAITools.ai`
      : "3000+ AI Tools Directory – Compare Features, Pricing & Free Plans | TopAITools.ai";

    const seoDescription = category_name
      ? `Discover, compare, and review the best AI tools for ${categoryLabel}. Browse features, pricing, free plans, and user ratings. Find alternatives to popular AI tools and make informed decisions.`
      : "Explore 3000+ curated AI tools across every category. Compare features, pricing, free plans, and user ratings. Discover the best AI tools for design, coding, marketing, sales, automation, and more.";

    const keywords = category_name
      ? [`${categoryLabel} AI tools`]
      : [];

    console.log("SEO metadata updated:", { seoTitle, canonicalPath, keywords });
  }, [category_name, aiTools, aiToolsPagination, selectedCategory, searchQuery, currentPage]);

  // const { user } = useAppSelector((state: any) => state.auth);
  console.log("aiTools", aiTools);
  console.log("aiToolsPagination", aiToolsPagination);
  console.log("toolCategories", toolCategories);
  console.log("selectedCategory", selectedCategory);
  console.log("category_name", category_name);
  console.log("userContentLikes", userContentLikes);

  useEffect(() => {
    // page, limit, search, type, status, isActive, categoryIds
    const jsonObj = { page: currentPage, limit: ITEMS_LIMIT };
    lastFetchRef.current?.abort?.();
    lastFetchRef.current = dispatch(fetchAITools(jsonObj));
    dispatch(
      fetchToolCategories({
        page: 1,
        limit: 100,
        search: searchQuery,
        type: "tools",
      })
    );
    if (user?.id) {
      dispatch(
        getAllContentLikesByUserId({
          user_id: user?.id,
        })
      );
    }
  }, []);

  useEffect(() => {
    setSearchQuery("");
    getAllAIToolsList("");
  }, [ selectedCategory]);
   useEffect(() => {
    getAllAIToolsList();
  }, [currentPage]);
  useEffect(() => {
    const timer = setTimeout(() => {
      getAllAIToolsList();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (category_name) {
      setSelectedCategory(category_name?.replace(/-/g, " "));
    }
    getAllAIToolsList();
  }, [category_name]);
 const getAllAIToolsList = async(searchvv?: string) => {
    const jsonObj = {
      page: currentPage,
      limit: ITEMS_LIMIT,
      search:  searchvv || searchQuery || "",
      category_name: selectedCategory,
      user_id: user?.id || ""
    };

    // Abort the previous request if it exists
    if (lastFetchRef.current) {
      lastFetchRef.current.abort();
    }

    setLoading(true);
    
    // Store the promise BEFORE awaiting it
    const promise = dispatch(fetchAITools(jsonObj));
    lastFetchRef.current = promise;

    try {
      await promise;
    } catch (error) {
      // Ignore abort errors
    }

    // Only turn off loading if this is still the latest request
    if (lastFetchRef.current === promise) {
      setLoading(false);
    }
  };

  const startVoiceSearch = () => {
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast({
          title: "Voice search not supported",
          description: "Please use a supported browser like Chrome or Edge.",
          variant: "destructive",
        });
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event?.results?.[0]?.[0]?.transcript || "";
        setSearchQuery(transcript);
      };
      recognition.onerror = () => {
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };
  const handleChangeStatus = (e: any) => {
    setCurrentPage(e);
    // setStatus(e.value);
  };
  // Mock data - in real app this would come from API

  const pricingOptions = ["all", "Free", "Freemium", "Paid"];
  console.log("aiToolsaiTools", aiTools);

  const [showAllCategories, setShowAllCategories] = useState(false);
  const categoriesToShow = showAllCategories
    ? toolCategories.filter((c: any) => c?.tool_count > 50)
    : toolCategories.filter((c: any) => c?.tool_count > 50).slice(0, 5);

  const totalCategories = toolCategories.filter(
    (c: any) => c?.tool_count > 50
  ).length;

  const categoryLabel = category_name ? slugToLabel(category_name) : "";
  const canonicalPath = category_name
    ? `/ai-category-tools/${category_name}`
    : "/ai-tools";
  const canonicalUrl = buildCanonical(canonicalPath);

  const seoTitle = category_name
    ? `Best AI Tools for ${categoryLabel} – Compare & Pricing | TopAITools.ai`
    : "3000+ AI Tools Directory – Compare Features, Pricing & Free Plans | TopAITools.ai";

  const seoDescription = category_name
    ? `Discover, compare, and review the best AI tools for ${categoryLabel}. Browse features, pricing, free plans, and user ratings. Find alternatives to popular AI tools and make informed decisions.`
    : "Explore 3000+ curated AI tools across every category. Compare features, pricing, free plans, and user ratings. Discover the best AI tools for design, coding, marketing, sales, automation, and more.";

  const seoKeywords = category_name
    ? [`${categoryLabel} AI tools`]
    : [];

  const itemListEntries: ItemListEntry[] = (aiTools || []).map(
    (t: any, idx: number) => {
      const rawSlug =
        t?.slug ||
        ((t?.title || String(t?.id || idx))
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""));
      const encodedSlug = encodeURIComponent(rawSlug);
      const toolId = String(t?.id ?? idx + 1);
      const toolUrl = buildCanonical(`/ai-tools/${encodedSlug}/${toolId}`);
      return {
        position: idx + 1,
        name: t?.title || t?.name || `AI Tool ${idx + 1}`,
        url: toolUrl,
        image: t?.logo || undefined,
        description: truncate(t?.description || "", 120),
      };
    },
  );

  const breadcrumbItems = category_name
    ? [
        { label: "Home", path: "/" },
        { label: "AI Tools", path: "/ai-tools" },
        { label: categoryLabel, path: `/ai-category-tools/${category_name}` },
      ]
    : [
        { label: "Home", path: "/" },
        { label: "AI Tools", path: "/ai-tools" },
      ];

  const breadcrumbLd = buildBreadcrumbListLd(breadcrumbItems);
  const collectionPageLd = buildCollectionPageLd({
    name: seoTitle,
    description: seoDescription,
    url: canonicalUrl,
    items: itemListEntries,
    breadcrumb: breadcrumbItems,
    image: DEFAULT_OG_IMAGE,
  });

console.log("loadingloading", loading);
  return (
    <>
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalPath={canonicalPath}
        image={DEFAULT_OG_IMAGE}
        imageAlt={seoTitle}
        type="website"
      />
      <JsonLd id="aitools-breadcrumb" data={breadcrumbLd} />
      <JsonLd id="aitools-collectionpage" data={collectionPageLd} />
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* {loading && <Loader />} */}
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 inline-flex items-center gap-2">
            <span className="primary-gradient bg-clip-text text-transparent">
              AI Tools
            </span>
            <span className="text-lg md:text-xl text-muted-foreground font-normal">
              - Discover the best AI tools for every use case.
            </span>
          </h1>
        </div>
        <div className="md:text-3xl max-w-6xl mx-auto">
          <h3 className="font-bold mb-4 text-center">Top Categories</h3>

          <div className="text-center">
            {categoriesToShow.map((category: any) => (
              <Button
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category?.category_name
                      ? ""
                      : category?.category_name
                  )
                }
                variant={
                  selectedCategory === category?.category_name
                    ? "default"
                    : "outline"
                }
                className="m-2 text-transform-capitalize"
                key={category?.category_name}
              >
                {category?.category_name} ({category?.tool_count})
              </Button>
            ))}
            {totalCategories > 5 && (
              <Button
                onClick={() => setShowAllCategories(!showAllCategories)}
                variant="ghost"
                className="m-2 text-primary hover:text-primary/80"
              >
                {showAllCategories ? "Show Less" : "View All Categories"}
              </Button>
            )}
          </div>
        </div>
        {/* Filters */}
        {/* <div className="md:text-2xl max-w-6xl mx-auto mt-4 mb-8">
         <p>Explore thousands of AI tools across design, development, marketing, sales, automation, and more — all in one place to save time and choose smarter.</p>

        </div> */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-6xl mx-auto mt-2 ">

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search AI tools for design, coding, marketing, sales…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-10 h-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={startVoiceSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2"
              aria-label="Start voice search"
            >
              {isListening ? (
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-primary/50 opacity-75"></span>
                  <Mic className="h-4 w-4 text-primary relative z-10" />
                </div>
              ) : (
                <Mic className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 h-12">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {toolCategories.map((category: any) => (
                <SelectItem
                  key={category?.category_name}
                  value={category?.category_name}
                >
                  {/* {selectedCategory === "all"
                    ? "All Categories"
                    : category?.name} */}
                 <span className="text-sm text-muted-foreground text-transform-capitalize ">{category?.category_name} ({category?.tool_count})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* <Select value={selectedPricing} onValueChange={setSelectedPricing}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Pricing" />
            </SelectTrigger>
            <SelectContent>
              {pricingOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === "all" ? "All Pricing" : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(9)].map((_, index) => (
              <ToolCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {aiTools?.map((tool, index) => (
              <ToolCard key={tool.id || index} tool={tool} index={index} />
            ))}
          </div>
        )}

        <div className="ai-summary-pagination max-w-6xl mx-auto">
          {/* <Pagination
              defaultCurrent={1}
              current={currentPage}
              total={aiToolsPagination?.total}
              onChange={(val) => {
                console.log("val", val);
                handleChangeStatus(val);
              }}
              pageSize={10}
              showSizeChanger={false}
              // size="small"
            /> */}
          {aiToolsPagination && aiToolsPagination?.total > 0 && (
            <div className="flex items-center justify-between ai-pagination-content mt-4">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                {(aiToolsPagination.page - 1) * aiToolsPagination.limit + 1} to{" "}
                {Math.min(
                  aiToolsPagination.page * aiToolsPagination.limit,
                  aiToolsPagination.total
                )}{" "}
                of {aiToolsPagination.total} results
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={aiToolsPagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <span className="text-sm">
                  Page {aiToolsPagination.page} of{" "}
                  {aiToolsPagination?.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={
                    aiToolsPagination.page >= aiToolsPagination?.totalPages
                  }
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {aiTools?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No tools found matching your criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
                setSelectedPricing("all");
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
    </>
  );
};

export default AITools;
