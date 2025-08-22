import { getMatchHistoryByPuuid } from "../../services/riotApi";

export default async function handler(req, res) {
  const { puuid, count } = req.query;

  if (!puuid || typeof puuid !== "string") {
    return res.status(400).json({ error: "O PUUID é obrigatório." });
  }

  try {
    // O parâmetro 'count' é opcional e será undefined se não for passado,
    // a função de serviço usará o valor padrão.
    const matchIds = await getMatchHistoryByPuuid(puuid, count);
    res.status(200).json(matchIds);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Erro interno do servidor";
    res.status(statusCode).json({ error: message });
  }
}
