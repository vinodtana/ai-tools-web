import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, Award, Lightbulb, Globe, Heart, TrendingUp, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';

const About = () => {
  const mission = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To democratize access to AI tools and knowledge, making cutting-edge artificial intelligence accessible to everyone.'
    },
    {
      icon: Lightbulb,
      title: 'Our Vision',
      description: 'A world where AI empowers human creativity and productivity, bridging the gap between innovation and practical application.'
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'Transparency, innovation, community-first approach, and commitment to ethical AI development and usage.'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold mb-6 primary-gradient bg-clip-text text-transparent">
            About Top<span className='ai-name-top-primary'>AI</span>Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We're on a mission to make artificial intelligence accessible, understandable, and beneficial for everyone. 
            From AI newcomers to seasoned professionals, we provide the tools and knowledge you need to succeed in the AI era.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="primary-gradient text-white hover:scale-105 transition-all duration-300" asChild>
              <Link to="/newsletter">
                Join Our Newsletter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in">
          {mission.map((item, index) => (
            <Card key={index} className="hover:shadow-2xl hover:scale-105 transition-all duration-500">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default About;