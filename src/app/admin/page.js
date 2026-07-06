import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/posts" className="border border-[#e0e0e0] bg-white p-8 rounded-lg hover:border-black transition-all shadow-sm group">
          <h2 className="text-lg font-bold group-hover:text-black transition-colors">Manage Posts</h2>
          <p className="text-sm text-[#333] mt-2">Create, edit, and publish blog posts.</p>
        </Link>
        <Link href="/admin/posts/create" className="border border-[#e0e0e0] bg-white p-8 rounded-lg hover:border-black transition-all shadow-sm group">
          <h2 className="text-lg font-bold group-hover:text-black transition-colors">New Post</h2>
          <p className="text-sm text-[#333] mt-2">Write a new blog post.</p>
        </Link>
      </div>
    </div>
  )
}
