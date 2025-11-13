const items=[
  {title:"Blue Modern Financial Report",iconColor:"bg-blue-500"},
  {title:"Daily Report in Dark Gray",iconColor:"bg-gray-700"},
  {title:"Black Minimalist LinkedIn Banner",iconColor:"bg-black"},
  {title:"Black and White Illustration",iconColor:"bg-gray-900"},
  {title:"Black Gradient Minimal Poster",iconColor:"bg-gradient-to-br from-gray-700 to-black"},
  {title:"Black Elegant Modern Card",iconColor:"bg-gray-800"}
]

const SecondarySidebar=()=>{
  return(
    <div className="w-64 h-screen border-r bg-white/70 backdrop-blur-sm hidden md:flex flex-col">
      <div className="px-5 py-4">
        <div className="text-2xl font-semibold text-cyan-600">Daily Report</div>
      </div>
      <div className="px-5 py-2 text-sm text-gray-600">Recent designs</div>
      <div className="px-2 space-y-1 overflow-auto">
        {items.map((it,idx)=> (
          <div key={idx} className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <div className={`w-7 h-7 rounded-sm mr-3 ${it.iconColor}`}></div>
            <div className="text-sm text-gray-800 truncate">{it.title}</div>
          </div>
        ))}
      </div>
      <div className="mt-auto px-5 py-4">
        <button className="text-sm text-purple-600 hover:text-purple-700">See all</button>
      </div>
    </div>
  )
}

export default SecondarySidebar
