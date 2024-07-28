
//types


export default async function QuestionComponent({question, options}: {question: string, options: string[]}) {
    return (
        <div>
            <h1>{question}</h1>
            <div>
                {options.map((option, index) => {
                    return (
                        <div key={index}>
                            <input type="radio" id={option} name="option" value={option}/>
                            <label htmlFor={option}>{option}</label>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
