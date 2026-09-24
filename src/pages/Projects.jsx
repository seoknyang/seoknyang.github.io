import { useEffect, useState } from 'react'
import client from '../sanityClient'
import TechBadge from '../components/TechBadge'
import ProjectCard from '../components/ProjectCard'
import { GlowCard, Loading, PageHeader, SectionHeading } from '../components/ui'
import { POST_SUMMARY_QUERY, OTHER_PROJECT, groupProjects, withProject } from '../lib/project'

const PORTFOLIO_QUERY = `*[_type == "portfolio"] | order(order asc) {
  _id,
  title,
  description,
  "techStack": techStack[defined(name)]{name, "iconUrl": icon.asset->url},
  githubUrl,
  liveUrl,
  "thumbnail": thumbnail.asset->url
}`

function Projects() {
  const [items, setItems] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .fetch(`{"items": ${PORTFOLIO_QUERY}, "posts": ${POST_SUMMARY_QUERY}}`)
      .then(({ items, posts }) => {
        setItems(items)
        setPosts(withProject(posts))
      })
      .catch((err) => console.error('Projects fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  const devProjects = groupProjects(posts).filter((p) => p.name !== OTHER_PROJECT)

  return (
    <div>
      <PageHeader label="Work" title="Projects">
        만들어 온 것들입니다. 각 프로젝트를 누르면 개발 과정을 기록한 글을 모아 볼 수 있어요.
      </PageHeader>

      <div className="space-y-24">
        {devProjects.length > 0 && (
          <section>
            <SectionHeading index="01" label="Dev log" title="개발 프로젝트" />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {devProjects.map((project, i) => (
                <ProjectCard key={project.name} project={project} featured={i === 0} />
              ))}
            </div>
          </section>
        )}

        {items.length > 0 && (
          <section>
            <SectionHeading
              index={devProjects.length > 0 ? '02' : '01'}
              label="Showcase"
              title="그 밖의 작업"
            />
            <div className="grid gap-5 md:grid-cols-2">
              {items.map((item) => (
                <GlowCard key={item._id} className="overflow-hidden">
                  {item.thumbnail && (
                    <img
                      src={`${item.thumbnail}?w=900&h=500&fit=crop&auto=format`}
                      alt=""
                      loading="lazy"
                      className="w-full aspect-[16/9] object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
                    {item.description && (
                      <p className="mt-2 text-gray-400 leading-relaxed">{item.description}</p>
                    )}
                    {item.techStack?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.techStack.map((tech) => (
                          <TechBadge key={tech.name} tech={tech} />
                        ))}
                      </div>
                    )}
                    {(item.githubUrl || item.liveUrl) && (
                      <div className="mt-5 flex gap-3 text-sm">
                        {item.githubUrl && (
                          <a href={item.githubUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-1.5 hover:border-white/40">
                            GitHub
                          </a>
                        )}
                        {item.liveUrl && (
                          <a href={item.liveUrl} target="_blank" rel="noreferrer" className="rounded-full bg-white px-4 py-1.5 font-semibold text-black">
                            Live
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </GlowCard>
              ))}
            </div>
          </section>
        )}

        {devProjects.length === 0 && items.length === 0 && (
          <p className="text-gray-400">등록된 프로젝트가 없습니다.</p>
        )}
      </div>
    </div>
  )
}

export default Projects
