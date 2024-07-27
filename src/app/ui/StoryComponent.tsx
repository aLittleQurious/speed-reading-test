export default function StoryComponent({title, storyText}: {title: string, storyText: string}) {



    return (
        <div className="flex flex-col items-center justify-between p-24">
            <h1>{title}</h1>
            <p>{storyText}</p>
        </div>
    );
}