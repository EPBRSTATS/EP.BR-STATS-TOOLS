import { getRankByPuuid } from "../../services/riotApi";

export default async function handler(req, res) {
  const { puuid } = req.query;

  if (!puuid || typeof puuid !== "string") {
    return res.status(400).json({ error: "O PUUID é obrigatório." });
  }

  try {
    const rankData = await getRankByPuuid(puuid);
    res.status(200).json(rankData);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Erro interno do servidor";
    res.status(statusCode).json({ error: message });
  }
}
