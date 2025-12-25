import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  Bot,
  Zap,
  FileText,
  Newspaper,
  Users,
  FolderTree,
  Mail,
  Info,
  Phone,
  User,
  Settings,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoginModal from "./LoginModal";
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchCategories , setShowLoginModel} from "../store/features/contents/contentsSlice";
import { User as UserIcon, ChevronDown } from "lucide-react";
import { triggerMixpanelEvent } from "../Scenes/common";
import { fetchAITools } from "../store/features/contents/contentsSlice";
import { ITEMS_LIMIT } from "../config";
 
const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user, showLoginModel } = useAppSelector((state: any) => state.content);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, limit: 100, search: searchQuery }));
  }, []);
     useEffect(()=>{
    getAllAIToolsList();
    } ,[searchQuery])
    const getAllAIToolsList =()=>{
      const jsonObj = { page: 1, limit: ITEMS_LIMIT, search: searchQuery, user_id: user?.id || ""};
      dispatch(fetchAITools(jsonObj));  
    }

  useEffect(()=>{
    if(showLoginModel){
      triggerMixpanelEvent("trigger_login_model");
      setIsLoginOpen(true);
      dispatch(setShowLoginModel(false));
    }
  }, [showLoginModel])

  // 👇 Run this whenever route changes
  useEffect(() => {
    if (location?.pathname) {
      triggerMixpanelEvent("page_view", {
        path: location.pathname,
      });
    }
  }, [location.pathname]); // <-- dependency on path

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
        navigate("/ai-tools");
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

  const primaryNavigation = [
    { name: "AI Tools", href: "/ai-tools", icon: Bot },
    { name: "ChatGPT Prompts", href: "/chatgpt-prompts", icon: Zap },
    { name: "AI Articles", href: "/ai-articles", icon: FileText },
    { name: "AI News", href: "/ai-news", icon: Newspaper },
    // { name: "AI Influencers", href: "/ai-influencers", icon: Users },
    { name: "Categories", href: "/categories", icon: FolderTree },
  ];

  const secondaryNavigation = [
    { name: "Newsletter", href: "/newsletter", icon: Mail }
  ];
    {/* { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Phone }, */}

  const userNavigation = [
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
    
  ];

  const isActive = (path: string) => {
    // Exact match for the current path
    if (location.pathname === path) return true;

    // Check for parent-child relationships for detail pages
    const pathSegments = path?.split("/").filter(Boolean);
    const currentSegments = location.pathname?.split("/").filter(Boolean);

    // If we're on a detail page, check if the parent section matches
    if (currentSegments.length > pathSegments.length) {
      // Build the parent path from current segments
      const parentPath = "/" + pathSegments.join("/");
      const currentParentPath =
        "/" + currentSegments.slice(0, pathSegments.length).join("/");
      return parentPath === currentParentPath;
    }

    return false;
  };
  const uemailchat = user?.email?.charAt(0);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-secondary/50 backdrop-blur supports-[backdrop-filter]:bg-secondary/100">
        <div className="container mx-auto px-4">
          {/* Top Row - Logo, Search, User Actions */}
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg primary-gradient">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold primary-gradient bg-clip-text text-transparent">
                Top<span className="ai-name-top-primary">AI</span>Tools
              </span>
            </Link>

            {/* Search & Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search AI tools..."
                    value={searchQuery}
                    onChange={(e) => {navigate("/ai-tools"); setSearchQuery(e.target.value);}}
                    className="w-96 pl-9 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={startVoiceSearch}
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    aria-label="Start voice search"
                  >
                    <Mic className={`h-4 w-4 ${isListening ? "text-primary" : "text-muted-foreground"}`} />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Global Search */}

              {/* User Navigation */}
              <div className="hidden sm:flex items-center space-x-2">
                {user?.id && (
                  <>
                    {" "}
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </>
                )}
              </div>

              {/* Login Button */}

              {/* <Button
                variant="outline"
                onClick={() => setIsLoginOpen(true)}
                className="hidden sm:flex"
              >
                Login 1
              </Button> */}
              <div className="hidden sm:flex items-center space-x-2">
                {!user?.id ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsLoginOpen(true)}
                    className="hidden sm:flex"
                  >
                    Login
                  </Button>
                ) : (
                  <div className="relative">
                    <button
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                      <span>
                        {user?.name?.split(" ")[0] || uemailchat?.toUpperCase()}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-md shadow-lg z-10">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/about"
                          className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          About
                        </Link>
                        <Link
                          to="/contact"
                          className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Contact
                        </Link>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                          onClick={() => {
                            localStorage.clear();
                            window.location.href = "/";
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Second Row - Main Navigation (Desktop) */}
          <div className="hidden md:block border-t border-border/40">
            <div className="flex h-12 items-center justify-center space-x-1">
              {/* Primary Navigation */}
              <div className="flex items-center space-x-1">
                {primaryNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-md text-[18px] font-medium transition-colors hover-scale
                      ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground text-primary shadow-md"
                          : "text-muted-foreground text-primary hover:text-foreground hover:bg-accent/50"
                      }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Separator */}
              <div className="h-6 w-px bg-border mx-4"></div>

              {/* Secondary Navigation */}
              <div className="flex items-center space-x-1">
                {secondaryNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium transition-colors hover-scale
                      ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground text-primary shadow-md"
                          : "text-muted-foreground text-primary hover:text-foreground hover:bg-accent/50"
                      }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2 animate-fade-in border-t border-border/40">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search AI tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9"
                />
              </div>

              {/* Primary Navigation */}
              <div className="space-y-1">
                <h4 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  AI Tools & Resources
                </h4>
                {primaryNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full
                      ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Secondary Navigation */}
              <div className="space-y-1">
                <h4 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Company
                </h4>
                {secondaryNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full
                      ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile User Navigation */}
              <div className="border-t border-border pt-4 mt-4 space-y-1">
                <h4 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Account
                </h4>
                {userNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full
                      ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setIsLoginOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full mt-4"
              >
                Login
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg primary-gradient">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold primary-gradient bg-clip-text text-transparent">
                  Top<span className="ai-name-top-primary">AI</span>Tools
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Discover the best AI tools, stay updated with latest AI news,
                and connect with AI influencers.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Quick Links</h4>
              <div className="space-y-2">
                <Link
                  to="/ai-tools"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  AI Tools
                </Link>
                <Link
                  to="/chatgpt-prompts"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  ChatGPT Prompts
                </Link>
                <Link
                  to="/ai-articles"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  AI Articles
                </Link>
                <Link
                  to="/ai-news"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  AI News
                </Link>
              </div>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Resources</h4>
              <div className="space-y-2">
                <Link
                  to="/about"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  Contact Us
                </Link>
                <Link
                  to="/newsletter"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  Newsletter
                </Link>
              </div>
            </div>

            {/* Account */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Account</h4>
              <div className="space-y-2">
                <Link
                  to="/profile"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  My Profile
                </Link>
                <Link
                  to="/settings"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  Settings
                </Link>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Stay Updated</h4>
              <p className="text-sm text-muted-foreground">
                Get the latest AI tools and updates delivered to your inbox.
              </p>
              <div className="flex space-x-2">
                {/* <Input placeholder="Enter your email" className="flex-1" /> */}
                <Button size="sm" className="primary-gradient" asChild>
                  <Link to="/newsletter">Subscribe</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2025 TopAITools. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </div>
  );
};

export default Layout;
