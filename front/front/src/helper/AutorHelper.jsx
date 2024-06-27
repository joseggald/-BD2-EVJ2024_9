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
    return await response.json()
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
    return await response.json()
}

const DeleteAuthor = async (data) =>{
    const url = `http://localhost:5000/deleteAuthor`
    const options = {
        method: 'DELETE',
        headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
        body: JSON.stringify(data)
    };
    let response = await fetch(url,options)
    return await response.json()
}


export default { GetAllAuthors, GetOnlyAuthor, DeleteAuthor};