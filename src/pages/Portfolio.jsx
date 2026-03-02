import { useEffect, useState } from 'react'
import client from '../sanityClient'
import TechBadge from '../components/TechBadge'

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`
}

function Portfolio() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .fetch(`*[_type == "profile"][0]{
        intro,
        links,
        "techStack": techStack[defined(name)]{name, "iconUrl": icon.asset->url},
        sections[]{
          title,
          items[]{startDate, endDate, date, name, description, note}
        }
      }`)
      .then((data) => setProfile(data))
      .catch((err) => console.error('Profile fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-400">불러오는 중...</p>
  if (!profile) return <p className="text-gray-400">프로필 데이터가 없습니다.</p>

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold">Portfolio</h1>

      {/* 자기소개 */}
      {profile.intro && (
        <section>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">{profile.intro}</p>
        </section>
      )}

      {/* 외부 링크 */}
      {profile.links?.length > 0 && (
        <section className="flex flex-wrap gap-3">
          {profile.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-indigo-400 hover:text-indigo-300 border border-indigo-800 hover:border-indigo-600 px-3 py-1 rounded-full transition-colors"
            >
              {link.label}
            </a>
          ))}
        </section>
      )}

      {/* 기술스택 */}
      {profile.techStack?.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-800 pb-2">기술스택</h2>
          <div className="flex flex-wrap gap-2">
            {profile.techStack.map((tech) => (
              <TechBadge key={tech.name} tech={tech} />
            ))}
          </div>
        </section>
      )}

      {/* 자유 섹션들 */}
      {profile.sections?.map((section, si) => (
        <section key={si}>
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-800 pb-2">
            {section.title}
          </h2>
          <div className="space-y-5">
            {section.items?.map((item, ii) => (
              <div key={ii} className="flex gap-4 sm:gap-6">
                {/* 날짜 영역 */}
                <div className="w-28 sm:w-36 shrink-0 text-sm text-gray-500 pt-0.5 leading-snug">
                  {item.date ? (
                    <span>{formatDate(item.date)}</span>
                  ) : (
                    <span>
                      {formatDate(item.startDate)}
                      {item.startDate && (
                        <>
                          {' – '}
                          {item.endDate ? formatDate(item.endDate) : '현재'}
                        </>
                      )}
                    </span>
                  )}
                </div>

                {/* 내용 영역 */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white">{item.name}</p>
                  {item.description && (
                    <p className="text-sm text-gray-400 mt-1 whitespace-pre-line leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  {item.note && (
                    <p className="text-xs text-gray-500 mt-1">{item.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default Portfolio
