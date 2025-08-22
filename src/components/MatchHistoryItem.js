import React from "react";
import styles from "./MatchHistoryItem.module.css";

const MatchHistoryItem = ({ match, summonerPuuid }) => {
  const participant = match.info.participants.find(
    (p) => p.puuid === summonerPuuid
  );
  if (!participant) return null;

  const kda = `${participant.kills}/${participant.deaths}/${participant.assists}`;
  const gameMode = match.info.gameMode.replace("_", " ");
  const gameResult = participant.win ? "Vitória" : "Derrota";

  return (
    <div
      className={`${styles.card} ${participant.win ? styles.win : styles.loss}`}
    >
      <div className={styles.leftSection}>
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${participant.championName}.png`}
          alt={participant.championName}
          className={styles.championImage}
        />
        <div>
          <p className={styles.gameResult}>{gameResult}</p>
          <p className={styles.gameMode}>{gameMode}</p>
        </div>
      </div>
      <div className={styles.rightSection}>
        <p className={styles.kda}>{kda}</p>
        <p className={styles.kdaLabel}>KDA</p>
      </div>
    </div>
  );
};

export default MatchHistoryItem;
