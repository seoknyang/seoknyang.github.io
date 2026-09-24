import { Link } from 'react-router-dom'
import { ArrowIcon, GlowCard } from './ui'
import { formatPeriod } from '../lib/project'

// devlog 프로젝트 카드: 대표 이미지, 기간, 기록 수, 태그. 누르면 그 프로젝트 글 목록으로 간다
function ProjectCard({ project, featured = false }) {
  return (
    <GlowCard as={Link} to={`/blog?project=${encodeURIComponent(project.name)}`} className="group block overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-indigo-900/40 via-panel to-fuchsia-900/30">
        {project.coverUrl ? (
          <img
            src={`${project.coverUrl}?w=800&h=500&fit=crop&auto=format`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="relative grid h-full place-items-center">
            <div aria-hidden className="absolute inset-0 bg-grid opacity-70" />
            <span className="relative text-8xl font-black tracking-tighter text-gradient opacity-80 transition duration-700 group-hover:scale-110">
              {project.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
        {featured && (
          <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            최근 작업
          </span>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold tracking-tight">{project.name}</h3>
          <ArrowIcon className="w-5 h-5 mt-1 shrink-0 text-gray-600 transition group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <p className="mt-1 font-mono text-xs text-gray-500">
          {formatPeriod(project.first, project.latest)}, 기록 {project.count}개
        </p>
        {project.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-gray-400">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </GlowCard>
  )
}

export default ProjectCard
