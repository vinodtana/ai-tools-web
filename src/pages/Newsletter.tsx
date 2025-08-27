import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, Calendar, Users, Zap, TrendingUp, Bell, Star } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from 'react';
import { SubscribeNewsletter } from "../store/features/contents/contentsSlice";
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleSubscribe = async(e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      await dispatch(SubscribeNewsletter({ email }));
      setIsSubscribed(true);
    }
  };

  if (isSubscribed) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome to the AI Community! 🎉</h1>
            <p className="text-xl text-muted-foreground">
              Thank you for subscribing to Top<span className='ai-name-top-primary'>AI</span>Tools Newsletter. You'll receive your first edition within 24 hours.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-16 animate-fade-in">
          <Mail className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6 primary-gradient bg-clip-text text-transparent">
            Top<span className='ai-name-top-primary'>AI</span>Tools Newsletter
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Stay ahead of the AI revolution with our weekly newsletter. Get the latest tools, insights, 
            and expert analysis delivered straight to your inbox.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="hover:shadow-2xl transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Subscribe Now</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full primary-gradient text-white hover:scale-105 transition-all duration-300">
                  <Mail className="mr-2 h-4 w-4" />
                  Subscribe to Newsletter
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Newsletter;