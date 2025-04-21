"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  address: string;
}

export function KakaoMap({ address }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 카카오맵 API가 로드되었는지 확인
    if (typeof window.kakao === 'undefined') {
      console.warn("카카오맵 API가 로드되지 않았습니다.");
      return;
    }

    // 지도 초기화
    if (!mapRef.current) return;

    const container = mapRef.current;
    const options = {
      center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 서울 시청 기본 좌표
      level: 3,
    };

    const map = new window.kakao.maps.Map(container, options);
    const geocoder = new window.kakao.maps.services.Geocoder();

    if (address && address.trim() !== "") {
      geocoder.addressSearch(address, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(
            result[0].y,
            result[0].x
          );
          const marker = new window.kakao.maps.Marker({
            map: map,
            position: coords,
          });

          // 인포윈도우에 장소 정보 표시
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:12px;">${address}</div>`,
          });
          infowindow.open(map, marker);

          // 지도 중심 이동
          map.setCenter(coords);
        } else {
          console.error("주소 검색 실패:", address);
        }
      });
    } else {
      console.warn("주소가 제공되지 않았습니다.");
    }
  }, [address]);

  return <div ref={mapRef} className="w-full h-full rounded-lg" />;
}
