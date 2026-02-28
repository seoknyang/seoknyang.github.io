import { useParams } from 'react-router-dom'

function BlogPost() {
  const { slug } = useParams()

  return (
    <div>
      <p className="text-gray-400">포스트 ({slug}) - Sanity CMS 연동 후 내용이 표시됩니다.</p>
    </div>
  )
}

export default BlogPost
