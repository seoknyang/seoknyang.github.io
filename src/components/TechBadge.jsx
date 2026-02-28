// Sanity 입력값과 skillicons.dev 아이콘 이름이 다른 경우만 여기에 추가
const aliasMap = {
  'typescript':   'ts',
  'javascript':   'js',
  'python':       'py',
  'tailwindcss':  'tailwind',
  'tailwind css': 'tailwind',
  'node.js':      'nodejs',
  'next.js':      'nextjs',
  'vue.js':       'vue',
  'postgresql':   'postgres',
  'c++':          'cpp',
  'c#':           'cs',
}

// tech: { name: string, iconUrl: string | null }
function TechBadge({ tech }) {
  const { name, iconUrl } = tech
  const key = name.toLowerCase()
  const skillIconUrl = `https://skillicons.dev/icons?i=${aliasMap[key] ?? key.replace(/\s+/g, '')}`

  return (
    <span className="flex items-center gap-1.5 text-xs bg-gray-800 text-gray-200 px-2 py-1 rounded">
      <img
        src={iconUrl ?? skillIconUrl}
        alt={name}
        className="w-4 h-4"
        onError={(e) => { e.target.style.display = 'none' }}
      />
      {name}
    </span>
  )
}

export default TechBadge
