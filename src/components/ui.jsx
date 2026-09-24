// 페이지 공통 꾸밈 요소

/** 페이지 맨 위 배경: 격자와 천천히 떠다니는 오로라 빛 */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[720px] overflow-hidden -z-10">
      <div className="absolute inset-0 bg-grid" />
      <div className="aurora w-[520px] h-[520px] -top-40 left-[8%] bg-indigo-600" />
      <div className="aurora w-[460px] h-[460px] -top-24 right-[4%] bg-fuchsia-600" style={{ animationDelay: '-6s' }} />
      <div className="aurora w-[380px] h-[380px] top-40 left-[40%] bg-cyan-500 opacity-30" style={{ animationDelay: '-12s' }} />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
    </div>
  )
}

/** 섹션 제목: 작은 고정폭 번호 라벨 + 큰 제목 */
export function SectionHeading({ index, label, title, action }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8">
      <div>
        <p className="font-mono text-xs tracking-widest text-indigo-300/80 uppercase mb-2">
          {index && <span className="text-gray-500 mr-2">{index}</span>}
          {label}
        </p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      {action}
    </div>
  )
}

/** 페이지 머리말 */
export function PageHeader({ label, title, children }) {
  return (
    <header className="pt-6 pb-12 md:pb-16">
      <p className="rise font-mono text-xs tracking-widest text-indigo-300/80 uppercase mb-4">{label}</p>
      <h1 className="rise text-4xl md:text-6xl font-extrabold tracking-tight" style={{ '--d': '.08s' }}>
        {title}
      </h1>
      {children && (
        <div className="rise mt-5 text-gray-400 text-base md:text-lg max-w-2xl" style={{ '--d': '.16s' }}>
          {children}
        </div>
      )}
    </header>
  )
}

/** 마우스 위치를 따라 테두리가 빛나는 카드 */
export function GlowCard({ as = 'div', className = '', children, ...rest }) {
  const Tag = as
  const track = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <Tag
      onMouseMove={track}
      className={`glow-card rounded-2xl border border-white/10 bg-panel/80 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgb(99_102_241_/_0.45)] ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function Loading() {
  return (
    <div className="flex items-center gap-3 text-gray-500 py-20">
      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
      불러오는 중...
    </div>
  )
}

export function ArrowIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}
