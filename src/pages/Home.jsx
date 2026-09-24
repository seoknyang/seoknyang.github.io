import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../sanityClient'
import { TechTile } from '../components/TechBadge'
import ProjectCard from '../components/ProjectCard'
import { ArrowIcon, SectionHeading } from '../components/ui'
import { POST_SUMMARY_QUERY, OTHER_PROJECT, formatDate, groupProjects, shortTitle, withProject } from '../lib/project'

const PROFILE_QUERY = `*[_type == "profile"][0]{
  intro,
  links,
  "techStack": techStack[defined(name)]{name, "iconUrl": icon.asset->url}
}`

function Home() {
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    client
      .fetch(`{"profile": ${PROFILE_QUERY}, "posts": ${POST_SUMMARY_QUERY}}`)
      .then(({ profile, posts }) => {
        setProfile(profile)
        setPosts(withProject(posts))
      })
      .catch((err) => console.error('Home fetch error:', err))
  }, [])

  const projects = groupProjects(posts).filter((p) => p.name !== OTHER_PROJECT)
  const latest = posts[0]
  const tech = profile?.techStack ?? []

  // "성실함을 무기로 성장하는 개발자, 천석녕입니다." → 쉼표 앞은 크게, 뒤는 이어서
  const intro = profile?.intro ?? '개발하며 배운 것을 기록합니다.'
  const [lead, ...rest] = intro.split(/,\s*/)
  const tail = rest.join(', ')

  const stats = [
    { value: projects.length, label: '진행한 프로젝트' },
    { value: posts.length, label: '개발 기록' },
    { value: tech.length, label: '다루는 기술' },
    { value: latest ? formatDate(latest.publishedAt) : '-', label: '최근 업데이트', small: true },
  ]

  return (
    <div className="space-y-28 md:space-y-36">
      {/* 첫 화면 */}
      <section className="pt-6 md:pt-16">
        {latest && (
          <Link
            to={`/blog/${latest.slug}`}
            className="rise group inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3 text-sm text-gray-300 backdrop-blur hover:border-indigo-300/40"
          >
            <span className="rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-2 py-0.5 text-xs font-semibold text-white">
              NEW
            </span>
            <span className="truncate">{latest.project} 개발 기록이 올라왔어요</span>
            <ArrowIcon className="w-3.5 h-3.5 shrink-0 text-gray-500 transition group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        )}

        <h1 className="mt-8 text-balance text-[2.6rem] leading-[1.1] sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
          <span className="rise block text-gradient pb-2" style={{ '--d': '.1s' }}>{lead}</span>
          {tail && (
            <span className="rise block text-white" style={{ '--d': '.2s' }}>{tail}</span>
          )}
        </h1>

        <p className="rise mt-8 max-w-2xl text-lg md:text-xl text-gray-400 leading-relaxed" style={{ '--d': '.3s' }}>
          만든 것들을 소개하고, 개발하면서 부딪히고 배운 것들을 기록하는 공간입니다.
        </p>

        <div className="rise mt-10 flex flex-wrap gap-3" style={{ '--d': '.4s' }}>
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:shadow-[0_0_40px_-5px_rgb(165_180_252_/_0.8)]"
          >
            프로젝트 보기
            <ArrowIcon className="w-4 h-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            to="/portfolio"
            className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 font-semibold text-gray-200 backdrop-blur transition hover:border-white/40"
          >
            이력 보기
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

        <dl className="rise mt-16 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10" style={{ '--d': '.5s' }}>
          {stats.map((s) => (
            <div key={s.label} className="bg-ink/90 px-5 py-6 backdrop-blur">
              <dt className="text-xs text-gray-500">{s.label}</dt>
              <dd className={`mt-2 font-bold tracking-tight ${s.small ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'}`}>
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 프로젝트 */}
      {projects.length > 0 && (
        <section>
          <SectionHeading
            index="01"
            label="Selected work"
            title="요즘 만들고 있는 것들"
            action={
              <Link to="/projects" className="hidden sm:inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white">
                전체 보기 <ArrowIcon />
              </Link>
            }
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((project, i) => (
              <ProjectCard key={project.name} project={project} featured={i === 0} />
            ))}
          </div>
        </section>
      )}

      {/* 기술 스택 */}
      {tech.length > 0 && (
        <section>
          <SectionHeading index="02" label="Stack" title="다루는 기술" />
          <div className="marquee overflow-hidden py-2">
            <div className="marquee-track gap-4" style={{ '--speed': `${Math.max(20, tech.length * 3)}s` }}>
              {[...tech, ...tech].map((t, i) => (
                <TechTile key={`${t.name}-${i}`} tech={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 최근 기록 */}
      {posts.length > 0 && (
        <section>
          <SectionHeading
            index="03"
            label="Writing"
            title="최근 개발 기록"
            action={
              <Link to="/blog" className="hidden sm:inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white">
                블로그 <ArrowIcon />
              </Link>
            }
          />
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {posts.slice(0, 4).map((post) => (
              <li key={post._id}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex items-center gap-4 md:gap-8 py-5 transition hover:bg-white/[0.02] md:px-3"
                >
                  <span className="hidden md:block w-28 shrink-0 font-mono text-xs text-gray-500">
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-indigo-300/80 mb-1">{post.project}</span>
                    <span className="block font-semibold text-gray-100 group-hover:text-white truncate">
                      {shortTitle(post.title)}
                    </span>
                  </span>
                  <ArrowIcon className="w-5 h-5 shrink-0 text-gray-600 transition group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 마무리 */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/25 via-fuchsia-600/10 to-cyan-500/20 px-6 py-14 md:px-14 md:py-20 text-center">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-60" />
        <h2 className="relative text-3xl md:text-5xl font-extrabold tracking-tight">
          만드는 과정을 <span className="text-gradient">전부 기록합니다</span>
        </h2>
        <p className="relative mt-4 text-gray-300">매일의 작업 내역이 블로그에 자동으로 쌓입니다.</p>
        <Link
          to="/blog"
          className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:shadow-[0_0_40px_-5px_rgb(165_180_252_/_0.8)]"
        >
          개발 기록 보러 가기 <ArrowIcon />
        </Link>
      </section>
    </div>
  )
}

export default Home
