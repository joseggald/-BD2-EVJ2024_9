import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AllAuthors from "./AllAutor";
import OnlyAuthor from "./OnlyAutor";

const Authors = () => {
    const [userRol,setUserRol] = useState('Admin')
    const [viewType,setViewType] = useState('')
    const [autorId,setAutorId] = useState()
    const navigate = useNavigate();

    useEffect(() => {
        const getAuthors = async () =>{
            try {
                //const userRol = localStorage.getItem('userRole');
                //if (!userRol){
                //    navigate('/login');
                //}
                setUserRol(userRol)
                setViewType('all')
            } catch (error) {
                console.log("Error al obtener acceso: ", error)
            }
        }
        getAuthors()
    }, []);

    return (
        <div className="container pt-0">
            {
                viewType === 'all' ?
                <AllAuthors userRol={userRol} setViewType={setViewType} setAutorId={setAutorId}/>
                :
                viewType === 'only'?
                <OnlyAuthor userRol={userRol} setViewType={setViewType} setAutorId={setAutorId}/>
                :
                viewType === 'add' ?
                ''
                :
                setViewType('all')
            }
        </div>
    )
}

export default Authors;