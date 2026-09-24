// 글의 프로젝트 이름. project 필드가 없던 예전 devlog 글은
// 제목 형식 "YYYY-MM-DD 프로젝트명 - 요약"에서 프로젝트명을 꺼낸다.
const TITLE_PATTERN = /^\d{4}-\d{2}-\d{2}\s+(.+?)\s+-\s/

export const OTHER_PROJECT = '기타'

export function getProject(post) {
  if (post.project) return post.project
  const match = post.title?.match(TITLE_PATTERN)
  return match ? match[1] : OTHER_PROJECT
}

// 목록용 글 요약 (프로젝트, 대표 이미지 포함)
export const POST_SUMMARY_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  project,
  tags,
  summary,
  "coverUrl": coalesce(coverImage.asset->url, body[_type == "image"][0].asset->url)
}`

export const withProject = (posts) => posts.map((p) => ({ ...p, project: getProject(p) }))

/**
 * 글을 프로젝트별로 묶는다. 최근에 쓴 프로젝트가 앞, 기타는 맨 뒤.
 * posts는 최신순으로 정렬되어 있어야 한다 (대표 이미지는 가장 최근 이미지).
 */
export function groupProjects(posts) {
  const byName = {}
  for (const p of posts) {
    const entry = (byName[p.project] ??= {
      name: p.project,
      count: 0,
      latest: p.publishedAt,
      first: p.publishedAt,
      coverUrl: null,
      summary: p.summary,
      tags: new Set(),
    })
    entry.count += 1
    if (p.publishedAt > entry.latest) entry.latest = p.publishedAt
    if (p.publishedAt < entry.first) entry.first = p.publishedAt
    entry.coverUrl ??= p.coverUrl
    p.tags?.forEach((t) => t !== 'devlog' && entry.tags.add(t))
  }
  return Object.values(byName)
    .map((e) => ({ ...e, tags: [...e.tags] }))
    .sort((a, b) =>
      a.name === OTHER_PROJECT ? 1 : b.name === OTHER_PROJECT ? -1 : b.latest.localeCompare(a.latest)
    )
}

// 제목에서 "YYYY-MM-DD 프로젝트명 - " 머리를 뗀 부분 (목록에서 프로젝트를 따로 보여 줄 때)
export const shortTitle = (title) => title.replace(TITLE_PATTERN, '')

export const formatDate = (iso) => new Date(iso).toLocaleDateString('ko-KR')

// 2026.09
export const formatMonth = (iso) => {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`
}

// 프로젝트 기간: 같은 달이면 한 번만
export const formatPeriod = (first, latest) => {
  const a = formatMonth(first)
  const b = formatMonth(latest)
  return a === b ? a : `${a} ~ ${b}`
}
