import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { FiGithub, FiActivity, FiCode, FiStar } from "react-icons/fi";

const weeklyData = [
  { day: "Mon", hours: 3 },
  { day: "Tue", hours: 4.5 },
  { day: "Wed", hours: 2.5 },
  { day: "Thu", hours: 5 },
  { day: "Fri", hours: 4 },
  { day: "Sat", hours: 6.5 },
  { day: "Sun", hours: 3.5 },
];

const monthlyData = [
  { week: "W1", commits: 12 },
  { week: "W2", commits: 18 },
  { week: "W3", commits: 15 },
  { week: "W4", commits: 22 },
];

const langData = [
  { name: "JavaScript", value: 40 },
  { name: "TypeScript", value: 25 },
  { name: "HTML/CSS", value: 25 },
  { name: "Other", value: 10 },
];

const LANG_COLORS = ["#F7DF1E", "#3178C6", "#E34F26", "#6B7280"];

const stats = [
  { icon: FiGithub, label: "Repositories", value: "2+" },
  { icon: FiActivity, label: "Commits (30d)", value: "10+" },
  { icon: FiCode, label: "Languages", value: "3" },
  { icon: FiStar, label: "Current Streak", value: "01 days" },
];

const tooltipStyle = {
  background: "hsl(225 22% 10%)",
  border: "1px solid hsl(225 18% 18%)",
  borderRadius: "10px",
  color: "hsl(210 20% 90%)",
  fontSize: 12,
  fontFamily: '"JetBrains Mono", monospace',
};

export default function Dashboard() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="dashboard" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div ref={ref} className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            Developer <span className="text-gradient">Dashboard</span>
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground max-w-md mx-auto">
            A snapshot of my development activity and engagement
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * (i + 1) }}
              className="card-hover p-5 rounded-2xl glass border border-border/50 text-center group hover:border-primary/30"
            >
              <s.icon className="mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" size={20} />
              <div className="text-2xl font-heading font-bold text-gradient">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1 font-mono">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="card-hover p-6 rounded-2xl glass border border-border/50"
          >
            <h3 className="font-heading font-semibold text-foreground mb-1">Weekly Coding</h3>
            <p className="text-xs text-muted-foreground font-mono mb-4">hours per day</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11, fontFamily: '"JetBrains Mono"' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 11, fontFamily: '"JetBrains Mono"' }} axisLine={false} tickLine={false} width={25} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(38 92% 50% / 0.05)" }} />
                <Bar dataKey="hours" fill="hsl(38 92% 50%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="card-hover p-6 rounded-2xl glass border border-border/50"
          >
            <h3 className="font-heading font-semibold text-foreground mb-1">Languages</h3>
            <p className="text-xs text-muted-foreground font-mono mb-4">distribution</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={langData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                  {langData.map((_, i) => (
                    <Cell key={i} fill={LANG_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-1">
              {langData.map((lang, i) => (
                <div key={lang.name} className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: LANG_COLORS[i] }} />
                  {lang.name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Commit activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="card-hover p-6 rounded-2xl glass border border-border/50"
        >
          <h3 className="font-heading font-semibold text-foreground mb-1">Monthly Commit Activity</h3>
          <p className="text-xs text-muted-foreground font-mono mb-4">commits per week</p>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(38 92% 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11, fontFamily: '"JetBrains Mono"' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="commits" stroke="hsl(38 92% 50%)" fill="url(#commitGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </section>
  );
}
