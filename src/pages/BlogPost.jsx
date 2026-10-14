import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import client from '../sanityClient'
import TechBadge from '../components/TechBadge'
import { ArrowIcon, Loading, SparkIcon } from '../components/ui'
import { fetchPostSummaries, formatDate, getProject, shortTitle } from '../lib/project'

// 본문에 들어간 이미지와 코드 블록 렌더링 (기본 PortableText는 둘 다 그리지 않는다)
const bodyComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.url) return null
      const caption = value.caption || value.alt
      return (
        <figure className="my-10">
          <a href={value.url} target="_blank" rel="noreferrer">
            <img
              src={`${value.url}?w=1400&fit=max&auto=format`}
              alt={value.alt || caption || ''}
              width={value.width}
              height={value.height}
              loading="lazy"
              className="mx-auto w-auto max-w-full h-auto max-h-[32rem] rounded-xl border border-white/10 my-0 transition hover:border-signal/40"
            />
          </a>
          {caption && <figcaption className="text-center text-sm text-gray-500 mt-3">{caption}</figcaption>}
        </figure>
      )
    },
    code: ({ value }) => (
      <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/40">
        <code>{value?.code}</code>
      </pre>
    ),
  },
}

/** 화면 맨 위의 읽기 진행 막대 */
function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-0.5">
      <div
        className="h-full origin-left bg-signal shadow-[0_0_12px_rgb(196_243_106_/_0.8)]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}

function BlogPost() {
  const { slug } = useParams()
  // 불러온 글과 그 글의 주소. 주소가 바뀌면 새 글을 받을 때까지 불러오는 중으로 본다
  const [loaded, setLoaded] = useState({ slug: null, post: null })
  const loading = loaded.slug !== slug
  const post = loading ? null : loaded.post
  const [siblings, setSiblings] = useState({ prev: null, next: null })

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
      .then((data) => setLoaded({ slug, post: data }))
      .catch((err) => {
        console.error('BlogPost fetch error:', err)
        setLoaded({ slug, post: null })
      })
  }, [slug])

  // 같은 프로젝트의 이전 글과 다음 글
  useEffect(() => {
    if (!post) return
    const project = getProject(post)
    fetchPostSummaries()
      .then((all) => {
        const same = all.filter((p) => p.project === project)
        const i = same.findIndex((p) => p.slug === slug)
        setSiblings({ next: same[i - 1] ?? null, prev: same[i + 1] ?? null })
      })
      .catch(() => {})
  }, [post, slug])

  if (loading) return <Loading />
  if (!post) return <p className="text-gray-400">글을 찾을 수 없습니다.</p>

  const project = getProject(post)
  const tags = post.tags?.filter((t) => t !== 'devlog') ?? []

  return (
    <article className="max-w-3xl mx-auto">
      <ReadingProgress />
      <div className="rise flex flex-wrap items-center gap-2 mb-8 text-sm">
        <Link to="/blog" className="rounded-full border border-white/10 px-3 py-1 text-gray-400 hover:border-white/30 hover:text-white">
          ← 목록
        </Link>
        <Link
          to={`/blog?project=${encodeURIComponent(project)}`}
          className="rounded-full border border-signal/30 bg-signal/10 px-3 py-1 text-signal hover:border-signal/60"
        >
          {project} 기록 모아 보기
        </Link>
      </div>
      <header className="mb-10 border-b border-white/10 pb-8">
        <p className="rise font-mono text-xs text-gray-500 mb-3" style={{ '--d': '.05s' }}>
          {formatDate(post.publishedAt)}
        </p>
        <h1 className="rise text-3xl md:text-[2.6rem] font-extrabold tracking-tight leading-tight" style={{ '--d': '.1s' }}>
          {shortTitle(post.title)}
        </h1>
        {tags.length > 0 && (
          <div className="rise flex flex-wrap gap-1.5 mt-5" style={{ '--d': '.15s' }}>
            {tags.map((tag) => (
              <Link
                key={tag}
                to={`/blog?tag=${encodeURIComponent(tag)}`}
                className="text-xs bg-white/5 text-gray-400 px-2.5 py-0.5 rounded-full hover:bg-white/10 hover:text-gray-200"
              >
                #{tag}
              </Link>
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

        <div className="rise mt-8 flex gap-3 rounded-2xl border border-signal/20 bg-signal/[0.05] p-4 text-sm" style={{ '--d': '.2s' }}>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-signal text-ink">
            <SparkIcon className="w-4 h-4" />
          </span>
          <p className="leading-relaxed text-gray-300">
            <span className="font-semibold text-white">이 글은 AI가 썼습니다.</span> 그날의 git 커밋 내역과 작업 화면을 바탕으로 AI가 작성하고 발행했어요.
          </p>
        </div>
      </header>
      <div
        className="rise prose prose-invert prose-lg max-w-none prose-headings:tracking-tight prose-a:text-signal prose-strong:text-white prose-code:text-signal prose-code:before:content-none prose-code:after:content-none prose-th:text-gray-300 prose-hr:border-white/10"
        style={{ '--d': '.25s' }}
      >
        <PortableText value={post.body} components={bodyComponents} />
      </div>

      {(siblings.prev || siblings.next) && (
        <nav className="mt-16 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2">
          {[
            { post: siblings.prev, label: '이전 기록', align: '' },
            { post: siblings.next, label: '다음 기록', align: 'sm:text-right sm:col-start-2' },
          ].map(({ post: p, label, align }) =>
            p ? (
              <Link
                key={label}
                to={`/blog/${p.slug}`}
                className={`group rounded-2xl border border-white/10 bg-panel/70 p-5 transition hover:border-signal/40 ${align}`}
              >
                <span className="font-mono text-xs text-gray-500">{label}</span>
                <span className="mt-1 block font-semibold leading-snug text-gray-200 group-hover:text-white">
                  {shortTitle(p.title)}
                </span>
              </Link>
            ) : null
          )}
        </nav>
      )}

      <div className="mt-10 text-center">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          모든 개발 기록 보기 <ArrowIcon />
        </Link>
      </div>
    </article>
  )
}

export default BlogPost
