import { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '@dev-team-cv/theme';
import { SectionWrapper, SectionHeader } from '@dev-team-cv/ui';
import type { TeamMember, Project, ConstellationNode, ConstellationEdge } from '@dev-team-cv/shared-types';

interface ConstellationProps {
  members: TeamMember[];
  projects: Project[];
}

interface NodeState extends ConstellationNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

function buildGraph(members: TeamMember[], projects: Project[]) {
  const nodes: NodeState[] = [];
  const edges: ConstellationEdge[] = [];

  members.forEach((m, i) => {
    const angle = (i / members.length) * Math.PI * 2 - Math.PI / 2;
    nodes.push({
      id: m.id, label: m.full_name.split(' ')[0], color: m.favorite_color,
      type: 'member', x: 0, y: 0, vx: 0, vy: 0, radius: 22,
    });
    void angle;
  });

  projects.forEach((p, i) => {
    const angle = (i / projects.length) * Math.PI * 2;
    nodes.push({
      id: p.id, label: p.title, color: '#64748b',
      type: 'project', x: 0, y: 0, vx: 0, vy: 0, radius: 12,
    });
    void angle;
    (p.team_members ?? []).forEach((m) => {
      edges.push({ source: p.id, target: m.id });
    });
  });

  return { nodes, edges };
}

export function TeamConstellation({ members, projects }: ConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const animRef = useRef<number>(0);
  const nodesRef = useRef<NodeState[]>([]);
  const edgesRef = useRef<ConstellationEdge[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoveredIdRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Build graph on data change
  useEffect(() => {
    const { nodes, edges } = buildGraph(members, projects);
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [members, projects]);

  // Layout: place nodes in circular positions
  const layoutNodes = useCallback((w: number, h: number) => {
    const nodes = nodesRef.current;
    const memberNodes = nodes.filter((n) => n.type === 'member');
    const projectNodes = nodes.filter((n) => n.type === 'project');
    const cx = w / 2, cy = h / 2;
    const r1 = Math.min(w, h) * 0.28;
    const r2 = Math.min(w, h) * 0.42;

    memberNodes.forEach((n, i) => {
      const a = (i / memberNodes.length) * Math.PI * 2 - Math.PI / 2;
      n.x = cx + r1 * Math.cos(a);
      n.y = cy + r1 * Math.sin(a);
    });
    projectNodes.forEach((n, i) => {
      const a = (i / Math.max(projectNodes.length, 1)) * Math.PI * 2;
      n.x = cx + r2 * Math.cos(a);
      n.y = cy + r2 * Math.sin(a);
    });
  }, []);

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isDark = theme === 'dark';
    const edgeColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
    const edgeHoverColor = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)';
    const textColor = isDark ? '#f0f6fc' : '#0f172a';
    const projectTextColor = isDark ? '#8b949e' : '#475569';
    const glowAlpha = isDark ? 0.35 : 0;

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      layoutNodes(canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const hid = hoveredIdRef.current;

      // Edges
      edges.forEach(({ source, target }) => {
        const s = nodes.find((n) => n.id === source);
        const t = nodes.find((n) => n.id === target);
        if (!s || !t) return;
        const isHovered = hid === source || hid === target;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.strokeStyle = isHovered ? edgeHoverColor : edgeColor;
        ctx.lineWidth = isHovered ? 1.5 : 1;
        ctx.stroke();
      });

      // Nodes
      nodes.forEach((n) => {
        const isHovered = hid === n.id;
        const r = n.radius * (isHovered ? 1.2 : 1);

        if (n.type === 'member') {
          // Glow (dark only)
          if (glowAlpha > 0) {
            const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2.5);
            grd.addColorStop(0, n.color + Math.round(glowAlpha * 255).toString(16).padStart(2, '0'));
            grd.addColorStop(1, 'transparent');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(n.x, n.y, r * 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.fill();
          // Label
          ctx.font = `600 12px Inter, sans-serif`;
          ctx.fillStyle = textColor;
          ctx.textAlign = 'center';
          ctx.fillText(n.label, n.x, n.y + r + 16);
        } else {
          // Project node: diamond
          ctx.save();
          ctx.translate(n.x, n.y);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = isDark ? '#1c2333' : '#f1f5f9';
          ctx.strokeStyle = isHovered ? n.color : (isDark ? '#30363d' : '#e2e8f0');
          ctx.lineWidth = isHovered ? 2 : 1;
          ctx.beginPath();
          ctx.rect(-r, -r, r * 2, r * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
          ctx.font = `11px Inter, sans-serif`;
          ctx.fillStyle = projectTextColor;
          ctx.textAlign = 'center';
          const label = n.label.length > 14 ? n.label.slice(0, 13) + '…' : n.label;
          ctx.fillText(label, n.x, n.y + r + 16);
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); ro.disconnect(); };
  }, [theme, layoutNodes]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const hit = nodesRef.current.find((n) => {
      const d = Math.hypot(n.x - mx, n.y - my);
      return d <= n.radius * 1.5;
    });
    const id = hit?.id ?? null;
    hoveredIdRef.current = id;
    setHoveredId(id);
  }, []);

  return (
    <SectionWrapper id="constellation" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          label="Collaboration"
          title="Team Constellation"
          subtitle="How the team connects through shared projects."
        />

        <div
          ref={containerRef}
          className="relative h-[480px] rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { hoveredIdRef.current = null; setHoveredId(null); }}
            className="w-full h-full"
            aria-label="Team constellation visualization showing member–project relationships"
            role="img"
          />
          {hoveredId && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-secondary)] shadow-md pointer-events-none">
              {nodesRef.current.find((n) => n.id === hoveredId)?.label}
            </div>
          )}
          {members.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)]">
              Add team members and projects to see the constellation
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
