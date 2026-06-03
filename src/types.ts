export interface PhotoMemory {
  id: string;
  imageUrl: string;
  title: string;
  date: string;
  story: string;
  type?: "photo" | "video";
  videoUrl?: string;
}

export interface WishItem {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
}

export interface AnniversarySettings {
  coupleName1: string;
  coupleName2: string;
  anniversaryDate: string; // ISO date string or YYYY-MM-DD
  anniversaryType: "dating" | "wedding";
  greetingTitle: string;
  audioUrl: string;
  loveLetterText: string;
  loveLetterSign: string;
  memories: PhotoMemory[];
  wishes: WishItem[];
  futureWishesText: string;
}
