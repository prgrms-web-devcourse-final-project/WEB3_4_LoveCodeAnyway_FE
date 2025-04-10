export interface Diary {
  id: string;
  themeName: string;
  storeName: string;
  isSuccess: boolean;
  playDate: string;
  escapeTime: string;
  hintCount: number;
}

export interface DiaryDetail extends Diary {
  themeImage: string;
  escapeImages?: string[];
  participants?: string;
  ratings: {
    interior: number;
    composition: number;
    story: number;
    production: number;
    satisfaction: number;
    deviceRatio: number;
    difficulty: number;
    horror: number;
    activity: number;
  };
  comment?: string;
}
