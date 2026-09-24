import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import client from '../sanityClient'
import { getProject, OTHER_PROJECT } from '../lib/project'

const chipClass = (active) =>
  `text-xs px-3 py-1 rounded-full border transition ${
    active
      ? 'bg-white text-black border-white'
      : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200'
  }`

const projectCardClass = (active) =>
  `text-left rounded-xl border px-4 py-3 transition ${
    active ? 'border-indigo-400 bg-indigo-500/10' : 'border-gray-700 hover:border-gray-500'
  }`

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedProject = searchParams.get('project')

  useEffect(() => {
    client
      .fetch(`*[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        project,
        tags,
        summary,
        "coverUrl": coalesce(coverImage.asset->url, body[_type == "image"][0].asset->url)
      }`)
      .then((data) => setPosts(data.map((p) => ({ ...p, project: getProject(p) }))))
      .catch((err) => console.error('Blog fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  // 프로젝트별 글 수와 최근 글 날짜. 최근에 쓴 프로젝트가 앞, 기타는 맨 뒤
  const projects = Object.values(
    posts.reduce((acc, p) => {
      const entry = acc[p.project] ?? { name: p.project, count: 0, latest: p.publishedAt }
      entry.count += 1
      if (p.publishedAt > entry.latest) entry.latest = p.publishedAt
      acc[p.project] = entry
      return acc
    }, {})
  ).sort((a, b) =>
    a.name === OTHER_PROJECT ? 1 : b.name === OTHER_PROJECT ? -1 : b.latest.localeCompare(a.latest)
  )

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

  if (loading) return <p className="text-gray-400">불러오는 중...</p>

  if (posts.length === 0)
    return <p className="text-gray-400">작성된 글이 없습니다.</p>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Blog</h1>

      <section className="mb-8">
        <p className="text-xs text-gray-500 mb-3">프로젝트</p>
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
                {project.count}개의 글, 최근 {new Date(project.latest).toLocaleDateString('ko-KR')}
              </p>
            </button>
          ))}
        </div>
      </section>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
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

      <div className="flex flex-col gap-6">
        {filteredPosts.map((post) => (
          <Link
            key={post._id}
            to={`/blog/${post.slug}`}
            className="flex flex-col-reverse sm:flex-row gap-5 border border-gray-700 rounded-xl p-6 hover:border-gray-500 transition"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-1">
                {!selectedProject && <span className="text-indigo-300 mr-2">{post.project}</span>}
                {new Date(post.publishedAt).toLocaleDateString('ko-KR')}
              </p>
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              {post.summary && (
                <p className="text-gray-400 text-sm mb-3">{post.summary}</p>
              )}
              {post.tags && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      onClick={(e) => {
                        e.preventDefault()
                        setSelectedTag(tag === selectedTag ? null : tag)
                      }}
                      className={`text-xs px-2 py-1 rounded cursor-pointer transition ${
                        selectedTag === tag
                          ? 'bg-white text-black'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {post.coverUrl && (
              <img
                src={`${post.coverUrl}?w=480&h=300&fit=crop&auto=format`}
                alt=""
                loading="lazy"
                className="w-full sm:w-48 aspect-[16/10] object-cover rounded-lg bg-gray-800 shrink-0"
              />
            )}
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <p className="text-gray-400">해당 조건의 글이 없습니다.</p>
      )}
    </div>
  )
}

export default Blog
