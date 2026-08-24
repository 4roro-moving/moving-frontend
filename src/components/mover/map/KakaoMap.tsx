"use client";

import { useEffect, useRef, useState } from "react";

import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import {
  MAP_BRAND_COLOR,
  MOVER_CLUSTER_STYLES,
  MOVER_SUMMARY_STYLES,
  ROUTE_LINE_STYLE,
} from "@/components/mover/map/KakaoMap.styles";
import type { AddressSearchItem } from "@/lib/kakao/addressSearch";
import { loadKakaoMaps } from "@/lib/kakao/loadKakaoMaps";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
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

const MOVER_MARKER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="52" height="64" viewBox="0 0 52 64">
  <defs><filter id="s" x="-30%" y="-20%" width="160%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity=".25"/></filter></defs>
  <g filter="url(#s)">
    <path fill="${MAP_BRAND_COLOR}" d="M26 62c-2.2 0-17-17.2-17-35C9 17.6 16.6 10 26 10s17 7.6 17 17c0 17.8-14.8 35-17 35Z"/>
    <circle cx="26" cy="27" r="13" fill="#fff"/>
    <path fill="#FFD2B8" d="M19 27a7 7 0 1 0 14 0v-2H19v2Z"/>
    <path fill="#FFC400" d="M17 24a9 9 0 0 1 18 0H17Z"/>
    <path fill="#E8A900" d="M16 24h20a2 2 0 0 1-2 3H18a2 2 0 0 1-2-3Z"/>
    <circle cx="23" cy="28" r="1" fill="#4A342E"/><circle cx="29" cy="28" r="1" fill="#4A342E"/>
    <path d="M23 32c1.6 1.2 4.4 1.2 6 0" fill="none" stroke="#D56A5A" stroke-linecap="round"/>
  </g>
</svg>`;

const MOVER_MARKER_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(MOVER_MARKER_SVG)}`;

const DEPARTURE_MARKER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="54" height="62" viewBox="0 0 54 62">
  <defs><filter id="s" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity=".24"/></filter></defs>
  <g filter="url(#s)">
    <path fill="${MAP_BRAND_COLOR}" d="M27 60c-2 0-16-16.2-16-33 0-8.8 7.2-16 16-16s16 7.2 16 16c0 16.8-14 33-16 33Z"/>
    <rect x="16" y="17" width="22" height="22" rx="5" fill="#FFF4E8"/>
    <path fill="#D99045" d="M18 23.5 27 19l9 4.5v12.8a2 2 0 0 1-2 2H20a2 2 0 0 1-2-2V23.5Z"/>
    <path fill="#F2B86B" d="m18 23.5 9 4.5 9-4.5-9-4.5-9 4.5Z"/>
    <path d="M27 28v10M23 21l9 4.5" fill="none" stroke="#B87333" stroke-width="1.5"/>
    <circle cx="23.5" cy="31" r="1" fill="#5B3A29"/><circle cx="30.5" cy="31" r="1" fill="#5B3A29"/>
    <path d="M24 34c1.7 1.3 4.3 1.3 6 0" fill="none" stroke="#8D4E35" stroke-linecap="round"/>
  </g>
</svg>`;

const DESTINATION_MARKER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="54" height="62" viewBox="0 0 54 62">
  <defs><filter id="s" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity=".24"/></filter></defs>
  <g filter="url(#s)">
    <path fill="${MAP_BRAND_COLOR}" d="M27 60c-2 0-16-16.2-16-33 0-8.8 7.2-16 16-16s16 7.2 16 16c0 16.8-14 33-16 33Z"/>
    <circle cx="27" cy="27" r="12" fill="#FFF"/>
    <path d="M23 35V19" fill="none" stroke="#5B3A29" stroke-width="2.4" stroke-linecap="round"/>
    <path fill="${MAP_BRAND_COLOR}" d="M24 19h11l-2.8 4 2.8 4H24v-8Z"/>
    <path d="M20 36h14" fill="none" stroke="#F2B86B" stroke-width="2.4" stroke-linecap="round"/>
    <path d="m18.5 19 .8-2M36 17.5l1.6-1.4M38 31l2 .7" fill="none" stroke="#FFC400" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>`;

const DEPARTURE_MARKER_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(DEPARTURE_MARKER_SVG)}`;
const DESTINATION_MARKER_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(DESTINATION_MARKER_SVG)}`;
const EMPTY_MOVERS: Mover[] = [];

function createMoverSummary(mover: Mover): HTMLElement {
  const card = document.createElement("article");
  card.setAttribute("aria-label", `${mover.name} 기사님 요약`);
  card.style.cssText = MOVER_SUMMARY_STYLES.card;

  const header = document.createElement("div");
  header.style.cssText = MOVER_SUMMARY_STYLES.header;
  const avatar = document.createElement("img");
  avatar.src = mover.profileImageSrc;
  avatar.alt = "";
  avatar.style.cssText = MOVER_SUMMARY_STYLES.avatar;
  const identity = document.createElement("div");
  identity.style.cssText = MOVER_SUMMARY_STYLES.identity;
  const name = document.createElement("strong");
  name.textContent = `${mover.name} 기사님`;
  name.style.cssText = MOVER_SUMMARY_STYLES.name;
  const stats = document.createElement("span");
  stats.textContent = `★ ${mover.rating.toFixed(1)} · 리뷰 ${mover.reviewCount} · 경력 ${mover.careerYears}년`;
  stats.style.cssText = MOVER_SUMMARY_STYLES.stats;
  identity.append(name, stats);
  header.append(avatar, identity);

  const link = document.createElement("a");
  link.href = APP_ROUTES.MOVERS.DETAIL(mover.id);
  link.textContent = "프로필 보기";
  link.style.cssText = MOVER_SUMMARY_STYLES.profileLink;
  let isNavigating = false;
  const openProfile = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isNavigating) return;
    isNavigating = true;
    window.location.href = APP_ROUTES.MOVERS.DETAIL(mover.id);
  };
  const stopMapInteraction = (event: Event) => event.stopPropagation();
  card.addEventListener("pointerdown", stopMapInteraction);
  card.addEventListener("mousedown", stopMapInteraction);
  card.addEventListener("touchstart", stopMapInteraction, { passive: true });
  link.addEventListener("pointerdown", openProfile);
  link.addEventListener("click", openProfile);
  card.append(header, link);
  return card;
}

export default function KakaoMap({ departure, destination, movers = EMPTY_MOVERS }: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let disposed = false;
    const routeMarkers: KakaoMapMarker[] = [];
    let routeLine: KakaoMapPolyline | null = null;
    const moverOverlays: KakaoMapCustomOverlay[] = [];
    let moverClusterer: KakaoMapMarkerClusterer | null = null;
    let activeOverlay: KakaoMapCustomOverlay | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    void loadKakaoMaps()
      .then((maps) => {
        if (disposed || !containerRef.current) return;

        const center = new maps.LatLng(SEOUL_CITY_HALL.latitude, SEOUL_CITY_HALL.longitude);
        const map = new maps.Map(containerRef.current, {
          center,
          level: 7,
          tileAnimation: false,
        });

        if (departure && destination) {
          const departurePosition = new maps.LatLng(departure.latitude, departure.longitude);
          const destinationPosition = new maps.LatLng(destination.latitude, destination.longitude);
          const departureMarkerImage = new maps.MarkerImage(
            DEPARTURE_MARKER_URL,
            new maps.Size(54, 62),
            { offset: new maps.Point(27, 60) },
          );
          const destinationMarkerImage = new maps.MarkerImage(
            DESTINATION_MARKER_URL,
            new maps.Size(54, 62),
            { offset: new maps.Point(27, 60) },
          );

          routeLine = new maps.Polyline({
            map,
            path: [departurePosition, destinationPosition],
            ...ROUTE_LINE_STYLE,
          });

          routeMarkers.push(
            new maps.Marker({
              map,
              position: departurePosition,
              title: "출발지",
              image: departureMarkerImage,
            }),
            new maps.Marker({
              map,
              position: destinationPosition,
              title: "도착지",
              image: destinationMarkerImage,
            }),
          );

          const bounds = new maps.LatLngBounds();
          bounds.extend(departurePosition);
          bounds.extend(destinationPosition);
          const moverMarkers: KakaoMapMarker[] = [];
          const moverMarkerImage = new maps.MarkerImage(MOVER_MARKER_URL, new maps.Size(52, 64), {
            offset: new maps.Point(26, 62),
          });

          for (const mover of movers) {
            if (!mover.activityBase) continue;

            const moverPosition = new maps.LatLng(
              mover.activityBase.latitude,
              mover.activityBase.longitude,
            );
            const marker = new maps.Marker({
              position: moverPosition,
              title: `${mover.name} 기사님`,
              image: moverMarkerImage,
            });
            const card = createMoverSummary(mover);
            const overlay = new maps.CustomOverlay({
              position: moverPosition,
              content: card,
              xAnchor: 0.5,
              yAnchor: 1.34,
              zIndex: 10,
              clickable: true,
            });
            const showOverlay = () => {
              if (hideTimer) clearTimeout(hideTimer);
              activeOverlay?.setMap(null);
              overlay.setMap(map);
              activeOverlay = overlay;
            };
            const scheduleHide = () => {
              if (hideTimer) clearTimeout(hideTimer);
              hideTimer = setTimeout(() => {
                overlay.setMap(null);
                if (activeOverlay === overlay) activeOverlay = null;
              }, 0);
            };

            maps.event.addListener(marker, "mouseover", showOverlay);
            maps.event.addListener(marker, "mouseout", scheduleHide);
            maps.event.addListener(marker, "click", showOverlay);
            card.addEventListener("mouseenter", showOverlay);
            card.addEventListener("mouseleave", scheduleHide);
            moverMarkers.push(marker);
            moverOverlays.push(overlay);
            bounds.extend(moverPosition);
          }

          if (moverMarkers.length > 0) {
            moverClusterer = new maps.MarkerClusterer({
              map,
              markers: moverMarkers,
              averageCenter: true,
              minLevel: 6,
              calculator: [10, 25, 50, 100],
              styles: MOVER_CLUSTER_STYLES,
            });
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
      if (hideTimer) clearTimeout(hideTimer);
      routeLine?.setMap(null);
      moverOverlays.forEach((overlay) => overlay.setMap(null));
      moverClusterer?.clear();
      routeMarkers.forEach((marker) => marker.setMap(null));
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
