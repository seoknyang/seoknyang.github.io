import { useEffect, useRef, useState } from 'react'

// 페이지 공통 꾸밈 요소

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * 화면 전체 배경: 촘촘한 점 격자. 마우스 가까이의 점이 연두색으로 밝아지고 살짝 밀려난다.
 * 마우스가 없을 때는 느린 물결이 지나간다.
 */
export function DotField() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const GAP = 26
    const RADIUS = 170
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 }
    let w = 0
    let h = 0
    let frame = 0
    let raf = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      // 포인터는 부드럽게 따라온다
      pointer.x += (pointer.tx - pointer.x) * 0.15
      pointer.y += (pointer.ty - pointer.y) * 0.15
      frame += 1
      ctx.clearRect(0, 0, w, h)
      const t = frame / 90
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const dx = x - pointer.x
          const dy = y - pointer.y
          const d = Math.sqrt(dx * dx + dy * dy)
          const near = Math.max(0, 1 - d / RADIUS)
          const wave = (Math.sin(x / 140 + y / 220 - t) + 1) / 2
          const push = near * near * 7
          const px = d > 0 ? x + (dx / d) * push : x
          const py = d > 0 ? y + (dy / d) * push : y
          if (near > 0.01) {
            ctx.fillStyle = `rgba(196, 243, 106, ${0.12 + near * 0.75})`
            ctx.beginPath()
            ctx.arc(px, py, 1 + near * 1.3, 0, Math.PI * 2)
            ctx.fill()
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + wave * 0.05})`
            ctx.fillRect(px - 0.6, py - 0.6, 1.2, 1.2)
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }

    const onMove = (e) => {
      pointer.tx = e.clientX
      pointer.ty = e.clientY
      if (pointer.x < -1000) {
        pointer.x = e.clientX
        pointer.y = e.clientY
      }
    }
    const onLeave = () => {
      pointer.tx = -9999
      pointer.ty = -9999
    }
    // 탭이 보이지 않을 땐 그리지 않는다
    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    if (reducedMotion()) {
      draw()
      cancelAnimationFrame(raf)
      return () => window.removeEventListener('resize', resize)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-20 h-full w-full" />
}

/** 페이지 맨 위 배경: 격자와 천천히 떠다니는 빛, 잡티 */
export function Backdrop() {
  return (
    <>
      <DotField />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[760px] overflow-hidden -z-10">
        <div className="aurora w-[560px] h-[420px] -top-56 left-[10%] bg-signal/25" />
        <div className="aurora w-[460px] h-[380px] -top-40 right-[6%] bg-teal-400/20" style={{ animationDelay: '-7s' }} />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>
      <div aria-hidden className="grain pointer-events-none fixed inset-0 -z-10" />
    </>
  )
}

/** 화면에 들어오면 떠오르며 나타나는 감싸개 */
export function Reveal({ as = 'div', delay = 0, className = '', style, children, ...rest }) {
  const Tag = as
  const ref = useRef(null)
  const [visible, setVisible] = useState(reducedMotion)

  useEffect(() => {
    const el = ref.current
    if (!el || visible) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [visible])

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--d': `${delay}s`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** 섹션 제목: 작은 고정폭 번호 라벨 + 큰 제목 */
export function SectionHeading({ index, label, title, description, action }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
      <div>
        <p className="font-mono text-xs tracking-widest text-signal/80 uppercase mb-3 flex items-center gap-3">
          {index && <span className="text-gray-500">{index}</span>}
          <span className="h-px w-6 bg-signal/40" />
          {label}
        </p>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight">{title}</h2>
        {description && <p className="mt-3 max-w-2xl text-gray-400 leading-relaxed">{description}</p>}
      </div>
      {action}
    </div>
  )
}

/** 페이지 머리말 */
export function PageHeader({ label, title, children }) {
  return (
    <header className="pt-6 pb-12 md:pb-16">
      <p className="rise font-mono text-xs tracking-widest text-signal/80 uppercase mb-4 flex items-center gap-3">
        <span className="h-px w-6 bg-signal/40" />
        {label}
      </p>
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

/**
 * 마우스 위치를 따라 테두리가 빛나는 카드.
 * tilt를 주면 마우스 쪽으로 살짝 기울어진다.
 */
export function GlowCard({ as = 'div', tilt = false, className = '', children, ...rest }) {
  const Tag = as
  const track = (e) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty('--x', `${x}px`)
    el.style.setProperty('--y', `${y}px`)
    if (tilt && !reducedMotion()) {
      const rx = ((y / r.height) - 0.5) * -7
      const ry = ((x / r.width) - 0.5) * 9
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`
    }
  }
  const reset = (e) => {
    if (tilt) e.currentTarget.style.transform = ''
  }
  return (
    <Tag
      onMouseMove={track}
      onMouseLeave={reset}
      className={`glow-card rounded-2xl border border-white/[0.08] bg-panel/80 backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 ease-out hover:border-white/15 hover:shadow-[0_24px_60px_-24px_rgb(196_243_106_/_0.35)] ${
        tilt ? 'will-change-transform' : 'hover:-translate-y-1'
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** AI가 쓴 글이라는 표시 */
export function AiBadge({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-signal/30 bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-signal ${className}`}
    >
      <SparkIcon className="w-3 h-3" />
      AI written
    </span>
  )
}

export function Loading() {
  return (
    <div className="flex items-center gap-3 py-20 font-mono text-sm text-gray-500">
      <span className="pulse-dot h-2 w-2 rounded-full bg-signal" />
      불러오는 중<span className="caret" />
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

/** 네 갈래 반짝임: AI 표시에 쓰는 아이콘 */
export function SparkIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2c.4 4.6 2.4 8 7.6 9.6.4.1.4.7 0 .8C14.4 14 12.4 17.4 12 22c-.4-4.6-2.4-8-7.6-9.6-.4-.1-.4-.7 0-.8C9.6 10 11.6 6.6 12 2Z" />
    </svg>
  )
}

export function SearchIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}
