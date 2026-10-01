import AuthForm from "@/components/AuthForm";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SocialLoginButtons from "@/components/SocialLoginButtons/SocialLoginButtons";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { handleLoginAPI, handleSignupAPI } from "../store/features/contents/contentsSlice";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.content);
  const navigate = useNavigate();

   useEffect(() => {
      console.log("user auth form login page",user);
      if (user && user?.id) {
       navigate("/ai-tools")
      }
    }, [user]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto w-full max-w-md">
          <Card>
            <CardContent className="pt-6">
              <AuthForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;

