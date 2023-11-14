
const NotFound = () => {

    return (
        <div className="flex flex-col justify-center items-center w-[calc(100vw-100px)] h-[60%]">
            <div className="text-[10em] text-[#6F37CF]  md:text-[20em] font-bold mr-[10px]">404</div>
            <div className='text-center dark:text-white '>
                <span className=" text-[1.5em] md:text-[3em] font-bold  ">Ooops...</span>
                <p className=" text-[2em] md:text-[4em] font-semibold">Page Not Found !!</p>
            </div>
        </div>
    )
}

export default NotFound;