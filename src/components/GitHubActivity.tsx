"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiStar, FiGitBranch, FiBookOpen, FiExternalLink } from "react-icons/fi";

interface GitHubStats {
  publicRepos: number;
  followers: number;
  totalStars: number;
  topRepo: string;
  avatarUrl: string;
}

export default function GitHubActivity({ username = "VinaykumarvemulaCSE" }: { username?: string }) {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
        ]);

        if (userRes.ok && reposRes.ok) {
          const userData = await userRes.json();
          const reposData = await reposRes.json();

          const stars = Array.isArray(reposData)
            ? reposData.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0)
            : 0;

          const top = Array.isArray(reposData) && reposData.length > 0 
            ? reposData[0].name 
            : "BLOOD-LINE";

          setStats({
            publicRepos: userData.public_repos || 0,
            followers: userData.followers || 0,
            totalStars: stars,
            topRepo: top,
            avatarUrl: userData.avatar_url,
          });
        }
      } catch (err) {
        console.warn("Could not fetch live GitHub activity:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, [username]);

  return (
    <div className="max-w-5xl mx-auto px-4 mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="p-6 md:p-8 rounded-3xl glass border border-border/60 hover:border-primary/40 flex flex-col md:flex-row items-center justify-between gap-6 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FiGithub size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-foreground text-lg">
                GitHub Activity & Open Source
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live sync" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live statistics queried directly from @{username}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 sm:gap-8 flex-wrap justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-primary font-mono font-bold text-xl">
              <FiBookOpen size={16} />
              <span>{loading ? "..." : stats?.publicRepos ?? "15+"}</span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground uppercase">Repositories</span>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-amber-500 font-mono font-bold text-xl">
              <FiStar size={16} />
              <span>{loading ? "..." : stats?.totalStars ?? "★"}</span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground uppercase">Stars Earned</span>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-foreground font-mono font-bold text-xl">
              <FiGitBranch size={16} />
              <span>{loading ? "..." : stats?.followers ?? "10+"}</span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground uppercase">Followers</span>
          </div>

          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Full GitHub Profile"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all glow-sm"
          >
            Follow on GitHub <FiExternalLink size={14} />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
