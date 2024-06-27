import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AllBooks from "./AllBooks";
import OnlyBook from "./OnlyBook";

const Books = () => {
    const [viewType,setViewType] = useState('')
    const [bookId,setBookId] = useState()
    const navigate = useNavigate();

    useEffect(() => {
        const getBooks = async () =>{
            try {
                const userRol = localStorage.getItem('userRole');
                if (!userRol){
                   navigate('/login');
                }
                setViewType('all')
            } catch (error) {
                console.log("Error al obtener acceso: ", error)
            }
        }
        getBooks()
    }, []);

    return (
        <div className="container pt-0">
            {
                viewType === 'all' ?
                <AllBooks setViewType={setViewType} setBookId={setBookId}/>
                :
                viewType === 'only'?
                <OnlyBook setViewType={setViewType} bookId={bookId}/>
                :
                setViewType('all')
            }
        </div>
    )
}

export default Books;