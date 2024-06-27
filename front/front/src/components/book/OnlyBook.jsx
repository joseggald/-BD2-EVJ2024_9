import { RiBookletFill } from "react-icons/ri";
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoStarOutline } from "react-icons/io5";
import peticiones from '../../helper/BookHelper';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const OnlyBook = ({setViewType,bookId}) => {
    const [comment, setComment] = useState('');
    const [reviews,setReviews] = useState([]);
    const [autor,setAutor] = useState({});
    const [book,setBook] = useState({});
    const [rate,setRate] = useState(0);
    const [user,setUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId){
            navigate('/login');
        }
        setUser(userId)
        getBooks()
    }, []);

    const getBooks = async () =>{
        try {
            const ressponse = await peticiones.GetOnlyBook({id:bookId})
            setBook(ressponse.book[0])
            setAutor(ressponse.author[0])
            let reviews = []
            for (let i = 0; i < ressponse.reviews.length; i++) {
                reviews.push(
                    {
                        'user_uid' : await peticiones.GetUser({id:ressponse.reviews[i].user_uid}),
                        'content': ressponse.reviews[i].content,
                        'rating': ressponse.reviews[i].rating
                    }
                )
            }
            setReviews(reviews)
        } catch (error) {
            setViewType('all')
            alert("Error al obtener datos de libro: ", error)
        }
    }

    const returnBooks = () => {
        setViewType('all');
    }

    const handleRate = (rate) => {
        setRate(rate)
    }

    const resetRate = () => {
        setRate(0)
    }

    const handleComment = (e) => {
        setComment(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (rate !== 0 && comment !== ''){
                let data = {
                    idBook:bookId,
                    idUser:user,
                    content:comment,
                    rating:rate
                }
                const {message} = await peticiones.AddReview(data)
                alert(message)
                setComment('')
                setRate(0)
                getBooks()
            }else{
                alert('No has seleccionado puntuación o ingresado un comentario')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div>
                <p>
                    <span onClick={returnBooks} className="cursor_pinter">Libros</span> <FaLongArrowAltRight /> {book.genre} <FaLongArrowAltRight /> {book.title}
                </p>
            </div>
            <div className="mb-4">
                <h2>{book.title}</h2>
            </div>
            <div className="d-flex align-items-center gap-3">
                <RiBookletFill size={300}/>
                <div>
                    <div className="mb-3">
                        <p className="mb-0"><strong>{book.rating}</strong></p>
                        <div>
                            <IoStarOutline className={`${book.rating !== 0 ? book.rating >= 1 ? 'c_yellow' : '' : ''}`} />
                            <IoStarOutline className={`${book.rating !== 0 ? book.rating >= 2 ? 'c_yellow' : '' : ''}`}/>
                            <IoStarOutline className={`${book.rating !== 0 ? book.rating >= 3 ? 'c_yellow' : '' : ''}`}/>
                            <IoStarOutline className={`${book.rating !== 0 ? book.rating >= 4 ? 'c_yellow' : '' : ''}`}/>
                            <IoStarOutline className={`${book.rating !== 0 ? book.rating >= 5 ? 'c_yellow' : '' : ''}`}/>
                        </div>
                    </div>
                    <p><strong>Autor: </strong>{`${autor.first_name} ${autor.last_name}`}</p>
                    <p><strong>Genero: </strong>{book.genre}</p>
                    <p><strong>Descripción: </strong>{book.description}</p>
                    <p><strong>Disponibilidad: </strong>{book.stock}</p>
                    <p><strong>Precio: </strong>{book.price}</p>
                </div>
            </div>
            <section className="mt-4">
                <h2>Reseñas</h2>
                <form className="mb-5" onSubmit={handleSubmit}>
                    <div className="form-control">
                        <IoStarOutline onClick={(num) => handleRate(1)} className={`${rate !== 0 ? rate >= 1 ? 'c_yellow' : '' : ''}`} />
                        <IoStarOutline onClick={(num) => handleRate(2)} className={`${rate !== 0 ? rate >= 2 ? 'c_yellow' : '' : ''}`}/>
                        <IoStarOutline onClick={(num) => handleRate(3)} className={`${rate !== 0 ? rate >= 3 ? 'c_yellow' : '' : ''}`}/>
                        <IoStarOutline onClick={(num) => handleRate(4)} className={`${rate !== 0 ? rate >= 4 ? 'c_yellow' : '' : ''}`}/>
                        <IoStarOutline onClick={(num) => handleRate(5)} className={`${rate !== 0 ? rate >= 5 ? 'c_yellow' : '' : ''}`}/>
                        <p onClick={resetRate} className="cursor_pinter">Borrar</p>
                    </div>
                    <div className="form-floating w-100">
                        <textarea onChange={handleComment} className="form-control" placeholder="Leave a comment here" id="titleReseña" value={comment}></textarea>
                        <label htmlFor="titleReseña">Comentario</label>
                    </div>
                    <button className="btn btn-dark">Comentar</button>
                </form>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Usuario</th>
                            <th scope="col">Comentario</th>
                            <th scope="col">Puntuación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            reviews.map((data,index) => {
                                return <tr key={index}>
                                            <td>{`${data.user_uid[0].first_name} ${data.user_uid[0].last_name}`}</td>
                                            <td>{data.content}</td>
                                            <td>
                                                <IoStarOutline className={`${data.rating !== 0 ? data.rating >= 1 ? 'c_yellow' : '' : ''}`} />
                                                <IoStarOutline className={`${data.rating !== 0 ? data.rating >= 2 ? 'c_yellow' : '' : ''}`}/>
                                                <IoStarOutline className={`${data.rating !== 0 ? data.rating >= 3 ? 'c_yellow' : '' : ''}`}/>
                                                <IoStarOutline className={`${data.rating !== 0 ? data.rating >= 4 ? 'c_yellow' : '' : ''}`}/>
                                                <IoStarOutline className={`${data.rating !== 0 ? data.rating >= 5 ? 'c_yellow' : '' : ''}`}/>
                                            </td>
                                        </tr>
                            })
                        }
                    </tbody>
                </table>
            </section>

        </>
    )
}

export default OnlyBook;