import { IoPersonCircleOutline } from "react-icons/io5";
import { FaLongArrowAltRight } from "react-icons/fa";
import peticiones from '../../helper/AutorHelper';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const OnlyAuthor = ({setViewType,autorId}) => {
    const [author,setAuthor] = useState({})
    const [books,setBooks] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const getAuthors = async () =>{
            try {
                const ressponse = await peticiones.GetOnlyAuthor({author_uid:autorId})
                setAuthor(ressponse[0])

                const ressbooks = await peticiones.GetBooksAuthor({authorId:ressponse[0]._id})
                setBooks(ressbooks)
            } catch (error) {
                setViewType('all')
                alert("Error al obtener datos de autor: ", error)
            }
        }
        getAuthors()
    }, []);

    const returnAuthors = () => {
        setViewType('all');
    }

    return (
        <>
            <div>
                <p>
                    <span onClick={returnAuthors} className="cursor_pinter">Autores</span> <FaLongArrowAltRight /> Autor <FaLongArrowAltRight /> {`${author.first_name} ${author.last_name}`}
                </p>
            </div>
            <div className="mb-4">
                <h2>{`${author.first_name} ${author.last_name}`}</h2>
            </div>
            <div className="d-flex align-items-center gap-3">
                <IoPersonCircleOutline size={300}/>
                <div>
                    <p><strong>Edad: </strong>{author.age} años</p>
                    <p><strong>Biografía: </strong>{author.biography}</p>
                </div>
            </div>
            
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Título</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Género</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        books.map((data,index) => {
                            return <tr key={index}>
                                        <td>{data.title}</td>
                                        <td>{data.description}</td>
                                        <td>{data.genre}</td>
                                    </tr>
                        })
                    }
                </tbody>
            </table>
        </>
    )
}

export default OnlyAuthor;