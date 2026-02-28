import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import client from '../sanityClient'
import TechBadge from '../components/TechBadge'

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
          tags,
          "techStack": techStack[]{name, "iconUrl": icon.asset->url},
          body
        }`,
        { slug }
      )
      .then((data) => setPost(data))
      .catch((err) => console.error('BlogPost fetch error:', err))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <p className="text-gray-400">불러오는 중...</p>
  if (!post) return <p className="text-gray-400">글을 찾을 수 없습니다.</p>

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/blog" className="text-sm text-gray-500 hover:text-white mb-6 inline-block">
        ← 목록으로
      </Link>
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
      <div className="prose prose-invert max-w-none">
        <PortableText value={post.body} />
      </div>
    </div>
  )
}

export default BlogPost
