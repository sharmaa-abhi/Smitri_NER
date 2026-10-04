import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-[#E6F4F1] flex items-center justify-center animate-pulse">
          <Sparkles className="w-8 h-8 text-[#0B534B] animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-[#0B534B] border-t-transparent animate-spin" />
      </div>
      <div className="text-center space-y-1">
        <h2 className="text-lg font-bold text-[#111615]">Loading...</h2>
        <p className="text-xs text-[#5A6A66] font-medium">Please wait while we prepare your page</p>
      </div>
    </div>
  );
}
