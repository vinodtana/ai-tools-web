import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Send, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from 'react';
import { getInTouchAPI } from "../store/features/contents/contentsSlice";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.name && formData.email && formData.subject && formData.message) {
      await dispatch(getInTouchAPI({ email: formData.email, name: formData.name, subject: formData.subject, message: formData.message }));  
      // Here you would typically handle the form submission, e.g., send the data to your server
      console.log('Form submitted:', formData);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      toast({
        title: "Message Sent",   
        description: "Thank you for reaching out to us. We'll get back to you soon.",
        duration: 5000,
      });
    } else {
      toast({
        title: "Error",  
        description: "Please fill in all fields before submitting.",  
        variant: "destructive",
        duration: 5000,
        
      });
    setIsSubmitted(true);
  };
}

  if (isSubmitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Message Sent Successfully! 🎉</h1>
            <p className="text-xl text-muted-foreground">
              Thank you for reaching out to us. We'll get back to you within 24 hours.
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
          <h1 className="text-5xl font-bold mb-6 primary-gradient bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions or want to submit your AI tool? We'd love to hear from you.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="hover:shadow-2xl transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Send className="h-6 w-6 text-primary" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full primary-gradient text-white hover:scale-105 transition-all duration-300">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;