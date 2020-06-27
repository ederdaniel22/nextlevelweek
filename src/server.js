const express = require("express")
const server = express()

//configurar caminhos da aplicação

// configurar pasta public
server.use(express.static("public"))

//habilitar o uso do req.body

server.use(express.urlencoded({ extended: true }))

//Importar banco de dados db
const db = require("./database/db")

//utilizando nunjucks, template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

server.get("/", (req, res) => {
    return res.render("index.html", { title: "Deus está comigo" })
})

//return res.send("Ok")
//req.body: O corpo do nosso formulário
//console.log(req.body)
//inserir dados no banco de dados
//2 - Inserir dados da tabelas

//req.query recebe as informações colhidas no formulário de cadastramento
server.get("/create-point", (req, res) => {
    console.log(req.query)
    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    const query =
        `
        INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            return console.log(err)
        }
        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved: true })
    }
    db.run(query, values, afterInsertData)


})

server.get("/search", (req, res) => {
    const search = req.query.search
    if (search == "") {
        //mostrar a página html com os dados do banco de bados
        return res.render("search-results.html", { total: 0 })
    }
    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if (err) {
            return console.log(err)
        }

        const total = rows.length
            //console.log(" Aqui estão seus registros: ")
            //console.log(rows)
            //mostrar a página html com os dados do banco de bados
        return res.render("search-results.html", { places: rows, total })
    })

})

//ligar o servidor local e abrir a porta
server.listen(3000)