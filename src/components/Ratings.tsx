import React from "react";
import {  IonRange } from "@ionic/react";
import IRatings from "../models/IRatings";
import styled from "styled-components";

// Denne koden er min og Ionic sin, og er for å kunne vurdere turer
// Dessverre fikk jeg ikke tid til å få denne til å fungere som jeg ville.
// Jeg mangler å sende verdien til databasen og koble den mot brukerid

// postcard -> ratings -> onRatingChange -> postcard
const Ratings = ({ onRatingChange, rating }: IRatings) => {

  return (
    <Item>
      <Range
      min={1}
      max={5}
      step={1}
      pin={true}
      snaps={true}
      ticks={true}
      value={rating}
      color="primary"
      onIonChange={e => onRatingChange(e.detail.value as any)} />
    </Item>
  );
}

export default Ratings;

const Item = styled.div`
background-color: transparent;
`;

const Range = styled(IonRange)`
--bar-background: transparent;
--knob-size: 1.5vh;
--width: 5vw;
--padding: 0 !important;
--range-tick-height: 1em;
`;