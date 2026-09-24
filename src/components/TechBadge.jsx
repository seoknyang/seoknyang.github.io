import { techIconUrl } from '../lib/tech'

const hideBrokenIcon = (e) => { e.target.style.display = 'none' }

function TechBadge({ tech }) {
  return (
    <span className="flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 text-gray-200 px-2.5 py-1 rounded-full">
      <img src={techIconUrl(tech)} alt="" className="w-4 h-4" onError={hideBrokenIcon} />
      {tech.name}
    </span>
  )
}

// 큰 아이콘 타일 (포트폴리오, 홈 기술 스택 띠)
export function TechTile({ tech }) {
  return (
    <div className="group flex flex-col items-center gap-2 w-24 shrink-0">
      <div className="grid place-items-center w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 transition group-hover:border-indigo-300/50 group-hover:bg-white/[0.06] group-hover:-translate-y-1">
        <img src={techIconUrl(tech)} alt="" className="w-9 h-9" onError={hideBrokenIcon} loading="lazy" />
      </div>
      <span className="text-xs text-gray-400 group-hover:text-gray-200 transition text-center">{tech.name}</span>
    </div>
  )
}

export default TechBadge
