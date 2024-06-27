import { RiBookletFill } from "react-icons/ri";
import peticiones from '../../helper/BookHelper';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllBooks = ({setViewType,setBookId}) => {
    const [allBooks,setAllBooks] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId){
            navigate('/login');
        }
        getBooks()
    }, []);

    const getBooks = async () =>{
        try {
            const gendersRes = await peticiones.GetGenres()
            let booksNew = []
            for (let i = 0; i < gendersRes.length; i++) {
                booksNew.push(
                    {
                        'genre':gendersRes[i].genre,
                        'books': await peticiones.GetGenresBook({
                            genre:gendersRes[i].genre
                        })
                    }
                )
            }
            //console.log(booksNew)
            //const ressponse = await peticiones.GetAllBooks()
            setAllBooks(booksNew)
        } catch (error) {
            console.log("Error al obtener libros: ", error)
        }
    }

    const viewBook = (id) =>{
        setBookId(id);
        setViewType('only');
    }

    return (
        <>
            <div className="mb-4 text-center">
                <h2>Catálogo de Libros</h2>
            </div>
            {allBooks.map((data,index) => {
                return  <section className="mb-5" key={index}>
                            <h2>{data.genre}</h2>
                            <div className="d-flex flex-wrap gap-3">
                                {
                                    data.books.map((bo,i) => {
                                        return <div className={`card w-card`} key={i}>
                                                    <RiBookletFill size={50} className="card-img-top"/>
                                                    <div className="card-body text-center">
                                                        <h5 className="card-title">{bo.title}</h5>
                                                        <p className={`card-text overflow-hidden line_clamp`}>{bo.description}</p>
                                                    </div>
                                                    <div className='d-flex gap-3 px-3 mb-3 justify-content-center'>
                                                        <button onClick={(id) => viewBook(bo._id)} type="button" className={`btn btn-dark`}>Ver</button>
                                                    </div>
                                                </div>
                                    })
                                }
                            </div>
                        </section>
            })}
        </>
    )
}

export default AllBooks;