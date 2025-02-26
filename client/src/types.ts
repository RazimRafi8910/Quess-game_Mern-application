
enum Options {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D'
}

export type QuestionOptionType = {
    option: Options
    optionValue: string 
}

export type QuestionType = {
    question: string
    options: QuestionOptionType[]
    answer: Options
    listed?: boolean
    category: string
    _id:string
}

export type CategorysType = {
    categoryName: string
    totalQuestions: number
    _id:string
}