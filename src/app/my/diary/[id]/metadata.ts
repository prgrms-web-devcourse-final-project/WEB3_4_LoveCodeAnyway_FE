import { Metadata } from "next";
import axios from "axios";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const response = await axios.get(`/api/v1/diaries/${params.id}`);
    const diary = response.data.data;
    return {
      title: `${diary.themeName} - 탈출일지`,
      description: `${diary.storeName}의 ${diary.themeName} 탈출일지입니다.`,
    };
  } catch (error) {
    return {
      title: "탈출일지",
      description: "탈출일지 상세 페이지",
    };
  }
}
