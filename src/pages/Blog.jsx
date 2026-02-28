import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../sanityClient'

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .fetch(`*[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        tags,
        summary
      }`)
      .then((data) => setPosts(data))
      .catch((err) => console.error('Blog fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-400">불러오는 중...</p>

  if (posts.length === 0)
    return <p className="text-gray-400">작성된 글이 없습니다.</p>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <Link
            key={post._id}
            to={`/blog/${post.slug}`}
            className="border border-gray-700 rounded-xl p-6 hover:border-gray-500 transition"
          >
            <p className="text-xs text-gray-500 mb-1">
              {new Date(post.publishedAt).toLocaleDateString('ko-KR')}
            </p>
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            {post.summary && (
              <p className="text-gray-400 text-sm mb-3">{post.summary}</p>
            )}
            {post.tags && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-700 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Blog
