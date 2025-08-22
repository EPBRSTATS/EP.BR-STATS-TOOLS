import React from "react";
import styles from "./RankCard.module.css";

const RankCard = ({ title, rankInfo }) => {
  // As imagens dos elos precisam estar na pasta /public/tiers/
  // Mapeamento dos nomes em inglês (da API) para os nomes dos seus arquivos em português.
  // Verifique se os nomes dos seus arquivos correspondem exatamente a estes (ex: 'grao-mestre.png').
  const tierMap = {
    iron: "ferro",
    bronze: "bronze",
    silver: "prata",
    gold: "ouro",
    platinum: "platina",
    emerald: "esmeralda",
    diamond: "diamante",
    master: "mestre",
    grandmaster: "grao-mestre",
    challenger: "desafiante",
  };
  const tierInLowerCase = rankInfo.tier
    ? rankInfo.tier.toLowerCase()
    : "unranked";
  const fileName = tierMap[tierInLowerCase] || "unranked"; // Usa 'unranked' como padrão se não encontrar
  const tierImage = `/tiers/${fileName}.png`;
  const winrate =
    rankInfo.wins + rankInfo.losses > 0
      ? Math.round((rankInfo.wins / (rankInfo.wins + rankInfo.losses)) * 100)
      : 0;
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <img src={tierImage} alt={rankInfo.tier} className={styles.tierImage} />
      <p className={styles.rankText}>
        {rankInfo.tier} {rankInfo.rank}
      </p>
      <p className={styles.statsText}>
        {rankInfo.wins}V / {rankInfo.losses}D
      </p>
      <p className={styles.statsText}>Winrate: {winrate}%</p>
    </div>
  );
};

export default RankCard;
