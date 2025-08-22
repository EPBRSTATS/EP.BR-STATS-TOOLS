import { useState } from "react";
import Head from "next/head";
import React from "react"; // Necessário para JSX
import OverviewTab from "../components/OverviewTab";
import MatchHistoryTab from "../components/MatchHistoryTab";
import styles from "../components/Home.module.css";

export default function Home() {
  const [summonerName, setSummonerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summonerData, setSummonerData] = useState(null);
  const [error, setError] = useState(null);
  const [detailedStats, setDetailedStats] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!summonerName) return;

    setIsLoading(true);
    setError(null);
    setSummonerData(null);
    setDetailedStats(null);

    try {
      const response = await fetch(
        `/api/summoner?name=${encodeURIComponent(summonerName)}`
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erro na requisição");

      setSummonerData(data);
    } catch (err) {
      setError(err.message);
      console.error("Erro na busca:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async () => {
    if (!summonerData || !summonerData.puuid) return;
    setIsDetailsLoading(true);
    setError(null);
    try {
      // Agora passamos também o `id` do invocador, que é necessário para a API de ranqueadas
      const res = await fetch(
        `/api/full-stats?puuid=${summonerData.puuid}&summonerId=${summonerData.id}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao buscar detalhes");
      setDetailedStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>EP.BR - Estatísticas de LoL</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>EP.BR</h1>
        <p className={styles.subtitle}>Estatísticas de League of Legends</p>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={summonerName}
              onChange={(e) => setSummonerName(e.target.value)}
              placeholder="Exemplo: O N#BR7"
              className={styles.input}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? "Buscando..." : "Buscar"}
            </button>
          </div>
          <p className={styles.formHint}>
            Digite exatamente como aparece no jogo (com #TAG)
          </p>
        </form>

        {error && <div className={styles.errorBox}>{error}</div>}

        {isLoading && (
          <p className={styles.loadingText}>Buscando invocador...</p>
        )}

        {summonerData && !isLoading && (
          <div className={styles.summonerCard}>
            <div className={styles.summonerHeader}>
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${summonerData.profileIconId}.png`}
                alt={`Ícone de perfil de ${summonerData.name}`}
                className={styles.summonerIcon}
              />
              <div>
                <h2 className={styles.summonerName}>{summonerData.name}</h2>
                <p className={styles.summonerLevel}>
                  Nível {summonerData.level}
                </p>
              </div>
            </div>
            <button
              onClick={handleViewDetails}
              disabled={isDetailsLoading}
              className={styles.detailsButton}
            >
              {isDetailsLoading
                ? "Carregando..."
                : "Ver Estatísticas Completas"}
            </button>
          </div>
        )}

        {isDetailsLoading && (
          <p className={styles.detailsLoadingText}>
            Carregando estatísticas detalhadas...
          </p>
        )}

        {detailedStats && (
          <div className={styles.statsContainer}>
            <div className={styles.tabs}>
              <button
                onClick={() => setActiveTab("overview")}
                className={`${styles.tabButton} ${
                  activeTab === "overview" ? styles.tabButtonActive : ""
                }`}
              >
                Resumo
              </button>
              <button
                onClick={() => setActiveTab("matches")}
                className={`${styles.tabButton} ${
                  activeTab === "matches" ? styles.tabButtonActive : ""
                }`}
              >
                Histórico de Partidas
              </button>
            </div>
            {activeTab === "overview" && (
              <OverviewTab
                rankData={detailedStats.rankData}
                championStats={detailedStats.championStats}
              />
            )}
            {activeTab === "matches" && (
              <MatchHistoryTab
                matches={detailedStats.matches}
                summonerPuuid={summonerData.puuid}
              />
            )}
          </div>
        )}

        {!summonerData && !isLoading && !error && (
          <div className={styles.placeholderBox}>
            <p>Nenhum invocador pesquisado ainda.</p>
          </div>
        )}

        <div className={styles.footer}>
          <p>Dados fornecidos pela API da Riot Games</p>
          <p>EP.BR não é afiliado à Riot Games</p>
        </div>
      </main>
    </div>
  );
}
