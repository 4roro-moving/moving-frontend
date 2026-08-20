"use client";

import { useEffect, useRef, useState } from "react";

import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import type { AddressSearchItem } from "@/lib/kakao/addressSearch";
import { loadKakaoMaps } from "@/lib/kakao/loadKakaoMaps";
import type { Mover } from "@/types/mover";

interface KakaoMapProps {
  departure?: AddressSearchItem;
  destination?: AddressSearchItem;
  movers?: Mover[];
}

const SEOUL_CITY_HALL = {
  latitude: 37.5665,
  longitude: 126.978,
};

export default function KakaoMap({ departure, destination, movers = [] }: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let disposed = false;
    const markers: KakaoMapMarker[] = [];

    void loadKakaoMaps()
      .then((maps) => {
        if (disposed || !containerRef.current) return;

        const center = new maps.LatLng(SEOUL_CITY_HALL.latitude, SEOUL_CITY_HALL.longitude);
        const map = new maps.Map(containerRef.current, {
          center,
          level: 7,
        });

        if (departure && destination) {
          const departurePosition = new maps.LatLng(departure.latitude, departure.longitude);
          const destinationPosition = new maps.LatLng(destination.latitude, destination.longitude);

          markers.push(
            new maps.Marker({ map, position: departurePosition, title: "출발지" }),
            new maps.Marker({ map, position: destinationPosition, title: "도착지" }),
          );

          const bounds = new maps.LatLngBounds();
          bounds.extend(departurePosition);
          bounds.extend(destinationPosition);
          for (const mover of movers) {
            if (!mover.activityBase) continue;

            const moverPosition = new maps.LatLng(
              mover.activityBase.latitude,
              mover.activityBase.longitude,
            );
            markers.push(
              new maps.Marker({ map, position: moverPosition, title: `${mover.name} 기사님` }),
            );
            bounds.extend(moverPosition);
          }
          map.setBounds(bounds, 80, 80, 80, 80);
        }

        setStatus("ready");
      })
      .catch((error: unknown) => {
        console.error("[KakaoMap] 지도 SDK 초기화 실패", error);

        if (!disposed) {
          setStatus("error");
        }
      });

    return () => {
      disposed = true;
      markers.forEach((marker) => marker.setMap(null));
    };
  }, [departure, destination, movers, retryCount]);

  return (
    <section
      aria-label={departure && destination ? "출발지와 도착지 지도" : "서울시청 중심 지도"}
      className="bg-background-subtle relative min-h-[520px] flex-1 lg:min-h-0"
    >
      <div ref={containerRef} className="absolute inset-0" />

      {status === "loading" && (
        <div className="bg-background-subtle absolute inset-0 z-10 flex items-center justify-center">
          <Text as="p" variant="md-medium" className="text-text-muted">
            지도를 불러오는 중입니다.
          </Text>
        </div>
      )}

      {status === "error" && (
        <div
          role="alert"
          className="bg-background-subtle absolute inset-0 z-10 flex flex-col items-center justify-center gap-16 px-24 text-center"
        >
          <Text as="p" variant="md-medium" className="text-text-error">
            지도를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </Text>
          <Button
            size="md"
            onClick={() => {
              setStatus("loading");
              setRetryCount((count) => count + 1);
            }}
          >
            다시 시도
          </Button>
        </div>
      )}
    </section>
  );
}
