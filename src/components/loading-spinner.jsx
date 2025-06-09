export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
      <span className="ml-3 text-muted text-lg font-semibold animate-fadeIn">Loading characters...</span>
    </div>
  )
}
