import { Bell} from "lucide-react";

export default function CaptainHeader({isOnline,}){
  return (
    <div>
      
    <header className="absolute top-0 left-0 right-0 z-30 w-86 h-13 px-3 mt-2 ml-2  bg-white rounded-full shadow-lg">
      <div className="flex items-center justify-between">
         
        {/* Left   */}
        <div className="flex items-center justify-between gap-3">

           {/* Profile  */}
        <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200 bg-gray">
          <img src="https://i.pravatar.cc/150?img=12" alt="Captain" className="h-full w-full object-cover" />
          {/* <div className="font-semibold text-xl ">H</div> */}
        </div>
        
        <div>
          <h1 className="text-xl">Hello, Captain</h1>
          <p className={`font-semibold ${isOnline? "text-rose-500": "text-gray-800"}`}>{isOnline ? "Online": "Ready to earn?"}</p>
        </div>
        </div>

        {/* Right  */}
        <div>
          <Bell size={25} strokeWidth={1.8} className="text-gray-800" />
        </div>
        
      </div>
    </header>
    </div>
  )
}