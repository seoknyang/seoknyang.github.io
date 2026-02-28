import { useEffect, useState } from 'react'
import client from '../sanityClient'
import TechBadge from '../components/TechBadge'

function Portfolio() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .fetch(`*[_type == "portfolio"] | order(order asc) {
        _id,
        title,
        description,
        "techStack": techStack[]{name, "iconUrl": icon.asset->url},
        githubUrl,
        liveUrl,
        "thumbnail": thumbnail.asset->url
      }`)
      .then((data) => setProjects(data))
      .catch((err) => console.error('Portfolio fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-400">불러오는 중...</p>

  if (projects.length === 0)
    return <p className="text-gray-400">등록된 프로젝트가 없습니다.</p>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="border border-gray-700 rounded-xl p-6">
            {project.thumbnail && (
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
            {project.description && (
              <p className="text-gray-400 text-sm mb-4">{project.description}</p>
            )}
            {project.techStack && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech) => (
                  <TechBadge key={tech.name} tech={tech} />
                ))}
              </div>
            )}
            <div className="flex gap-4 text-sm">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                  GitHub
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-green-400 hover:underline">
                  Live
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Portfolio
