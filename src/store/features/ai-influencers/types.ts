export interface AIInfluencer {
  id: string;
  name: string;
  bio: string;
  expertise: string[];
  socialMedia: {
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
  };
  followers: number;
  posts: number;
  engagement: number;
  avatar: string;
  verified: boolean;
  featured: boolean;
}

export interface AIInfluencersState {
  influencers: AIInfluencer[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedExpertise: string;
  totalPages: number;
  currentPage: number;
}