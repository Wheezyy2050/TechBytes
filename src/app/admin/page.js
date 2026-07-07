import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-[var(--text-primary)]">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/posts" className="border border-[var(--border)] bg-white p-8 hover:border-[var(--accent)] transition-colors group block">
          <h2 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">Manage Posts</h2>
          <p className="text-sm text-[var(--text-muted)] mt-2">Create, edit, and publish blog posts.</p>
        </Link>
        <Link href="/admin/posts/create" className="border border-[var(--border)] bg-white p-8 hover:border-[var(--accent)] transition-colors group block">
          <h2 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">New Post</h2>
          <p className="text-sm text-[var(--text-muted)] mt-2">Write a new blog post.</p>
        </Link>
      </div>
    </div>
  )
}
