import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import client from '../sanityClient'
import TechBadge from '../components/TechBadge'
import { getProject } from '../lib/project'

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

  if (loading) return <p className="text-gray-400">불러오는 중...</p>
  if (!post) return <p className="text-gray-400">글을 찾을 수 없습니다.</p>

  const project = getProject(post)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <Link to="/blog" className="text-gray-500 hover:text-white">
          ← 목록으로
        </Link>
        <Link
          to={`/blog?project=${encodeURIComponent(project)}`}
          className="text-indigo-300 hover:text-indigo-200"
        >
          {project} 글 모아 보기
        </Link>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-xs text-gray-500 mb-4">
        {new Date(post.publishedAt).toLocaleDateString('ko-KR')}
      </p>
      {post.tags && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-700 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
      {post.techStack && post.techStack.length > 0 && (
        <div className="mb-8">
          <p className="text-xs text-gray-500 mb-2">기술스택</p>
          <div className="flex flex-wrap gap-2">
            {post.techStack.map((tech) => (
              <TechBadge key={tech.name} tech={tech} />
            ))}
          </div>
        </div>
      )}
      <div className="prose prose-invert max-w-none prose-code:before:content-none prose-code:after:content-none">
        <PortableText value={post.body} components={bodyComponents} />
      </div>
    </div>
  )
}

export default BlogPost
