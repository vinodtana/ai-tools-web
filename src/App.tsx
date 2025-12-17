import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import Index from "./pages/Index";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import AITools from "./pages/AITools";
import AIToolDetail from "./pages/AIToolDetail";
import ChatGPTPrompts from "./pages/ChatGPTPrompts";
import PromptDetail from "./pages/PromptDetail";
import AIArticles from "./pages/AIArticles";
import ArticleDetail from "./pages/ArticleDetail";
import AINews from "./pages/AINews";
import NewsDetail from "./pages/NewsDetail";
import AIInfluencers from "./pages/AIInfluencers";
import InfluencerDetail from "./pages/InfluencerDetail";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Newsletter from "./pages/Newsletter";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<AITools />} />
          
          {/* AI Tools Routes */}
          <Route path="/ai-tools" element={<AITools />} />
          <Route path="/ai-category-tools/:category_name" element={<AITools />} />
          <Route path="/ai-tools/:id" element={<AIToolDetail />} />
          <Route path="/ai-tools/:name/:id" element={<AIToolDetail />} />
          
          {/* ChatGPT Prompts Routes */}
          <Route path="/chatgpt-prompts" element={<ChatGPTPrompts />} />
          <Route path="/chatgpt-prompts/:id" element={<PromptDetail />} />
          <Route path="/chatgpt-prompts/:name/:id" element={<PromptDetail />} />
          
          {/* AI Articles Routes */}
          <Route path="/ai-articles" element={<AIArticles />} />
          <Route path="/ai-articles/:id" element={<ArticleDetail />} />
          <Route path="/ai-articles/:name/:id" element={<ArticleDetail />} />
          
          {/* AI News Routes */}
          <Route path="/ai-news" element={<AINews />} />
          <Route path="/ai-news/:id" element={<NewsDetail />} />
          <Route path="/ai-news/:name/:id" element={<NewsDetail />} />
          
          {/* AI Influencers Routes */}
          <Route path="/ai-influencers" element={<AIInfluencers />} />
          <Route path="/ai-influencers/:id" element={<InfluencerDetail />} />
          <Route path="/ai-influencers/:name/:id" element={<InfluencerDetail />} />
          
          {/* Categories Routes */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:name" element={<CategoryDetail />} />
          <Route path="/categories/:name/:id" element={<CategoryDetail />} />
          
          {/* Additional Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </Provider>
);

export default App;
