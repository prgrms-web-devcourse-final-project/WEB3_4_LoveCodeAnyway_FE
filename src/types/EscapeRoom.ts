export interface Host {
  name: string;
  image: string;
}

export interface EscapeRoom {
  id?: string;
  title: string;
  category: string;
  date: string;
  participants: string;
  location: string;
  image?: string;
  host?: Host;
  subInfo?: string;
  rating?: string;
  tags?: string[];
  description?: string;
}
