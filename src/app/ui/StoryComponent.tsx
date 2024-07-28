export default function StoryComponent({
  title,
  storyText,
  className
}: {
  title: string,
  storyText: string,
  className: string
}) {
  return (
    <div className="w-full mx-auto p-6 bg-slate-100 shadow-md rounded-lg ">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">{title}</h1>
      <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
        {storyText}
      </div>
    </div>
  );
}
