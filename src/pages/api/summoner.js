import { getAccountByRiotId, getSummonerByPuuid } from "../../services/riotApi";

export default async function handler(req, res) {
  const { name: riotId } = req.query;

  if (!riotId || typeof riotId !== "string" || !riotId.includes("#")) {
    return res.status(400).json({
      error: "Formato inválido. Use: Nome#TAG (ex: O N#BR7)",
    });
  }

  const [gameName, tagLine] = riotId.split("#");

  try {
    // 1. Obter dados da conta (PUUID)
    const accountData = await getAccountByRiotId(gameName, tagLine);

    // 2. Obter dados do invocador (ID, nível, ícone)
    const summonerData = await getSummonerByPuuid(accountData.puuid);

    // 3. Combinar e retornar os dados necessários para o frontend
    res.status(200).json({
      puuid: accountData.puuid,
      id: summonerData.id, // ID encriptado do invocador
      name: `${accountData.gameName} #${accountData.tagLine}`,
      level: summonerData.summonerLevel,
      profileIconId: summonerData.profileIconId,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message =
      error.statusCode === 404
        ? "Invocador não encontrado"
        : error.message || "Erro interno do servidor";

    res.status(statusCode).json({ error: message });
  }
}
