const express = require("express")
const server = express()

//configurar caminhos da aplicação

// configurar pasta public
server.use(express.static("public"))

//utilizando nunjucks, template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

server.get("/", (req, res) => {
    return res.render("index.html", { title: "Deus está comigo" })
})

server.get("/create-point", (req, res) => {
    return res.render("create-point.html")
})

server.get("/search", (req, res) => {
    return res.render("search-results.html")
})

//ligar o servidor local e abrir a porta
server.listen(3000)