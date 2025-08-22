import {
  getLeagueEntriesBySummonerId,
  getMatchIdsByPuuid,
  getMatchDetailsById,
} from "../../services/riotApi";

export default async function handler(req, res) {
  const { puuid, summonerId } = req.query;

  if (!puuid || !summonerId) {
    return res
      .status(400)
      .json({ error: "PUUID e ID do invocador são obrigatórios." });
  }

  try {
    // 1. Buscar dados de ranqueada e histórico de partidas em paralelo
    const [rankData, matchIds] = await Promise.all([
      getLeagueEntriesBySummonerId(summonerId),
      getMatchIdsByPuuid(puuid, 10),
    ]);

    // 2. Buscar detalhes de cada partida em paralelo
    const matchDetailsPromises = matchIds.map((matchId) =>
      getMatchDetailsById(matchId).catch(() => null)
    );
    const matches = (await Promise.all(matchDetailsPromises)).filter(Boolean);

    // 3. Processar os dados recebidos para o formato que o frontend espera
    const processedRankData = {
      solo: { tier: "UNRANKED", rank: "", wins: 0, losses: 0 },
      flex: { tier: "UNRANKED", rank: "", wins: 0, losses: 0 },
    };
    rankData.forEach((queue) => {
      if (queue.queueType === "RANKED_SOLO_5x5") {
        processedRankData.solo = { ...queue };
      } else if (queue.queueType === "RANKED_FLEX_SR") {
        processedRankData.flex = { ...queue };
      }
    });

    const championStatsMap = new Map();
    matches.forEach((match) => {
      const p = match.info.participants.find((p) => p.puuid === puuid);
      if (!p) return;
      const { championName, win } = p;
      const stats = championStatsMap.get(championName) || {
        games: 0,
        wins: 0,
        losses: 0,
        championName,
        championImage: `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${championName}.png`,
      };
      stats.games++;
      if (win) stats.wins++;
      else stats.losses++;
      championStatsMap.set(championName, stats);
    });

    const championStats = Array.from(championStatsMap.values())
      .map((stats) => ({
        ...stats,
        winrate:
          stats.games > 0 ? Math.round((stats.wins / stats.games) * 100) : 0,
      }))
      .sort((a, b) => b.games - a.games);

    res
      .status(200)
      .json({ rankData: processedRankData, matches, championStats });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Erro interno do servidor";
    res.status(statusCode).json({ error: message });
  }
}
