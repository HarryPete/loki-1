import { useState } from 'react'

const Switch = ({id, status, updateSessionStatus}) =>
{
    const [slide, setSlide] = useState(status)

    const handleClick = async () =>
    {
        setSlide((prev) => prev === 'Upcoming' ? 'Completed' : 'Upcoming');
    }

    return(
        <div className={`w-10 h-6 shadow-md border rounded-3xl relative cursor-pointer ${slide === 'Upcoming' ? ' bg-gray-200' : 'bg-yellow-400'}`} onClick={()=> {handleClick(); updateSessionStatus(id, status)}}>
            <div className={`absolute shadow-lg left-0.5 top-0.25 transition-transform bg-white rounded-full w-5 h-5 ${slide === 'Upcoming' ? 'left-0 ' : 'right-0'}`}></div>
        </div>
    )
}

export default Switch