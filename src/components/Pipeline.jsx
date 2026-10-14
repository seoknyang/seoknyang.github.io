import { useEffect, useState } from 'react'

const STEPS = [
  {
    key: 'idea',
    label: '아이디어',
    title: '만들고 싶은 걸 정합니다',
    body: '"브릭을 하나씩 끼워 맞추는 조립 게임", "캐릭터와 마주 앉아 보는 사주"처럼 한 줄짜리 아이디어에서 시작합니다. 여기까지가 사람의 몫입니다.',
    code: ['# idea.txt', '손으로 만지는 느낌이 나는', '작은 조립 게임을 만들고 싶다'],
  },
  {
    key: 'build',
    label: '함께 만들기',
    title: 'AI와 대화하며 만듭니다',
    body: 'Claude Code에게 원하는 동작을 말로 설명하고, 결과를 직접 실행해 보며 고칠 점을 다시 이야기합니다. 코드 대부분은 AI가 쓰고, 방향과 판단은 사람이 정합니다.',
    code: ['> 부품 트레이를 원목 접시처럼', '  바꾸고 작업대 기울기를 따라', '  움직이게 해 줘', '● 수정한 파일 4개'],
  },
  {
    key: 'commit',
    label: '커밋',
    title: '하루의 작업이 커밋으로 쌓입니다',
    body: '기능 하나가 끝날 때마다 무엇을 왜 바꿨는지 커밋 메시지로 남깁니다. 이 커밋들이 그날 개발 기록의 재료가 됩니다.',
    code: ['$ git log --oneline', 'a1f3c2e 원목 접시 트레이', '9b7d410 조립 단계 짧게 나누기', 'e02c8aa 파츠 작업판 정리'],
  },
  {
    key: 'write',
    label: 'AI 기록',
    title: 'AI가 읽고, 쓰고, 올립니다',
    body: '/publish-devlog 한 줄이면 AI가 그날의 커밋과 화면을 살펴 개발 기록을 쓰고 이 블로그에 바로 발행합니다. 지금 보고 계신 기록이 모두 그렇게 만들어졌습니다.',
    code: ['> /publish-devlog', '● 커밋 3개 읽음', '● 기록 작성', '✓ seoknyang.github.io 발행'],
  },
]

const DURATION = 5000

/** 이 사이트의 글이 만들어지는 4단계. 저절로 넘어가고, 누르면 그 단계로 간다 */
function Pipeline() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setTimeout(() => setActive((i) => (i + 1) % STEPS.length), DURATION)
    return () => clearTimeout(id)
  }, [active, paused])

  const step = STEPS[active]

  return (
    <div
      className="grid gap-4 lg:grid-cols-[1fr_1.15fr]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <ol className="grid grid-cols-2 gap-3 lg:grid-cols-1" role="tablist">
        {STEPS.map((s, i) => {
          const on = i === active
          return (
            <li key={s.key}>
              <button
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                className={`group relative w-full overflow-hidden rounded-2xl border px-4 py-4 text-left transition md:px-5 ${
                  on ? 'border-signal/40 bg-signal/[0.06]' : 'border-white/[0.08] bg-panel/60 hover:border-white/20'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg font-mono text-xs transition ${
                      on ? 'bg-signal text-ink' : 'bg-white/5 text-gray-500 group-hover:text-gray-300'
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <span className={`font-semibold ${on ? 'text-white' : 'text-gray-400'}`}>{s.label}</span>
                </span>
                {on && (
                  <span
                    key={`${active}-${paused}`}
                    className={`absolute inset-x-0 bottom-0 h-0.5 bg-signal ${paused ? '' : 'progress-fill'}`}
                    style={{ '--dur': `${DURATION}ms`, transform: paused ? 'scaleX(1)' : undefined }}
                  />
                )}
              </button>
            </li>
          )
        })}
      </ol>

      <div key={step.key} className="rise flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-panel/80 backdrop-blur" style={{ animationDuration: '.5s' }}>
        <div className="p-6 md:p-8">
          <p className="font-mono text-xs text-signal/80">STEP 0{active + 1}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight">{step.title}</h3>
          <p className="mt-3 leading-relaxed text-gray-400">{step.body}</p>
        </div>
        <pre className="mt-auto border-t border-white/[0.08] bg-black/30 px-6 py-5 font-mono text-[13px] leading-6 text-gray-400 md:px-8 overflow-x-auto">
          {step.code.map((line, i) => (
            <span
              key={i}
              className={`rise block ${line.startsWith('✓') ? 'text-signal' : line.startsWith('>') ? 'text-white' : ''}`}
              style={{ '--d': `${0.1 + i * 0.12}s`, animationDuration: '.4s' }}
            >
              {line}
            </span>
          ))}
        </pre>
      </div>
    </div>
  )
}

export default Pipeline
