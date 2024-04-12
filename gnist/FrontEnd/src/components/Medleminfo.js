import React from 'react';
import EndretMedlemsPoen from './EndretMedlemsPoen';
import LeggTilEkstraInfoOmMedlem from './LeggTilEkstraInfoOmMedlem';
import EndeligGodkjenning from './EndeligGodkjenning';
import MedlemsNivaer from './MedlemsNivaer';
import Forslag from './Forslag';
import LastOppBevis from './LastOppBevis';
import EkstraInfoOmMedlem from './EkstraInfoOmMedlem';
import './Medleminfo.css';

function Medleminfo() {
    return (
        <div className="medleminfo-grid-container">
            <div className="component-container">
                <EndeligGodkjenning />
            </div>
            <div className="component-container">
                <MedlemsNivaer />
            </div>
            <div className="component-container">
                <Forslag />
            </div>
            <div className="component-container">
                <LastOppBevis />
            </div>
            <div className="component-container">
                <EkstraInfoOmMedlem />
            </div>
            <div className="component-container">
                <EndretMedlemsPoen />
            </div>
            <div className="component-container">
                <LeggTilEkstraInfoOmMedlem />
            </div>
        </div>
    );
}

export default Medleminfo;
