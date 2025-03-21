export default function Loading() {
	// You can add any UI inside Loading, including a Skeleton.
	return (
		<div className="flex items-center justify-center min-w-screen min-h-screen bg-gray-100">
			<div className="flex flex-col items-center">
				<div className="spinner border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
				<div className="mt-4 text-lg text-gray-700">Loading...</div>
			</div>
		</div>
	)
}
