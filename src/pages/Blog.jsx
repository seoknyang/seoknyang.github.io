import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import client from '../sanityClient'
import { GlowCard, Loading, PageHeader } from '../components/ui'
import { POST_SUMMARY_QUERY, formatDate, groupProjects, withProject } from '../lib/project'

const chipClass = (active) =>
  `text-xs px-3 py-1 rounded-full border transition ${
    active
      ? 'bg-white text-black border-white'
      : 'border-white/15 text-gray-400 hover:border-white/40 hover:text-gray-200'
  }`

const projectCardClass = (active) =>
  `text-left rounded-2xl border px-4 py-3 transition ${
    active
      ? 'border-indigo-300/60 bg-indigo-500/15 shadow-[0_0_30px_-10px_rgb(129_140_248_/_0.8)]'
      : 'border-white/10 bg-panel/60 hover:border-white/30'
  }`

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedProject = searchParams.get('project')

  useEffect(() => {
    client
      .fetch(POST_SUMMARY_QUERY)
      .then((data) => setPosts(withProject(data)))
      .catch((err) => console.error('Blog fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  const projects = groupProjects(posts)

  const selectProject = (name) => {
    setSelectedTag(null)
    setSearchParams(name ? { project: name } : {})
  }

  const projectPosts = selectedProject
    ? posts.filter((p) => p.project === selectedProject)
    : posts
  const allTags = [...new Set(projectPosts.flatMap((p) => p.tags ?? []))]
  const filteredPosts = selectedTag
    ? projectPosts.filter((p) => p.tags?.includes(selectedTag))
    : projectPosts

  if (loading) return <Loading />

  if (posts.length === 0)
    return <p className="text-gray-400">작성된 글이 없습니다.</p>

  return (
    <div className="max-w-4xl">
      <PageHeader label="Writing" title="Blog">
        프로젝트를 만들며 매일 남기는 개발 기록입니다.
      </PageHeader>

      <section className="mb-8">
        <p className="font-mono text-xs tracking-widest text-gray-500 uppercase mb-3">Projects</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <button onClick={() => selectProject(null)} className={projectCardClass(selectedProject === null)}>
            <p className="font-semibold truncate">전체</p>
            <p className="text-xs text-gray-500 mt-1">{posts.length}개의 글</p>
          </button>
          {projects.map((project) => (
            <button
              key={project.name}
              onClick={() => selectProject(project.name === selectedProject ? null : project.name)}
              className={projectCardClass(selectedProject === project.name)}
            >
              <p className="font-semibold truncate" title={project.name}>{project.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {project.count}개의 글, 최근 {formatDate(project.latest)}
              </p>
            </button>
          ))}
        </div>
      </section>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button onClick={() => setSelectedTag(null)} className={chipClass(selectedTag === null)}>
            전체 태그
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={chipClass(selectedTag === tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-5">
        {filteredPosts.map((post) => (
          <GlowCard
            key={post._id}
            as={Link}
            to={`/blog/${post.slug}`}
            className="group flex flex-col-reverse sm:flex-row gap-5 p-6"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-2">
                {!selectedProject && <span className="text-indigo-300 mr-2">{post.project}</span>}
                <span className="font-mono">{formatDate(post.publishedAt)}</span>
              </p>
              <h2 className="text-xl font-bold tracking-tight mb-2 group-hover:text-white">{post.title}</h2>
              {post.summary && (
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{post.summary}</p>
              )}
              {post.tags && (
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      onClick={(e) => {
                        e.preventDefault()
                        setSelectedTag(tag === selectedTag ? null : tag)
                      }}
                      className={`text-xs px-2.5 py-0.5 rounded-full cursor-pointer transition ${
                        selectedTag === tag
                          ? 'bg-white text-black'
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
              <div className="w-full sm:w-52 aspect-[16/10] shrink-0 overflow-hidden rounded-xl bg-white/5">
                <img
                  src={`${post.coverUrl}?w=520&h=325&fit=crop&auto=format`}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
            )}
          </GlowCard>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <p className="text-gray-400">해당 조건의 글이 없습니다.</p>
      )}
    </div>
  )
}

export default Blog
