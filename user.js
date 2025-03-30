const BASE_URL = 'http://localhost:8000';

window.onload = async () => {
    await loadData();
};

const loadData = async () => {
    console.log('User page loaded');
    try {
        // 1. Load users from the API
        const response = await axios.get(`${BASE_URL}/user`);
        console.log(response.data);

        const userDOM = document.getElementById('user');
        let htmlData = '';

        // 2. Loop through each user and display in table rows
        for (let i = 0; i < response.data.length; i++) {
            let user = response.data[i];
            htmlData += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstname}</td>
                    <td>${user.lastname}</td>
                    <td>${user.age}</td>
                    <td>${user.gender}</td>
                    <td>${user.interests}</td>
                    <td>${user.description}</td>
                    <td>
                        <a href="index.html?id=${user.id}"><button>Edit</button></a>
                        <button class="delete" data-id="${user.id}">Delete</button>
                    </td>
                </tr>
            `;
        }

        userDOM.innerHTML = htmlData;

        // 3. Add event listener to delete buttons
        const deleteDOMs = document.getElementsByClassName('delete');
        for (let i = 0; i < deleteDOMs.length; i++) {
            deleteDOMs[i].addEventListener('click', async (event) => {
                const id = event.target.dataset.id;
                try {
                    await axios.delete(`${BASE_URL}/user/${id}`);
                    loadData(); // Reload data after deletion
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
            });
        }
    } catch (error) {
        console.error('Error loading users:', error);
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
        errorMessage.innerText = 'There was an error loading the users. Please try again later.';
    }
};
