// 글의 프로젝트 이름. project 필드가 없던 예전 devlog 글은
// 제목 형식 "YYYY-MM-DD 프로젝트명 - 요약"에서 프로젝트명을 꺼낸다.
const TITLE_PATTERN = /^\d{4}-\d{2}-\d{2}\s+(.+?)\s+-\s/

export const OTHER_PROJECT = '기타'

export function getProject(post) {
  if (post.project) return post.project
  const match = post.title?.match(TITLE_PATTERN)
  return match ? match[1] : OTHER_PROJECT
}
