const GetOnlyBook = async (data) =>{
    const url = `http://localhost:5000/getBookById`
    const options = {
        method: 'POST',
        headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
        body: JSON.stringify(data)
    };
    let response = await fetch(url,options)
    let res = await response.json()
    if(response.status === 500){
        throw new Error(res.error);
    }
    return res
}

const GetAllBooks = async () =>{
    const url = `http://localhost:5000/getAllBooks`
    const options = {
        method: 'GET',
        headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}
    }
    let response = await fetch(url,options)
    let res = await response.json()
    if(response.status === 500){
        throw new Error(res.error);
    }
    return res
}

const AddReview = async (data) =>{
    const url = `http://localhost:5000/addReview`
    const options = {
        method: 'POST',
        headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
        body: JSON.stringify(data)
    }
    let response = await fetch(url,options)
    let res = await response.json()
    if(response.status === 500){
        throw new Error(res.error);
    }
    return res
}

const GetUser = async (data) =>{
    const url = `http://localhost:5000/getUserById`
    const options = {
        method: 'POST',
        headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
        body: JSON.stringify(data)
    }
    let response = await fetch(url,options)
    let res = await response.json()
    if(response.status === 500){
        throw new Error(res.error);
    }
    return res
}

const GetGenres = async () =>{
    const url = `http://localhost:5000/getAllGenres`
    const options = {
        method: 'GET',
        headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}
    }
    let response = await fetch(url,options)
    let res = await response.json()
    if(response.status === 500){
        throw new Error(res.error);
    }
    return res
}

const GetGenresBook = async (data) =>{
    const url = `http://localhost:5000/getGenreBooks`
    const options = {
        method: 'POST',
        headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
        body: JSON.stringify(data)
    }
    let response = await fetch(url,options)
    let res = await response.json()
    if(response.status === 500){
        throw new Error(res.error);
    }
    return res
}

export default { GetAllBooks, GetOnlyBook, AddReview, GetUser, GetGenres, GetGenresBook};