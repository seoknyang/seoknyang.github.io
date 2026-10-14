import { useEffect, useState } from 'react'
import client from '../sanityClient'
import { TechTile } from '../components/TechBadge'
import { Loading, PageHeader, SectionHeading } from '../components/ui'

// 이 사이트에서 사람과 AI가 나눠 맡는 일
const WAYS = [
  { who: 'HUMAN', title: '무엇을 만들지 정합니다', body: '아이디어를 고르고, 직접 써 보며 좋고 나쁨을 판단하고, 다음에 무엇을 할지 정합니다.' },
  { who: 'HUMAN + AI', title: '대화하며 함께 만듭니다', body: 'AI에게 원하는 모습을 설명하면 AI가 코드를 쓰고, 실행해 본 결과를 두고 다시 이야기합니다.' },
  { who: 'AI', title: '과정을 글로 남깁니다', body: '하루가 끝나면 AI가 커밋 내역을 읽고 개발 기록을 써서 이 사이트에 올립니다.' },
]

function formatMonth(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`
}

function period(item) {
  if (item.date) return formatMonth(item.date)
  if (!item.startDate) return null
  return `${formatMonth(item.startDate)} ~ ${item.endDate ? formatMonth(item.endDate) : '현재'}`
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

  if (loading) return <Loading />
  if (!profile) return <p className="text-gray-400">프로필 데이터가 없습니다.</p>

  return (
    <div>
      <PageHeader label="About" title="만드는 사람">
        {profile.intro && <p className="whitespace-pre-line leading-relaxed">{profile.intro}</p>}
        {profile.links?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {profile.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-gray-200 transition hover:border-signal/60 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </PageHeader>

      <div className="space-y-24">
        <section className="rise grid gap-4 md:grid-cols-3" style={{ '--d': '.2s' }}>
          {WAYS.map((w) => (
            <div key={w.title} className="rounded-2xl border border-white/[0.08] bg-panel/70 p-6 backdrop-blur">
              <p className="font-mono text-xs text-signal/80">{w.who}</p>
              <p className="mt-2 text-lg font-bold tracking-tight">{w.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{w.body}</p>
            </div>
          ))}
        </section>

        {profile.techStack?.length > 0 && (
          <section className="rise" style={{ '--d': '.24s' }}>
            <SectionHeading index="01" label="Stack" title="다뤄 본 기술" />
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-y-6 justify-items-center rounded-3xl border border-white/10 bg-panel/60 p-6 md:p-10">
              {profile.techStack.map((tech) => (
                <TechTile key={tech.name} tech={tech} />
              ))}
            </div>
          </section>
        )}

        {profile.sections?.map((section, si) => (
          <section key={si}>
            <SectionHeading
              index={String(si + 2).padStart(2, '0')}
              label="Record"
              title={section.title}
            />
            <ol className="relative border-l border-white/10 ml-2 space-y-10">
              {section.items?.map((item, ii) => (
                <li key={ii} className="relative pl-8">
                  <span className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-ink bg-signal shadow-[0_0_12px_rgb(196_243_106_/_0.8)]" />
                  {period(item) && (
                    <p className="font-mono text-xs text-gray-500 mb-1">{period(item)}</p>
                  )}
                  <p className="text-lg font-semibold text-white">{item.name}</p>
                  {item.description && (
                    <p className="mt-1 text-gray-400 whitespace-pre-line leading-relaxed">{item.description}</p>
                  )}
                  {item.note && <p className="mt-1 text-xs text-gray-500">{item.note}</p>}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  )
}

export default Portfolio
