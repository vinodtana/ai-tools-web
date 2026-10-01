import AuthForm from "@/components/AuthForm";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";

const Login = () => {
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

