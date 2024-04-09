
const axiosConfig = {
    headers : {
        Authorization : "Bearer " + localStorage.getItem('token')
    }
};

async function login() {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    return axios.post("http://localhost:2525/auth", { email, password }).then((response) => {
        if (response.status === 200) {
            const token = response.data.token;
            localStorage.setItem("token",token);
            axiosConfig.headers.Authorization = "Bearer " + localStorage.getItem('token');
            alert("Login Realizado com sucesso");
        }
    }).catch(error => {
        alert('Erro ao realizar login'+error);
    });
}


async function getGames() {
    const games = axios.get("http://localhost:2525/games",axiosConfig).then(response =>{
        console.log(response);
        return response.data;
    }).catch(error=>{
        alert('Não foi possível listar os jogos');
    });
    return games;
}

function deleteGame(li) {
    const id = li.getAttribute("data-id");
    return axios.delete('http://localhost:2525/game/'+id,axiosConfig).then(response=>{
        alert('Game deletado com sucesso');
    }).catch(error=>{
        alert('Não foi possível deletar o jogo');
    });
}

function loadForm(li) {
    const id = li.getAttribute("data-id");
    const title = li.getAttribute("data-title");
    const price = li.getAttribute("data-price");
    const year  = li.getAttribute("data-year");
    document.getElementById('idEdit').value = id;
    document.getElementById('titleEdit').value = title;
    document.getElementById('priceEdit').value = price;
    document.getElementById('yearEdit').value = year;
}

function updateGame () {
    const idInput = document.getElementById('idEdit').value;
    const title = document.getElementById('titleEdit').value
    const year = document.getElementById('yearEdit').value;
    const price = document.getElementById('priceEdit').value;
    const game = {
        title,
        year,
        price
    };
    return axios.put("http://localhost:2525/game/"+idInput,game).then(response =>{
        if(response.status === 200) {
            alert('Game atualizado');
            location.reload();
        }
    }).catch(error => {
        alert('Não foi possível atualizar o jogo');
    });
}


async function showGames () {
    const ul = document.querySelector('.games-list');
    const games = await getGames();
    games.forEach(game => {
        const li = document.createElement('li');
        li.setAttribute('data-id',game.id);
        li.setAttribute('data-title',game.title);
        li.setAttribute('data-year',game.year);
        li.setAttribute('data-price',game.price);
        li.className = 'form-control';
        const deleteBtn = document.createElement('button');
        deleteBtn.classList = 'btnEdit';
        deleteBtn.id = 'delete-btn';
        const editionBtn = document.createElement('button');
        editionBtn.classList = 'btnDelete';
        editionBtn.id = 'edition-btn';
        editionBtn.innerText = 'Editar';
        editionBtn.addEventListener('click',function(ev){
            loadForm(li);
        })
        deleteBtn.addEventListener('click',function(ev){
            deleteGame(li)
        });
        deleteBtn.innerText = 'Deletar';
        li.innerText = `${game.id} - ${game.title} - $${game.price} - ${game.year}`;
        li.appendChild(deleteBtn);
        li.appendChild(editionBtn);
        ul.appendChild(li);
    });
    return games;
}


async function createGame () {
    const title = document.querySelector('input[name="title"]').value;
    const year = document.querySelector('input[name="year"]').value;
    const price = document.querySelector('input[name="price"]').value;
    const game = {
        title,
        year,
        price
    };
    return axios.post("http://localhost:2525/game",game).then(response =>{
        if(response.status === 200) {
            alert('Game cadastrado');
            location.reload();
        }
    }).catch(error => {
        alert('Não foi possível cadastrar o jogo');
    });
}
showGames();