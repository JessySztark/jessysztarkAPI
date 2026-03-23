import express, { json } from "express"

const app = express()

app.use(json())

app.get("/", (request, response) => {
  response.statusCode = 200
  response.send({ message: "Mon premier JSON!" })
})

app.post("/blackvodsky", (request, response) => {
  const data = request.body;
  console.log(data);
  response.statusCode = 200
  response.send({ message: "Données reçues avec succès!" })
})

app.listen(5003, () => {
  console.log(`Server Started at http://localhost:${5003}`)
})