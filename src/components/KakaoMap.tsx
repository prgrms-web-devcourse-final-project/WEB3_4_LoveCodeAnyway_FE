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
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=c7a8d02700c8f3c7c0f74ac6f1944c3a&autoload=false&libraries=services`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
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
      });
    };

    return () => {
      // 스크립트가 아직 DOM에 있는 경우에만 제거
      const scriptEl = document.querySelector(
        `script[src^="//dapi.kakao.com/v2/maps/sdk.js"]`
      );
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [address]);

  return <div ref={mapRef} className="w-full h-full rounded-lg" />;
}
