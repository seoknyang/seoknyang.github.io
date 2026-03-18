import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../sanityClient'

function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState(null)

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

  const allTags = [...new Set(posts.flatMap((p) => p.tags ?? []))]

  const filteredPosts = selectedTag
    ? posts.filter((p) => p.tags?.includes(selectedTag))
    : posts

  if (loading) return <p className="text-gray-400">불러오는 중...</p>

  if (posts.length === 0)
    return <p className="text-gray-400">작성된 글이 없습니다.</p>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Blog</h1>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedTag(null)}
            className={`text-xs px-3 py-1 rounded-full border transition ${
              selectedTag === null
                ? 'bg-white text-black border-white'
                : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200'
            }`}
          >
            전체
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`text-xs px-3 py-1 rounded-full border transition ${
                selectedTag === tag
                  ? 'bg-white text-black border-white'
                  : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200'
              }`}
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
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <p className="text-gray-400">해당 태그의 글이 없습니다.</p>
      )}
    </div>
  )
}

export default Blog
