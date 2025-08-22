import React from "react";
import RankCard from "./RankCard";
import styles from "./OverviewTab.module.css";

const OverviewTab = ({ rankData, championStats }) => {
  return (
    <div>
      <h2 className={styles.title}>Ranqueadas</h2>
      <div className={styles.rankGrid}>
        <RankCard title="Solo/Duo" rankInfo={rankData.solo} />
        <RankCard title="Flex" rankInfo={rankData.flex} />
      </div>
      <h2 className={styles.title}>
        Campeões Mais Jogados (Últimas 10 partidas)
      </h2>
      {championStats.length > 0 ? (
        championStats.slice(0, 5).map((champ) => (
          <div key={champ.championName} className={styles.champCard}>
            <img
              src={champ.championImage}
              alt={champ.championName}
              className={styles.champImage}
            />
            <div className={styles.champInfo}>
              <p className={styles.champName}>{champ.championName}</p>
              <p className={styles.champGames}>
                {champ.wins}V {champ.losses}D ({champ.games} jogos)
              </p>
            </div>
            <div
              className={`${styles.champWinrate} ${
                champ.winrate >= 50 ? styles.winText : styles.lossText
              }`}
            >
              {champ.winrate}% WR
            </div>
          </div>
        ))
      ) : (
        <p>Nenhum dado de campeão disponível.</p>
      )}
    </div>
  );
};

export default OverviewTab;
