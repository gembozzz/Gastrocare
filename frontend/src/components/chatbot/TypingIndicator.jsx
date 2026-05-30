export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1.5 p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-sm shadow-sm w-fit max-w-[85%] self-start">
      <div className="w-2 h-2 rounded-full bg-slate-300 animate-[bounce_1s_infinite_0ms]"></div>
      <div className="w-2 h-2 rounded-full bg-slate-300 animate-[bounce_1s_infinite_200ms]"></div>
      <div className="w-2 h-2 rounded-full bg-slate-300 animate-[bounce_1s_infinite_400ms]"></div>
    </div>
  );
}
