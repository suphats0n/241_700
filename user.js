const BASE_URL = 'http://localhost:8000'


window.onload = async () => {
    await loadData()
}

const loadData = async () => {
    console.log('user page loaded');
    const response = await axios.get(`${BASE_URL}/users`)
    console.log(response.data)
    const userDOM = document.getElementById('user')

    let htmlData = '<div>'
    for (let i = 0; i < response.data.lenght; i++ ) {
        let user = response.data[i]
        htmlData += `<div>
        ${user.id} ${user.firstname} ${user.lastname}
        <a href='html1.html?id=${user.id}'><button>Edit</button></a>
        <button class = 'delete' data-id='${user.id}'>Delete</button>
        </div>`
    }
    htmlData += '</div>'
    userDOM.innerHTML = htmlData

    const deleteDOMS = document.getElementsByClassName('delete')
    for (let i = 0; i < deleteDOMS.length; i++ ){
        deleteDOMS[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id
            try{
                await axios.delete(`${BASE_URL}/users/${id}`)
                loadData() 
            }catch (error){
                console.log('error',error)
            } 
        })
    }
}