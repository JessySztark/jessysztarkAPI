import express, { json } from "express"
import createPdf from "./generatePDFFile.js";
import { checkPassword, changePassword } from "./passwordManagement.js";

import createSignature from "./createSignature.js";

import  createPoudrierePdf from "./generatePDFFilePoudriere.js";

const app = express()

app.use(json())

app.use("/assets", express.static("assets"));
app.use("/factures-image", express.static("factures-image"));
app.use("/factures-pdf", express.static("factures-pdf"));

app.use("/factures-poudriere-image", express.static("factures-poudriere-image"));
app.use("/factures-poudriere-pdf", express.static("factures-poudriere-pdf"));

app.get("/", (request, response) => {
  response.statusCode = 200
  response.send({ message: "Vous n'avez rien à faire ici !" })
})

app.post("/blackvodsky", async (request, response) => {
  const data = request.body;
  const id = await createPdf(JSON.stringify(data)).catch(console.error);
  const filePath = `/factures-image/${id}`;
  response.statusCode = 200
  response.send({ message: "Facture créée avec succès!", filePath: filePath })
})

app.post("/poudriere", async (request, response) => {
  const data = request.body;
  const id = await createPoudrierePdf(JSON.stringify(data)).catch(console.error);
  const filePath = `/factures-poudriere-image/${id}`;
  response.statusCode = 200
  response.send({ message: "Facture créée avec succès!", filePath: filePath })
})

app.post("/poudriere/signature", async (request, response) => {
  const data = request.body;
  console.error("Données reçues pour la création de signature : ", data.file);
  const fileBytes = data.file;
  const employee = data.employee;
  const answer = await createSignature(fileBytes, employee).catch(console.error);
  response.statusCode = 200
  response.send({ message: `Signature créée avec succès! ${answer}` })
})

app.post("/blackwater/check", async (request, response) => {
  const data = request.body;
  const checkPwd = await checkPassword(data.password);
  if (!checkPwd) {
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
  await changePassword(data.password);
  response.statusCode = 200;
  response.send({ message: "Mot de passe modifié avec succès!" });
});

app.listen(5003, () => {
  console.log(`Server Started at http://localhost:${5003}`)
})
