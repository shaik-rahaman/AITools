export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-[#374151]"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#2563EB] animate-spin"></div>
      </div>
      <p className="mt-4 text-[#9CA3AF] text-sm">Loading...</p>
    </div>
  )
}
