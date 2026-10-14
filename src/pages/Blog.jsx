import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AiBadge, GlowCard, Loading, PageHeader, Reveal, SparkIcon } from '../components/ui'
import { fetchPostSummaries, formatDate, groupProjects, shortTitle } from '../lib/project'

const chipClass = (active) =>
  `shrink-0 text-xs px-3 py-1 rounded-full border transition ${
    active
      ? 'bg-signal text-ink border-signal font-semibold'
      : 'border-white/15 text-gray-400 hover:border-white/40 hover:text-gray-200'
  }`

const projectClass = (active) =>
  `shrink-0 flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
    active
      ? 'border-signal/60 bg-signal/10 text-white shadow-[0_0_24px_-8px_rgb(196_243_106_/_0.8)]'
      : 'border-white/10 bg-panel/60 text-gray-400 hover:border-white/30 hover:text-gray-200'
  }`

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAllTags, setShowAllTags] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedProject = searchParams.get('project')
  const selectedTag = searchParams.get('tag')

  useEffect(() => {
    fetchPostSummaries()
      .then(setPosts)
      .catch((err) => console.error('Blog fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  const projects = groupProjects(posts)

  const setFilter = (project, tag) => {
    const next = {}
    if (project) next.project = project
    if (tag) next.tag = tag
    setSearchParams(next, { replace: true })
  }

  const projectPosts = selectedProject ? posts.filter((p) => p.project === selectedProject) : posts
  const allTags = [...new Set(projectPosts.flatMap((p) => p.tags ?? []))].filter((t) => t !== 'devlog')
  // 태그가 많으면 앞의 몇 개만 보여 주되, 고른 태그는 늘 보이게
  const TAG_LIMIT = 12
  const visibleTags =
    showAllTags || allTags.length <= TAG_LIMIT
      ? allTags
      : [...new Set([...allTags.slice(0, TAG_LIMIT), ...(selectedTag ? [selectedTag] : [])])]
  const filteredPosts = selectedTag ? projectPosts.filter((p) => p.tags?.includes(selectedTag)) : projectPosts

  if (loading) return <Loading />

  if (posts.length === 0) return <p className="text-gray-400">작성된 글이 없습니다.</p>

  return (
    <div className="max-w-4xl">
      <PageHeader label="Devlog" title={<>AI가 쓰는 <span className="text-gradient">개발 기록</span></>}>
        하루 작업이 끝나면 AI가 그날의 커밋 내역을 읽고 이 글들을 씁니다. 프로젝트별로 모아 보거나 태그로 걸러 볼 수 있어요.
      </PageHeader>

      <section className="rise mb-6" style={{ '--d': '.22s' }}>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
          <button onClick={() => setFilter(null, null)} className={projectClass(selectedProject === null)}>
            전체 <span className="font-mono text-xs text-gray-500">{posts.length}</span>
          </button>
          {projects.map((project) => (
            <button
              key={project.name}
              onClick={() => setFilter(project.name === selectedProject ? null : project.name, null)}
              className={projectClass(selectedProject === project.name)}
            >
              {project.name} <span className="font-mono text-xs text-gray-500">{project.count}</span>
            </button>
          ))}
        </div>
      </section>

      {allTags.length > 0 && (
        <div className="rise no-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" style={{ '--d': '.28s' }}>
          <button onClick={() => setFilter(selectedProject, null)} className={chipClass(selectedTag === null)}>
            전체 태그
          </button>
          {visibleTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(selectedProject, tag === selectedTag ? null : tag)}
              className={chipClass(selectedTag === tag)}
            >
              #{tag}
            </button>
          ))}
          {allTags.length > TAG_LIMIT && (
            <button
              onClick={() => setShowAllTags((v) => !v)}
              className="shrink-0 px-2 py-1 font-mono text-xs text-gray-500 transition hover:text-signal"
            >
              {showAllTags ? '접기' : `+${allTags.length - TAG_LIMIT} 더 보기`}
            </button>
          )}
        </div>
      )}

      <p className="mb-4 flex items-center gap-2 font-mono text-xs text-gray-500">
        <SparkIcon className="w-3 h-3 text-signal" />
        기록 {filteredPosts.length}개
      </p>

      <div className="flex flex-col gap-4">
        {filteredPosts.map((post, i) => (
          <Reveal key={post._id} delay={Math.min(i, 4) * 0.05}>
            <GlowCard as={Link} to={`/blog/${post.slug}`} className="group flex flex-col-reverse gap-5 p-5 sm:flex-row sm:p-6">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  {!selectedProject && <span className="text-signal/80">{post.project}</span>}
                  <span className="font-mono">{formatDate(post.publishedAt)}</span>
                  <AiBadge />
                </div>
                <h2 className="mb-2 text-lg font-bold leading-snug tracking-tight group-hover:text-white sm:text-xl">
                  {shortTitle(post.title)}
                </h2>
                {post.summary && <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-400">{post.summary}</p>}
                {post.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags
                      .filter((t) => t !== 'devlog')
                      .map((tag) => (
                        <span
                          key={tag}
                          onClick={(e) => {
                            e.preventDefault()
                            setFilter(selectedProject, tag === selectedTag ? null : tag)
                          }}
                          className={`cursor-pointer rounded-full px-2.5 py-0.5 text-xs transition ${
                            selectedTag === tag
                              ? 'bg-signal text-ink'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                  </div>
                )}
              </div>
              {post.coverUrl && (
                <div className="aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-white/5 sm:w-52">
                  <img
                    src={`${post.coverUrl}?w=520&h=325&fit=crop&auto=format`}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
              )}
            </GlowCard>
          </Reveal>
        ))}
      </div>

      {filteredPosts.length === 0 && <p className="text-gray-400">해당 조건의 글이 없습니다.</p>}
    </div>
  )
}

export default Blog
