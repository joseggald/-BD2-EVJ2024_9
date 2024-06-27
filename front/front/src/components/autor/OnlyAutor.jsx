import { IoPersonCircleOutline } from "react-icons/io5";
import peticiones from '../../helper/AutorHelper';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const OnlyAuthor = ({userRol,setViewType,setAutorId}) => {
    const [allAuthors,setAllAuthors] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const getAuthors = async () =>{
            try {
                //const ressponse = await peticiones.GetOnlyAuthor()
                //setAllAuthors(ressponse)
            } catch (error) {
                console.log("Error al obtener autor: ", error)
            }
        }
        getAuthors()
    }, []);

    return (
        <>
            <div className="mb-4 text-center">
                <h2>Unico Autor</h2>
            </div>
        </>
    )
}

export default OnlyAuthor;