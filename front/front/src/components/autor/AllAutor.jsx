import { IoPersonCircleOutline } from "react-icons/io5";
import peticiones from '../../helper/AutorHelper';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AllAuthors = ({userRol,setViewType,setAutorId}) => {
    const [allAuthors,setAllAuthors] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const getAuthors = async () =>{
            try {
                const ressponse = await peticiones.GetAllAuthors()
                setAllAuthors(ressponse)
            } catch (error) {
                console.log("Error al obtener autores: ", error)
            }
        }
        getAuthors()
    }, []);

    const viewAuthor = (id) =>{
        setViewType('only');
        setAutorId(id);
    }

    const deleteAuthor = async (id,name) =>{
        try {
            const confirmCancel = window.confirm(`¿Estás seguro que quieres eliminar al autor ${name}?`);
            if(confirmCancel){
                const {message} = await peticiones.DeleteAuthor({authorId:id})
                alert(message)
                navigate('/Authors')
            }
        } catch (error) {
            console.log("Error al eliminar un autor: ", error)
        }
    }

    return (
        <>
            <div className="mb-4 text-center">
                <h2>Catálogo de Autores</h2>
            </div>
            <div className="d-flex flex-wrap gap-3">
                {allAuthors.map((data,index) => {
                    return <div className={`card w-card`} key={index}>
                                <IoPersonCircleOutline size={50} className="card-img-top"/>
                                <div className="card-body text-center">
                                    <h5 className="card-title">{`${data.first_name} ${data.last_name}`}</h5>
                                    <p className={`card-text overflow-hidden line_clamp`}>{data.biography}</p>
                                </div>
                                <div className='d-flex gap-3 px-3 mb-3 justify-content-center'>
                                    <button onClick={(id) => viewAuthor(data._id)} type="button" className={`btn btn-dark`}>Ver</button>
                                    {
                                        userRol === 'Admin' ?
                                        <button onClick={(id,name) => deleteAuthor(data._id,`${data.first_name} ${data.last_name}`)} type="button" className={`btn btn-danger`}>Eliminar</button>
                                        :
                                        ''
                                    }
                                </div>
                            </div>
                })}
            </div>
        </>
    )
}

export default AllAuthors;