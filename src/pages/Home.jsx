import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../sanityClient'
import ProjectCard from '../components/ProjectCard'
import AiTerminal from '../components/AiTerminal'
import Pipeline from '../components/Pipeline'
import ActivityGrid from '../components/ActivityGrid'
import { AiBadge, ArrowIcon, Reveal, SectionHeading, SparkIcon } from '../components/ui'
import { OTHER_PROJECT, dayKey, fetchPostSummaries, formatDate, groupProjects, shortTitle } from '../lib/project'

const PROFILE_QUERY = `*[_type == "profile"][0]{ links }`

function Home() {
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetchPostSummaries().then(setPosts).catch((err) => console.error('Home fetch error:', err))
    client.fetch(PROFILE_QUERY).then(setProfile).catch(() => {})
  }, [])

  const projects = groupProjects(posts).filter((p) => p.name !== OTHER_PROJECT)
  const latest = posts[0]
  const days = new Set(posts.map((p) => dayKey(p.publishedAt))).size

  // 기록에 쓰인 태그를 많이 나온 순으로 (devlog와 프로젝트 이름 태그는 뺀다)
  const projectKeys = new Set(projects.map((p) => p.name.toLowerCase().replace(/[\s_]/g, '-')))
  const tagCount = {}
  for (const p of posts)
    for (const t of p.tags ?? [])
      if (t !== 'devlog' && !projectKeys.has(t.toLowerCase().replace(/_/g, '-'))) tagCount[t] = (tagCount[t] ?? 0) + 1
  const tags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t)

  const stats = [
    { value: projects.length, label: 'AI와 만든 프로젝트' },
    { value: posts.length, label: 'AI가 쓴 개발 기록' },
    { value: days, label: '기록한 날' },
    { value: latest ? formatDate(latest.publishedAt) : '-', label: '최근 업데이트', small: true },
  ]

  return (
    <div className="space-y-28 md:space-y-40">
      {/* 첫 화면 */}
      <section className="pt-4 md:pt-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          <div>
            <p className="rise inline-flex items-center gap-2 rounded-full border border-signal/25 bg-signal/[0.07] px-3 py-1 font-mono text-xs uppercase tracking-widest text-signal">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-signal" />
              AI toy project lab
            </p>

            <h1 className="mt-7 text-balance text-[2.7rem] leading-[1.08] sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
              <span className="rise block" style={{ '--d': '.08s' }}>AI와 함께 만들고,</span>
              <span className="rise block text-gradient pb-2" style={{ '--d': '.18s' }}>AI가 기록합니다.</span>
            </h1>

            <p className="rise mt-7 max-w-xl text-lg leading-relaxed text-gray-400" style={{ '--d': '.28s' }}>
              떠오른 아이디어를 AI와 대화하며 작은 게임과 앱으로 만드는 토이 프로젝트 실험실입니다.
              <span className="text-gray-200"> 이 사이트의 개발 기록은 전부 AI가 그날의 커밋을 읽고 직접 쓴 글</span>이에요.
            </p>

            <div className="rise mt-9 flex flex-wrap gap-3" style={{ '--d': '.38s' }}>
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 font-semibold text-ink transition hover:shadow-[0_0_40px_-4px_rgb(196_243_106_/_0.8)]"
              >
                프로젝트 둘러보기
                <ArrowIcon className="w-4 h-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 font-semibold text-gray-200 backdrop-blur transition hover:border-white/40"
              >
                <SparkIcon className="w-4 h-4 text-signal" />
                AI 개발 기록 읽기
              </Link>
              {profile?.links?.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full border border-white/15 px-6 py-3 text-gray-300 transition hover:border-white/40"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="rise min-w-0" style={{ '--d': '.3s' }}>
            <AiTerminal posts={posts} />
          </div>
        </div>

        <dl className="rise mt-16 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08]" style={{ '--d': '.5s' }}>
          {stats.map((s) => (
            <div key={s.label} className="bg-ink/85 px-5 py-6 backdrop-blur">
              <dt className="text-xs text-gray-500">{s.label}</dt>
              <dd className={`mt-2 font-bold tracking-tight tabular-nums ${s.small ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'}`}>
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 만드는 방법 */}
      <Reveal as="section">
        <SectionHeading
          index="01"
          label="How it works"
          title="사람은 정하고, AI는 만들고 씁니다"
          description="코드를 한 줄씩 직접 짜는 대신, AI에게 설명하고 함께 다듬는 방식으로 만듭니다. 기록까지 AI에게 맡기니 만드는 데만 집중할 수 있어요."
        />
        <Pipeline />
      </Reveal>

      {/* 프로젝트 */}
      {projects.length > 0 && (
        <Reveal as="section">
          <SectionHeading
            index="02"
            label="Projects"
            title="AI와 만든 토이 프로젝트"
            action={
              <Link to="/projects" className="hidden sm:inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white">
                전체 보기 <ArrowIcon />
              </Link>
            }
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((project, i) => (
              <Reveal key={project.name} delay={i * 0.08} className="h-full">
                <ProjectCard project={project} featured={i === 0} index={i} />
              </Reveal>
            ))}
          </div>
        </Reveal>
      )}

      {/* 기록 */}
      {posts.length > 0 && (
        <Reveal as="section">
          <SectionHeading
            index="03"
            label="Devlog"
            title="매일 쌓이는 AI 개발 기록"
            action={
              <Link to="/blog" className="hidden sm:inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white">
                모든 기록 <ArrowIcon />
              </Link>
            }
          />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <ActivityGrid posts={posts} />
            <ul className="min-w-0 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {posts.slice(0, 5).map((post) => (
                <li key={post._id}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group flex items-center gap-4 py-4 transition hover:bg-white/[0.02] md:px-3"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="mb-1 flex items-center gap-2 text-xs">
                        <span className="text-signal/80">{post.project}</span>
                        <span className="font-mono text-gray-500">{formatDate(post.publishedAt)}</span>
                      </span>
                      <span className="block truncate font-semibold text-gray-100 group-hover:text-white">
                        {shortTitle(post.title)}
                      </span>
                    </span>
                    <span className="hidden sm:block"><AiBadge /></span>
                    <ArrowIcon className="w-5 h-5 shrink-0 text-gray-600 transition group-hover:text-signal group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}

      {/* 기록에 등장한 기술 */}
      {tags.length > 0 && (
        <Reveal as="section">
          <SectionHeading index="04" label="Stack in the logs" title="기록에 등장한 기술" />
          <div className="space-y-3">
            {[tags, [...tags].reverse()].map((row, r) => (
              <div key={r} className="marquee overflow-hidden">
                <div
                  className={`marquee-track gap-3 ${r ? 'reverse' : ''}`}
                  style={{ '--speed': `${Math.max(30, row.length * 3)}s` }}
                >
                  {[...row, ...row].map((t, i) => (
                    <Link
                      key={`${t}-${i}`}
                      to={`/blog?tag=${encodeURIComponent(t)}`}
                      className="shrink-0 rounded-full border border-white/[0.08] bg-panel/70 px-4 py-2 font-mono text-sm text-gray-400 transition hover:border-signal/50 hover:text-signal"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {/* 마무리 */}
      <Reveal as="section" className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-signal/[0.12] via-panel to-teal-500/10 px-6 py-16 md:px-14 md:py-24 text-center">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-60" />
        <p className="relative inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-signal/80">
          <SparkIcon className="w-3.5 h-3.5" />
          by the way
        </p>
        <h2 className="relative mt-4 text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
          이 사이트도
          <br className="sm:hidden" /> <span className="text-gradient">AI와 함께 만들었어요</span>
        </h2>
        <p className="relative mx-auto mt-5 max-w-lg text-gray-300">
          디자인부터 코드, 지금 읽고 있는 문장까지. 사람이 방향을 말하면 AI가 만들고, 그 과정은 다시 기록으로 남습니다.
        </p>
        <Link
          to="/blog"
          className="relative mt-9 inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 font-semibold text-ink transition hover:shadow-[0_0_40px_-4px_rgb(196_243_106_/_0.8)]"
        >
          개발 기록 보러 가기 <ArrowIcon />
        </Link>
      </Reveal>
    </div>
  )
}

export default Home
