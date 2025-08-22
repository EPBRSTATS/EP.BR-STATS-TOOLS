// A chave de API NUNCA deve estar no código.
// Ela é lida do arquivo .env.local no servidor.
const RIOT_API_KEY = process.env.RIOT_API_KEY;
const API_BASE_URL_ACCOUNT = "https://americas.api.riotgames.com";
const API_BASE_URL_PLATFORM = "https://br1.api.riotgames.com";

// Headers padrão para todas as requisições
const defaultHeaders = {
  "X-Riot-Token": RIOT_API_KEY,
};

/**
 * Função genérica para fazer requisições à API da Riot.
 * Trata erros comuns e logging.
 */
async function fetchRiotAPI(url) {
  const response = await fetch(url, { headers: defaultHeaders });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData?.status?.message ||
      `Erro na API da Riot: ${response.status} ${response.statusText}`;
    console.error(
      `[Riot API Error] URL: ${url}, Status: ${response.status}, Message: ${errorMessage}`
    );
    const error = new Error(errorMessage);
    error.statusCode = response.status;
    throw error;
  }

  return response.json();
}

// Busca dados da conta pelo nome e tag para obter o PUUID
export async function getAccountByRiotId(gameName, tagLine) {
  const url = `${API_BASE_URL_ACCOUNT}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
  return fetchRiotAPI(url);
}

// Busca dados do invocador (nível, ícone, ID encriptado) usando o PUUID
export async function getSummonerByPuuid(puuid) {
  const url = `${API_BASE_URL_PLATFORM}/lol/summoner/v4/summoners/by-puuid/${puuid}`;
  return fetchRiotAPI(url);
}

// Busca os dados de ranqueada pelo summonerId encriptado
export async function getLeagueEntriesBySummonerId(encryptedSummonerId) {
  const url = `${API_BASE_URL_PLATFORM}/lol/league/v4/entries/by-summoner/${encryptedSummonerId}`;
  return fetchRiotAPI(url);
}

// Busca o histórico de IDs de partidas pelo PUUID
export async function getMatchIdsByPuuid(puuid, count = 10) {
  const url = `${API_BASE_URL_ACCOUNT}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`;
  return fetchRiotAPI(url);
}

// Busca os detalhes de uma partida específica pelo seu ID
export async function getMatchDetailsById(matchId) {
  const url = `${API_BASE_URL_ACCOUNT}/lol/match/v5/matches/${matchId}`;
  return fetchRiotAPI(url);
}
