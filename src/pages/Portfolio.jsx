import { useEffect, useState } from 'react'
import client from '../sanityClient'
import { TechTile } from '../components/TechBadge'
import { Loading, PageHeader, SectionHeading } from '../components/ui'

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
      <PageHeader label="About" title="Portfolio">
        {profile.intro && <p className="whitespace-pre-line leading-relaxed">{profile.intro}</p>}
        {profile.links?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {profile.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-gray-200 transition hover:border-indigo-300/60 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </PageHeader>

      <div className="space-y-24">
        {profile.techStack?.length > 0 && (
          <section className="rise" style={{ '--d': '.24s' }}>
            <SectionHeading index="01" label="Stack" title="기술 스택" />
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
                  <span className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-ink bg-gradient-to-br from-indigo-400 to-fuchsia-400 shadow-[0_0_12px_rgb(165_180_252_/_0.8)]" />
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
