export interface Party {
  id: string;
  title: string;
  themeName: string;
  storeName: string;
  date: string;
  time: string;
  currentMembers: number;
  maxMembers: number;
  location: string;
  thumbnailUrl: string;
  dueDate: string;
}

export interface Theme {
  id: string;
  name: string;
  storeName: string;
  genre: string;
  playTime: string;
  recommendedPlayers: string;
  thumbnailUrl: string;
  ranking?: number;
  isNew?: boolean;
  registeredAt?: string;
}
