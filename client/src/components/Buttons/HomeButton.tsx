
interface ButtonProps {
    buttonType: 'button' | 'submit' | 'reset' | undefined
    className?: string
    backGround?: string
    content: string
    onClick?: () => void
}

function HomeButton({ buttonType, className, content,backGround, onClick }: ButtonProps) {
    return (
        <>
            <button
                onClick={onClick}
                type={buttonType}
                className={`${className} rounded-md py-4 px-6 md:px-8 text-xl font-bold border border-slate-900 text-center text-white transition-all shadow-md hover:shadow-lg focus:shadow-none active:shadow-none ${
                    backGround ? backGround : 'bg-gradient-to-tl from-blue-600 to-slate-600 hover:from-blue-800 hover:to-blue-600 active:bg-slate-700'
                }`}
            >
                {content}
            </button>
        </>
    )
}

export default HomeButton