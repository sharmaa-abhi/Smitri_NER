import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center animate-pulse">
          <Sparkles className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
      <div className="text-center space-y-1">
        <h2 className="text-lg font-bold text-slate-800">Loading...</h2>
        <p className="text-xs text-slate-500 font-medium">Please wait while we prepare your page</p>
      </div>
    </div>
  );
}
