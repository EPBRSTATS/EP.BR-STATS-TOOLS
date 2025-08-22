import React from "react";
import MatchHistoryItem from "./MatchHistoryItem";
import styles from "./MatchHistoryTab.module.css";

const MatchHistoryTab = ({ matches, summonerPuuid }) => {
  return (
    <div className={styles.container}>
      {matches.map((match) => (
        <MatchHistoryItem
          key={match.info.gameId}
          match={match}
          summonerPuuid={summonerPuuid}
        />
      ))}
    </div>
  );
};

export default MatchHistoryTab;
