"use client";

import { useState } from "react";
import { FiCode } from "react-icons/fi";

import { getRemoteIconUrl, resolveTechIconValue } from "@/constants/techIcons";

interface TechIconProps {
  name?: string;
  icon?: string;
  color?: string;
  size?: number;
  className?: string;
}

export function TechIcon({ name, icon, color, size = 16, className }: TechIconProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const local = resolveTechIconValue(icon) ?? resolveTechIconValue(name);
  const remoteUrl = local
    ? undefined
    : (getRemoteIconUrl(icon, color) ?? getRemoteIconUrl(name, color));

  if (local) {
    const Icon = local.icon;
    return (
      <Icon
        size={size}
        style={{ color: color || local.color }}
        className={className}
        aria-hidden="true"
      />
    );
  }

  if (remoteUrl && failedUrl !== remoteUrl) {
    return (
      // biome-ignore lint/performance/noImgElement: remote brand icons are pre-rendered SVGs
      <img
        src={remoteUrl}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailedUrl(remoteUrl)}
        className={className}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }

  return <FiCode size={size} style={{ color: color || "currentColor" }} className={className} />;
}
