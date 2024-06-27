const GetOnlyAuthor = async (data) =>{
    const url = `http://localhost:5000/getAuthor`
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

const GetAllAuthors = async () =>{
    const url = `http://localhost:5000/getAllAuthors`
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

const GetBooksAuthor = async (data) =>{
    const url = `http://localhost:5000/getBooksAuthor`
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


export default { GetAllAuthors, GetOnlyAuthor, GetBooksAuthor};