import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2,
  TrendingUp,
  Building,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import Layout from '@/components/Layout';
import RightSidebar from '@/components/RightSidebar';

const NewsDetail = () => {
  const { id } = useParams();
  
  // Mock news data
  const news = {
    id: parseInt(id || '1'),
    title: 'OpenAI Announces GPT-4 Turbo with Enhanced Capabilities',
    summary: 'The latest iteration of GPT-4 brings improved performance, longer context windows, and reduced costs for developers.',
    content: `
OpenAI today announced the release of GPT-4 Turbo, the latest and most advanced version of their flagship language model. This announcement comes as part of OpenAI's DevDay conference, marking a significant milestone in the evolution of large language models.

## Key Improvements

The new GPT-4 Turbo brings several major enhancements:

**Extended Context Window**: GPT-4 Turbo now supports up to 128,000 tokens of context, equivalent to about 300 pages of text. This represents a 4x increase from the previous version, enabling more comprehensive conversations and document analysis.

**Updated Knowledge Cutoff**: The model's training data now extends to April 2024, providing more recent information and reducing knowledge gaps that existed in previous versions.

**Enhanced Performance**: OpenAI reports significant improvements in reasoning capabilities, mathematical problem-solving, and code generation tasks.

**Cost Efficiency**: Despite the enhanced capabilities, GPT-4 Turbo is priced more competitively, with input tokens costing 3x less and output tokens costing 2x less than GPT-4.

## New Features

### JSON Mode
GPT-4 Turbo introduces a native JSON mode, ensuring the model responds with valid JSON when requested. This feature is particularly valuable for developers building applications that require structured data output.

### Function Calling Improvements
The model now supports calling multiple functions in a single message, streamlining complex workflows and reducing the number of API calls required for sophisticated tasks.

### Improved Instruction Following
Enhanced fine-tuning has resulted in better adherence to system messages and user instructions, providing more reliable and predictable outputs.

## Industry Impact

The release of GPT-4 Turbo is expected to have far-reaching implications across various industries:

**Software Development**: Enhanced code generation and debugging capabilities will accelerate software development cycles.

**Content Creation**: The expanded context window enables more comprehensive content analysis and generation for marketing and educational materials.

**Research and Analysis**: Researchers can now process larger documents and datasets more effectively, opening new possibilities for AI-assisted research.

**Customer Service**: Improved instruction following and context retention will enhance AI-powered customer support systems.

## Developer Reception

Early access developers have praised the improvements, particularly noting:
- Faster response times despite increased capabilities
- More accurate code generation for complex programming tasks
- Better handling of nuanced instructions and edge cases
- Improved multilingual performance

## Availability and Pricing

GPT-4 Turbo is now available through the OpenAI API for all developers. The new pricing structure makes it more accessible for startups and smaller organizations:

- Input: $0.01 per 1K tokens
- Output: $0.03 per 1K tokens

## Looking Forward

OpenAI has hinted at additional features coming soon, including:
- Enhanced multimodal capabilities
- Improved fine-tuning options
- Better integration with external tools and APIs

This release reinforces OpenAI's position at the forefront of AI development and sets new standards for what's possible with large language models.

The company also announced that GPT-4 Turbo will be integrated into ChatGPT Plus and Enterprise plans in the coming weeks, bringing these advanced capabilities directly to end users.
    `,
    publishDate: '2024-01-10',
    readTime: '5 min read',
    category: 'Product Launch',
    tags: ['OpenAI', 'GPT-4', 'Language Models', 'API'],
    source: 'OpenAI Official Blog',
    sourceUrl: 'https://openai.com/blog',
    trending: true,
    views: '25.3K',
    image: '/placeholder.svg'
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Back Button */}
            <div className="mb-8">
              <Link to="/ai-news">
                <Button variant="outline" className="group hover:bg-primary hover:text-white transition-all duration-200">
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to AI News
                </Button>
              </Link>
            </div>

            {/* News Header */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="primary-gradient text-white">
                      {news.category}
                    </Badge>
                    {news.trending && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    {news.title}
                  </h1>
                  
                  <p className="text-xl text-muted-foreground mb-6">
                    {news.summary}
                  </p>
                </div>

                {/* News Meta */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(news.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{news.readTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>{news.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{news.views} views</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {news.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-primary/5 text-primary border-primary/20">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" className="hover:bg-primary hover:text-white transition-all duration-200">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share News
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={news.sourceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Original Source
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* News Content */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div className="whitespace-pre-line leading-relaxed">
                    {news.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Info */}
            <Card className="">
              <CardHeader>
                <CardTitle>About This News</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Source</span>
                  <a 
                    href={news.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {news.source}
                  </a>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Published</span>
                  <span className="font-medium">{new Date(news.publishDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Reading Time</span>
                  <span className="font-medium">{news.readTime}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-medium">{news.views}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block w-80">
            <RightSidebar />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewsDetail;