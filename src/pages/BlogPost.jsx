import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import client from '../sanityClient'
import TechBadge from '../components/TechBadge'
import { Loading } from '../components/ui'
import { formatDate, getProject } from '../lib/project'

// 본문에 들어간 이미지와 코드 블록 렌더링 (기본 PortableText는 둘 다 그리지 않는다)
const bodyComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.url) return null
      const caption = value.caption || value.alt
      return (
        <figure className="my-8">
          <a href={value.url} target="_blank" rel="noreferrer">
            <img
              src={`${value.url}?w=1400&fit=max&auto=format`}
              alt={value.alt || caption || ''}
              width={value.width}
              height={value.height}
              loading="lazy"
              className="mx-auto w-auto max-w-full h-auto max-h-[32rem] rounded-lg border border-gray-800 my-0"
            />
          </a>
          {caption && (
            <figcaption className="text-center text-sm text-gray-400 mt-2">{caption}</figcaption>
          )}
        </figure>
      )
    },
    code: ({ value }) => (
      <pre className="overflow-x-auto">
        <code>{value?.code}</code>
      </pre>
    ),
  },
}

function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post" && slug.current == $slug][0] {
          title,
          publishedAt,
          project,
          tags,
          "techStack": techStack[]{name, "iconUrl": icon.asset->url},
          body[]{
            ...,
            _type == "image" => {
              ...,
              "url": asset->url,
              "width": asset->metadata.dimensions.width,
              "height": asset->metadata.dimensions.height
            }
          }
        }`,
        { slug }
      )
      .then((data) => setPost(data))
      .catch((err) => console.error('BlogPost fetch error:', err))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <Loading />
  if (!post) return <p className="text-gray-400">글을 찾을 수 없습니다.</p>

  const project = getProject(post)

  return (
    <article className="max-w-3xl mx-auto">
      <div className="rise flex flex-wrap items-center gap-2 mb-8 text-sm">
        <Link to="/blog" className="rounded-full border border-white/10 px-3 py-1 text-gray-400 hover:border-white/30 hover:text-white">
          ← 목록
        </Link>
        <Link
          to={`/blog?project=${encodeURIComponent(project)}`}
          className="rounded-full bg-indigo-500/15 border border-indigo-300/30 px-3 py-1 text-indigo-200 hover:border-indigo-300/60"
        >
          {project} 글 모아 보기
        </Link>
      </div>
      <header className="mb-10 border-b border-white/10 pb-8">
        <p className="rise font-mono text-xs text-gray-500 mb-3" style={{ '--d': '.05s' }}>
          {formatDate(post.publishedAt)}
        </p>
        <h1 className="rise text-3xl md:text-4xl font-extrabold tracking-tight leading-tight" style={{ '--d': '.1s' }}>
          {post.title}
        </h1>
        {post.tags && (
          <div className="rise flex flex-wrap gap-1.5 mt-5" style={{ '--d': '.15s' }}>
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-white/5 text-gray-400 px-2.5 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
        {post.techStack && post.techStack.length > 0 && (
          <div className="mt-6">
            <p className="text-xs text-gray-500 mb-2">기술스택</p>
            <div className="flex flex-wrap gap-2">
              {post.techStack.map((tech) => (
                <TechBadge key={tech.name} tech={tech} />
              ))}
            </div>
          </div>
        )}
      </header>
      <div className="rise prose prose-invert prose-lg max-w-none prose-headings:tracking-tight prose-a:text-indigo-300 prose-code:text-indigo-200 prose-code:before:content-none prose-code:after:content-none" style={{ '--d': '.2s' }}>
        <PortableText value={post.body} components={bodyComponents} />
      </div>
    </article>
  )
}

export default BlogPost
