import React from 'react';

import './css/ArcadeMachine.css'
import arcadeImage from '../assets/arcade-machine.png';

const ArcadeMachine = () => {

    return (
        <>
            <div>
                <img src={arcadeImage} className="arcadeMachine" alt="Arcade Machine" />
            </div>

            <div className="screen">
            <button type="button" class="btn">
                <strong className="">PLAY</strong>
                <div id="container-stars">
                    <div id="stars"></div>
                </div>

                <div id="glow">
                    <div class="circle"></div>
                    <div class="circle"></div>
                </div>
                </button>
            </div>

        </>
    )
}

export default ArcadeMachine;