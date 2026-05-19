import { useEffect, useRef, useState } from "react";
import { Mic, Calendar, Play, X, ExternalLink } from "lucide-react";
import { youtubeService } from "@/services/youtube.service";
import { PrototypeCard } from "@/components/ui/PrototypeCard";
import {
  PageContent,
  EmptyState,
  EmptyStateTitle,
  EmptyStateText,
  HeroGradient,
  HeroTitle,
  HeroSubtitle,
} from "@/components/layout/PageLayout";
import { Spinner } from "@/components/ui/Spinner";
import { styled, keyframes } from "@/theme/stitches.config";
import type { YouTubeVideo } from "@/types/domain";

const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const slideUp = keyframes({
  from: { opacity: 0, transform: "translateY(14px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const List = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$4",
  padding: "$4",
  "@md": { display: "grid", gridTemplateColumns: "1fr 1fr", padding: "$5" },
  "@lg": { gridTemplateColumns: "repeat(3, 1fr)" },
});

const VideoCard = styled("div", {
  backgroundColor: "$bgPaper",
  borderRadius: "$lg",
  overflow: "hidden",
  border: "1.5px solid $divider",
  cursor: "pointer",
  transition: "transform 0.18s ease, box-shadow 0.18s ease",
  animation: `${slideUp} 0.3s ease both`,
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 10px 30px rgba(0,43,92,0.15)",
  },
  "&:active": { transform: "scale(0.97)" },
});

const Thumb = styled("div", {
  position: "relative",
  paddingBottom: "56.25%",
  overflow: "hidden",
  backgroundColor: "#000",
  "& img": {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  [`${VideoCard}:hover & img`]: { transform: "scale(1.04)" },
});

const GradientOverlay = styled("div", {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to bottom, transparent 30%, rgba(0,43,92,0.75) 100%)",
  pointerEvents: "none",
});

const PlayBtn = styled("div", {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "52px",
  height: "52px",
  borderRadius: "50%",
  backgroundColor: "$secondary",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
  transition: "transform 0.15s ease, background-color 0.15s ease",
  [`${VideoCard}:hover &`]: {
    transform: "translate(-50%, -50%) scale(1.12)",
    backgroundColor: "$secondaryDark",
  },
});

const DateBadge = styled("div", {
  position: "absolute",
  bottom: "$2",
  left: "$2",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  backgroundColor: "rgba(255,255,255,0.92)",
  borderRadius: "$sm",
  padding: "3px 8px",
  fontSize: "11px",
  fontWeight: "$semibold",
  color: "$textSecondary",
});

const VideoInfo = styled("div", { padding: "$3 $4 $4" });

const VideoTitle = styled("p", {
  fontSize: "$sm",
  fontWeight: "$semibold",
  color: "$textPrimary",
  margin: "0 0 8px 0",
  lineHeight: 1.45,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

const WatchRow = styled("div", {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  fontSize: "$xs",
  fontWeight: "$bold",
  color: "$secondary",
  letterSpacing: "0.03em",
});

const ModalOverlay = styled("div", {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.9)",
  backdropFilter: "blur(8px)",
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "$4",
  animation: `${fadeIn} 0.2s ease`,
});

const ModalContent = styled("div", {
  width: "100%",
  maxWidth: "760px",
  animation: `${slideUp} 0.25s ease`,
});

const ModalHeader = styled("div", {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "$3",
  marginBottom: "$3",
});

const ModalTitle = styled("p", {
  color: "#fff",
  fontSize: "$md",
  fontWeight: "$semibold",
  margin: 0,
  lineHeight: 1.4,
  flex: 1,
});

const CloseBtn = styled("button", {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.15)",
  border: "none",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
  transition: "background 0.15s",
  "&:hover": { background: "rgba(255,255,255,0.28)" },
});

const IframeWrap = styled("div", {
  position: "relative",
  paddingBottom: "56.25%",
  borderRadius: "$md",
  overflow: "hidden",
  backgroundColor: "#000",
  "& iframe": {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },
});

const ExternalRow = styled("div", {
  display: "flex",
  justifyContent: "center",
  marginTop: "$3",
});

const ExtLink = styled("a", {
  display: "inline-flex",
  alignItems: "center",
  gap: "$2",
  fontSize: "$sm",
  fontWeight: "$semibold",
  color: "$secondary",
  textDecoration: "none",
  padding: "$2 $4",
  borderRadius: "$pill",
  border: "1.5px solid $secondary",
  transition: "all 0.15s",
  "&:hover": { backgroundColor: "rgba(197,160,89,0.12)" },
});

const HeroRow = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "$4",
});

const HeroLeft = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$3",
});

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

export default function TalksPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<YouTubeVideo | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    youtubeService.fetchChannelVideos(12).then((vids) => {
      setVideos(vids);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <HeroGradient>
        <HeroRow>
          <HeroLeft>
            <Mic size={32} color="var(--colors-secondary)" strokeWidth={1.5} />
            <div>
              <HeroTitle>Palestras</HeroTitle>
              <HeroSubtitle>Conteúdo para aprendizado didático</HeroSubtitle>
            </div>
          </HeroLeft>
          <PrototypeCard label="logo" tone="light" size="sm" />
        </HeroRow>
      </HeroGradient>

      <PageContent noPadding>
        {loading ? (
          <Spinner fullScreen label="Carregando palestras..." />
        ) : videos.length === 0 ? (
          <EmptyState>
            <Play size={56} color="var(--colors-secondary)" />
            <EmptyStateTitle>Nenhum vídeo disponível</EmptyStateTitle>
            <EmptyStateText>
              O feed de vídeos agora é simulado para apresentação do protótipo.
            </EmptyStateText>
          </EmptyState>
        ) : (
          <List>
            {videos.map((v, i) => (
              <VideoCard
                key={v.id}
                css={{ animationDelay: `${i * 45}ms` }}
                onClick={() => setSelected(v)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelected(v)}
                aria-label={`Assistir: ${v.title}`}
              >
                <Thumb>
                  <img src={v.thumbnail} alt={v.title} loading="lazy" />
                  <GradientOverlay />
                  <PlayBtn aria-hidden>
                    <Play size={22} color="#fff" fill="#fff" />
                  </PlayBtn>
                  <DateBadge>
                    <Calendar size={11} />
                    {fmtDate(v.publishedAt)}
                  </DateBadge>
                </Thumb>
                <VideoInfo>
                  <VideoTitle>{v.title}</VideoTitle>
                  <WatchRow>
                    <Play size={13} fill="#C5A059" color="#C5A059" />
                    Assistir
                  </WatchRow>
                </VideoInfo>
              </VideoCard>
            ))}
          </List>
        )}
      </PageContent>

      {selected && (
        <ModalOverlay
          ref={overlayRef}
          onClick={(e) => {
            if (e.target === overlayRef.current) setSelected(null);
          }}
        >
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{selected.title}</ModalTitle>
              <CloseBtn onClick={() => setSelected(null)} aria-label="Fechar">
                <X size={18} />
              </CloseBtn>
            </ModalHeader>
            <IframeWrap>
              <iframe
                src={`https://www.youtube.com/embed/${selected.id}?autoplay=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selected.title}
              />
            </IframeWrap>
            <ExternalRow>
              <ExtLink
                href={`https://www.youtube.com/watch?v=${selected.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={14} />
                Abrir no YouTube
              </ExtLink>
            </ExternalRow>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}
