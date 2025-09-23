import { useState, } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Calendar, Edit, Save, Star, Bookmark } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAppDispatch, useAppSelector } from "./../store/hooks";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from 'react';
import { handlePrifileSave } from "../store/features/contents/contentsSlice";
import{setUpdateUserData} from "../store/features/contents/contentsSlice";

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { toast } = useToast();
  

  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    bio: 'AI enthusiast and software developer passionate about machine learning.'
  });
  const { user } = useAppSelector(
    (state: any) => state.content
  );
  console.log("profile user", user);
  const stats = [
    { label: 'Tools Reviewed', value: '24', icon: Star },
    { label: 'Bookmarks', value: '89', icon: Bookmark }
  ];
useEffect(() => {
    if (user?.id) {
      setUserProfile({
        name: user.name || '',
        bio: user.bio || 'No bio available.'
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsEditing(false);
    const resp = await dispatch(handlePrifileSave({ id: user.id, user: userProfile }));
    console.log("profile save resp", resp);
    dispatch(setUpdateUserData({...user, name: userProfile.name, bio: userProfile.bio}));
  };
  const uName = user?.name?.split(' ').map(n => n[0]).join('');
  const uemailchat = user?.email?.charAt(0);
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 hover:shadow-2xl transition-all duration-500 animate-fade-in">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-32 h-32">
                  <AvatarFallback className="text-2xl">
                    {uName?.toUpperCase() || uemailchat?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        value={userProfile.bio}
                        onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="primary-gradient text-white">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h1 className="text-3xl font-bold">{userProfile.name}</h1>
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{userProfile.bio}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      {/* <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(userProfile.joinDate).toLocaleDateString()}</span>
                      </div> */}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold primary-gradient bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;