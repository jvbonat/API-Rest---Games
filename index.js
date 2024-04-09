
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('public'));
const cors = require('cors');
const { error } = require('console');
app.use(cors());
const jwt = require('jsonwebtoken');
const JWTSecret = "202099";

let DB = {
    games : [

        {
            id:23,
            title:'Call of Duty MW',
            year:2019,
            price:60
        },

        {
            id:65,
            title:'Sea of Thieves',
            year:2018,
            price:40
        },

        {
            id:2,
            title:'Minecraft',
            year:2012,
            price:20
        }

    ],
    users : [
        {id:1,nome:'João Victor',email:'jj@gmail.com',password:'12345'},
        {id:2,nome:'Guilherme',email:'gg@gmail.com',password:'12345'}
    ]
};

function auth(req,res,next) {
    const authToken = req.headers['authorization'];
    if(authToken) {
        const bearer = authToken.split(' ');
        const token = bearer[1];
        console.log(token);
        jwt.verify(token,JWTSecret,(err,data)=>{
            if(err) {
                res.status(401);
                res.json({err:'Token Inválido'});
            } else {
                req.token = token;
                req.loggedUser = {
                    id : data.id,
                    email : data.email
                };
                next();
            }
        });
    } else {
        res.status(401);
        res.json({err:'Token Inválido'});
    }
}


app.get("/games",auth,(req,res)=>{
    res.statusCode = 200;
    res.json(DB.games);
});


app.get("/game/:id",auth,(req,res)=>{
    let id = req.params.id;
    if(isNaN(id)) {
        res.sendStatus(400);
    } else {
        id = Number(req.params.id);
        const game = DB.games.find(game => game.id === id);
        if (game) {
            res.json(game);
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    }
});

//ROTA PARA CRIAÇÃO DE GAMES;
app.post("/game",auth,(req,res)=>{
    const { title, price, year} = req.body;
    if(!title || !price || !year) {
        res.sendStatus(400);
    }
    else if (isNaN(price) || isNaN(year)) {
        res.sendStatus(400);
    }
    else if (typeof(title) !== 'string') {
        res.sendStatus(400);
    }
    DB.games.push({id:2323, price:price, year:year,title:title});
    res.sendStatus(200);
});


//ROTA PARA DELEÇÃO DE UM GAME => ROTAS PODEM TER O MESMO NOME DESDE QUE O VERBO HTTP SEJA DIFERENTE
app.delete("/game/:id",auth,(req,res)=>{
    if(isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        const id = parseInt(req.params.id);
        console.log(id);
        const index = DB.games.findIndex(game => game.id === id);
        console.log(index);
        if (index === -1) {
            res.sendStatus(400);
        } else {
            DB.games.splice(index,1);
            res.sendStatus(200);
        }
    }
});

//ROTA DE EDIÇÃO DE UM GAME
app.put("/game/:id",auth,(req,res)=>{
    let id = req.params.id;
    if(isNaN(id)) {
        res.sendStatus(400);
    } else {
        id = Number(req.params.id);
        const game = DB.games.find(game => game.id === id);
        if (game) {
            const { title, price, year} = req.body;
            if (title) {
                game.title = title;
            }
            if (price) {
                game.price = price;
            }
            if (year) {
                game.year = year;
            }
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    }
});

//ROTA DE AUTENTICAÇÃO
app.post("/auth",(req,res)=>{
    const { email , password } = req.body;
    if(email) {
        const user = DB.users.find(user => user.email === email);
        if (!user) {
            res.status(404);
            res.json({err:'O e-mail enviado não existe na base de dados'});
        } else {
            if (user.password === password) {
                jwt.sign({id:user.id,email:user.email},JWTSecret,{expiresIn:'24h'},(error,token)=>{
                    if(error) {
                        res.status(400);
                        res.json({error:'Falha Interna'});
                    } else {
                        res.status(200);
                        res.json({token:token});
                    }
                });
            } else {
                res.status(401);
                res.json({error:'Credenciais inválidas'});
            }
        }
    } else {
        res.status(400);
        res.json({err:"O e-mail enviado é inválido!"});
    }
});

app.listen(2525,()=>{
    console.log('Aplicação rodando na porta 2525');
});


