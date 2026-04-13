"use client";

interface YouTubeEmbedProps {
  videoUrl?: string;
  title: string;
}

function isValidYouTubeId(value: string) {
  return /^[A-Za-z0-9_-]{11}$/.test(value);
}

function extractVideoIdFromYouTubeUrl(videoUrl?: string) {
  if (!videoUrl) {
    return null;
  }

  try {
    const parsed = new URL(videoUrl);
    const hostname = parsed.hostname.toLowerCase();

    if (hostname === "youtu.be" || hostname.endsWith(".youtu.be")) {
      const idFromPath = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
      return isValidYouTubeId(idFromPath) ? idFromPath : null;
    }

    if (
      hostname === "youtube.com" ||
      hostname.endsWith(".youtube.com") ||
      hostname === "youtube-nocookie.com" ||
      hostname.endsWith(".youtube-nocookie.com")
    ) {
      const pathParts = parsed.pathname.split("/").filter(Boolean);
      const firstSegment = pathParts[0] ?? "";
      const secondSegment = pathParts[1] ?? "";

      if (firstSegment === "watch") {
        const idFromQuery = parsed.searchParams.get("v") ?? "";
        return isValidYouTubeId(idFromQuery) ? idFromQuery : null;
      }

      if (firstSegment === "embed" || firstSegment === "shorts" || firstSegment === "live") {
        return isValidYouTubeId(secondSegment) ? secondSegment : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function toEmbedUrl(videoUrl?: string) {
  const videoId = extractVideoIdFromYouTubeUrl(videoUrl);

  if (!videoId) {
    return null;
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}

export default function YouTubeEmbed({ videoUrl, title }: YouTubeEmbedProps) {
  const embedUrl = toEmbedUrl(videoUrl);

  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title={title}
        className="h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  if (videoUrl) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-zinc-200 px-6 text-center text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
        <p>Video link is not in a supported YouTube format.</p>
        <a href={videoUrl} target="_blank" rel="noreferrer" className="underline">
          Open training video
        </a>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-200 px-6 text-center text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
      No video configured for this step.
    </div>
  );
}
