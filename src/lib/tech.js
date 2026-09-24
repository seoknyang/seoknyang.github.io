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
export function techIconUrl({ name, iconUrl }) {
  if (iconUrl) return iconUrl
  const key = name.toLowerCase()
  return `https://skillicons.dev/icons?i=${aliasMap[key] ?? key.replace(/\s+/g, '')}`
}
