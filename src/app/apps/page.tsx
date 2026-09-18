import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Systems & Application Directory",
  description:
    "A living directory of our AI systems, applications, deployment surfaces, repositories, and demonstration videos.",
};

type Project = {
  name: string;
  kind: "Platform" | "Application" | "Recovery" | "Infrastructure" | "Workspace";
  description: string;
  repo: string;
  status: "Active" | "Prototype" | "Connected" | "Repository";
  capabilities: string[];
  videoId?: string;
};

const projects: Project[] = [
  {
    name: "OmniMind Control Plane",
    kind: "Platform",
    description:
      "Central control-plane repository for the EaaS and AI operations environment.",
    repo: "https://github.com/playedout412888/omnimind-control-plane",
    status: "Active",
    capabilities: ["AI operations", "Control plane", "Automation", "Deployment orchestration"],
  },
  {
    name: "AI GitHub Services — EaaS",
    kind: "Platform",
    description:
      "Employee-as-a-Service system for AI-powered GitHub delivery, documentation, sites, workflows, and custom solutions.",
    repo: "https://github.com/playedout412888/playedout412888-eaas-system",
    status: "Active",
    capabilities: ["EaaS", "GitHub automation", "CI/CD", "Documentation", "Service delivery"],
  },
  {
    name: "Newisholdy",
    kind: "Application",
    description:
      "Application repository with a React/Next.js frontend, Node.js backend, PostgreSQL, testing, and GitHub Actions.",
    repo: "https://github.com/playedout412888/Newisholdy",
    status: "Repository",
    capabilities: ["React/Next.js", "Node.js", "PostgreSQL", "Testing", "CI/CD"],
  },
  {
    name: "Agent Swarm Platform",
    kind: "Infrastructure",
    description:
      "Repository for the agent-swarm / autonomous deployment platform work.",
    repo: "https://github.com/playedout412888/cp--r-agent-swarm-platform-auto-deploy-agent-swarm-platform-cd-agent-swarm-platform-",
    status: "Repository",
    capabilities: ["Agent swarms", "Autonomous deployment", "Platform automation"],
  },
  {
    name: "Fitzgerald's Recovery v1",
    kind: "Recovery",
    description: "Repository for the Fitzgerald's Recovery application.",
    repo: "https://github.com/playedout412888/fitzgeralds-recovery-v1",
    status: "Repository",
    capabilities: ["Recovery operations", "Business application"],
  },
  {
    name: "Fitzgerald's Repo v1",
    kind: "Recovery",
    description: "Repository for the Fitzgerald's repossession workflow application.",
    repo: "https://github.com/playedout412888/fitzgeralds-repo.v1",
    status: "Repository",
    capabilities: ["Repossession workflows", "Business application"],
  },
  {
    name: "Newisholdy / Legacy Workspace",
    kind: "Workspace",
    description:
      "Additional connected project workspace available through the GitHub control plane.",
    repo: "https://github.com/playedout412888/Newisholdy",
    status: "Connected",
    capabilities: ["Source repository", "Project inventory", "Engineering showcase"],
  },
];

const deployments = [
  {
    name: "OmniMind",
    platform: "Vercel",
    projectId: "prj_HxQVPCqDknehal8H4rlkzXCbVpRt",
    capabilities: ["Next.js deployment", "Production hosting", "Preview deployments"],
  },
  {
    name: "OmniMind 3792",
    platform: "Vercel",
    projectId: "prj_0uc1J5RTKq5X4gFufHFz2Dv8CmAE",
    capabilities: ["Vercel project", "Deployment surface"],
  },
];

const workspaces = [
  { name: "Code Aesthetic", url: "https://replit.com/@playedout4128/Code-Aesthetic" },
  { name: "Web Server", url: "https://replit.com/@playedout4128/Web-Server" },
  { name: "Web Server Setup", url: "https://replit.com/@playedout4128/Web-Server-Setup" },
];

function VideoPanel({ videoId }: { videoId?: string }) {
  if (!videoId) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/70 p-6">
        <p className="text-sm font-medium text-zinc-200">Demo video slot</p>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Add the YouTube video ID for this project and the directory will render
          the interactive player here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black">
      <div className="aspect-video">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Project demonstration video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default function AppsDirectoryPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
            AI Systems Directory
          </p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-7xl">
            Everything we build.
            <span className="block text-zinc-500">One place to see it.</span>
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-400">
            A living showcase for our repositories, applications, platforms,
            deployment surfaces, and product demonstrations. Every project can
            point back to its source, live deployment, documentation, and video.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-4">
          {[
            ["7", "tracked repositories"],
            ["2", "connected Vercel projects"],
            ["3", "connected Replit workspaces"],
            ["∞", "demo/video slots"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-3xl font-semibold">{value}</div>
              <div className="mt-1 text-sm text-zinc-500">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-600">Source of truth</p>
              <h2 className="mt-2 text-3xl font-semibold">Repositories & systems</h2>
            </div>
            <a
              href="https://github.com/playedout412888"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-zinc-300 hover:text-white"
            >
              View GitHub →
            </a>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.name}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-zinc-600"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider">
                  <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-zinc-300">
                    {project.kind}
                  </span>
                  <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-zinc-500">
                    {project.status}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-semibold">{project.name}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{project.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.capabilities.map((capability) => (
                    <span
                      key={capability}
                      className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400"
                    >
                      {capability}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <VideoPanel videoId={project.videoId} />
                </div>

                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex text-sm font-medium text-white underline decoration-zinc-700 underline-offset-4 hover:decoration-white"
                >
                  Open repository →
                </a>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-600">Deployment layer</p>
          <h2 className="mt-2 text-3xl font-semibold">Connected Vercel projects</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {deployments.map((deployment) => (
              <div key={deployment.projectId} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
                <div className="text-xs uppercase tracking-wider text-zinc-600">{deployment.platform}</div>
                <h3 className="mt-2 text-xl font-semibold">{deployment.name}</h3>
                <p className="mt-2 break-all text-xs text-zinc-600">{deployment.projectId}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {deployment.capabilities.map((capability) => (
                    <span key={capability} className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400">
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-600">Build workspace</p>
          <h2 className="mt-2 text-3xl font-semibold">Connected Replit environments</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {workspaces.map((workspace) => (
              <a
                key={workspace.name}
                href={workspace.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-zinc-600"
              >
                <div className="text-xs uppercase tracking-wider text-zinc-600">Replit</div>
                <h3 className="mt-2 text-xl font-semibold">{workspace.name}</h3>
                <span className="mt-5 inline-block text-sm text-zinc-400">Open workspace →</span>
              </a>
            ))}
          </div>
        </div>

        <section className="mt-20 rounded-3xl border border-zinc-800 bg-zinc-950 p-8 sm:p-10">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-600">Next layer</p>
          <h2 className="mt-3 text-3xl font-semibold">Turn the directory into the sales engine.</h2>
          <p className="mt-4 max-w-3xl text-zinc-400 leading-7">
            Each project should eventually have a live demo, a short interactive YouTube
            walkthrough, architecture highlights, feature screenshots, repository links,
            deployment links, documentation, and a clear call to action. This page is the
            foundation for that catalog rather than another disconnected landing page.
          </p>
        </section>
      </section>
    </main>
  );
}
