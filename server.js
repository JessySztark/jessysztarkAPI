import express, { json } from "express"
import createPdf from "./generatePDFFile.js";
const app = express()

app.use(json())

app.use("/factures", express.static("factures"));

app.get("/", (request, response) => {
  response.statusCode = 200
  response.send({ message: "Mon premier JSON!" })
})

app.post("/blackvodsky", async (request, response) => {
  const data = request.body;
  console.log(data);
  const id = await createPdf(JSON.stringify(data)).catch(console.error);
  const filePath = `https://api.jessysztark.com/factures-image/${id}`;
  response.statusCode = 200
  response.send({ message: "Facture créée avec succès!", filePath: filePath })
})

app.listen(5003, () => {
  console.log(`Server Started at http://localhost:${5003}`)
})