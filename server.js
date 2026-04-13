import express, { json } from "express"
import createPdf from "./generatePDFFile.js";
const app = express()

app.use(json())

app.use("/assets", express.static("assets"));
app.use("/factures-image", express.static("factures-image"));
app.use("/factures-pdf", express.static("factures-pdf"));

app.get("/", (request, response) => {
  response.statusCode = 200
  response.send({ message: "Mon premier JSON!" })
})

app.post("/blackvodsky", async (request, response) => {
  const data = request.body;
  const id = await createPdf(JSON.stringify(data)).catch(console.error);
  const filePath = `/factures-image/${id}`;
  response.statusCode = 200
  response.send({ message: "Facture créée avec succès!", filePath: filePath })
})

app.post("/blackwater/check", async (request, response) => {
  const data = request.body;
  const checkPassword = checkPassword(data.password);
  if (!checkPassword) {
    response.statusCode = 400;
    response.send({ message: "Mot de passe invalide." });
    return;
  }
  else {
    response.statusCode = 200;
    response.send({ message: "Mot de passe valide!" });
  }
});

app.post("/blackwater/change", async (request, response) => {
  const data = request.body;
  const changePasswordResult = changePassword(data.password);
  response.statusCode = 200;
  response.send({ message: "Mot de passe modifié avec succès!" });
});

app.listen(5003, () => {
  console.log(`Server Started at http://localhost:${5003}`)
})
