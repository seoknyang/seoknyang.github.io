import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="flex flex-col items-center text-center py-20 gap-6">
      <h1 className="text-5xl font-bold">안녕하세요 👋</h1>
      <p className="text-xl text-gray-400 max-w-xl">
        저는 <span className="text-indigo-400 font-semibold">seoknyang</span>입니다.
        개발하면서 배운 것들을 기록하고 프로젝트를 소개하는 공간입니다.
      </p>
      <div className="flex gap-4 mt-4">
        <Link
          to="/portfolio"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          포트폴리오 보기
        </Link>
        <Link
          to="/blog"
          className="px-6 py-3 border border-gray-600 hover:border-gray-400 rounded-lg transition-colors"
        >
          블로그 보기
        </Link>
      </div>
    </div>
  )
}

export default Home
