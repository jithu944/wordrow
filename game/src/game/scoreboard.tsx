import React, { useEffect, useState } from "react";
import { Mode } from "../mode";
import { Language } from "../language";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as faSolid from '@fortawesome/free-solid-svg-icons'
import * as faRegular from '@fortawesome/free-regular-svg-icons'

import './scoreboard.scss';

export interface ScoreBoardProps {
    startTime: number;
    endTime: number;
    gameEnd: boolean;
    mode: Mode;
    language: Language;
    qualified: boolean;
    score: number;
    round: number | undefined;
    onTimeout: () => void;
};

const ScoreBoard = ({ startTime, endTime, gameEnd, mode, language, qualified, round, score, onTimeout }: ScoreBoardProps) => {
    const isTimed: boolean = mode === Mode.TIMED || mode === Mode.BLITZ;

    // --------------------------------------------------------------------------------------------
    // CLOCK TICKING AND FORMATTING
    const [currTime, setCurrTime] = useState(() => new Date().getTime());

    const formatTimer = () => {
        const timeLeft = endTime - currTime;
        if (timeLeft < 0) return "00:00:000";

        const millis = Math.floor(timeLeft % 1000);
        const seconds = Math.floor((timeLeft / 1000) % 60);
        const minutes = Math.floor((timeLeft / 1000) / 60);

        return `${minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })
            }:${seconds.toLocaleString(undefined, { minimumIntegerDigits: 2 })
            }:${millis.toLocaleString(undefined, { minimumIntegerDigits: 3 })
            }`;
    };

    const formatClock = () => {
        const timeSpent = Math.min(endTime, currTime) - startTime;

        const seconds = Math.floor((timeSpent / 1000) % 60);
        const minutes = Math.floor(((timeSpent / 1000) / 60) % 60);
        const hours   = Math.floor(timeSpent / 1000 / 60 / 60);

        return `${hours.toLocaleString(undefined, { minimumIntegerDigits: 2 })
            }:${minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })
            }:${seconds.toLocaleString(undefined, { minimumIntegerDigits: 2 })
            }`;
    };

    useEffect(() => {
        if (gameEnd) return;

        const tickRate = isTimed ? 50 : 1000;
        const timerId = setInterval(() => {
            const tick = new Date().getTime();
            setCurrTime(tick);
        }, tickRate);
        return () => clearInterval(timerId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameEnd]);

    useEffect(() => {
        if (!isTimed || gameEnd) return;

        const timeLeft = endTime - currTime;
        if (timeLeft < 0) onTimeout();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currTime]);

    const timeLeft = endTime - currTime;
    const timeAlarm: boolean = 0 < timeLeft && timeLeft < 10 * 1000;

    // --------------------------------------------------------------------------------------------
    // ROUND FORMATTING
    const displayRound = mode !== Mode.DAILY;
    const roundText = round?.toLocaleString(language);

    // --------------------------------------------------------------------------------------------
    // SCORE FORMATTING
    const displayScore = mode !== Mode.DAILY;
    const scoreText = Math.round(score).toLocaleString(language, { minimumIntegerDigits: 7 });

    // --------------------------------------------------------------------------------------------
    // VISUAL
    return (
        <div className="ScoreBoard">
            {isTimed &&
                <div className={`Time ${timeAlarm ? "Alarm" : ""}`}>{formatTimer()}</div>
            }
            {!isTimed &&
                <div className={"Time"}>{formatClock()}</div>
            }
            {displayRound &&
                <div className="RoundNumber">
                    <div className="Bar">|</div>
                    <FontAwesomeIcon icon={qualified ? faSolid.faFlag : faRegular.faFlag} flip={"horizontal"} />
                    {round && roundText}
                    <FontAwesomeIcon icon={qualified ? faSolid.faFlag : faRegular.faFlag} />
                    <div className="Bar">|</div>
                </div>
            }
            {displayScore && <div className="Score"> {scoreText} </div>}
        </div>
    );
}

export default ScoreBoard;
