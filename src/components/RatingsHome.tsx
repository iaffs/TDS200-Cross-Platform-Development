import React from "react";
import { IonRange, IonChip } from "@ionic/react";
import IRatings from "../models/IRatings";
import Rating from '@material-ui/lab/Rating';
import styled from "styled-components";

// Denne koden er min og material-ui sin, og er for å vise rating av turer
// Dessverre fikk jeg ikke tid til å få denne til å fungere som jeg ville,
// og ratingen er derfor satt i databasen manuelt. Se Ratings.tsx

// postcard -> ratings -> onRatingChange -> postcard
const RatingsHome = ({ onRatingChange, rating }: IRatings) => {

    // code borrowed from https://material-ui.com/components/rating/#rating
  return (
    <Stars>
        <Rating
          name="read-only"
          classes={{ label: 'my-class-name' }}
          size="small"
          value={rating as number}
          readOnly
          />
    </Stars>
  );
}

const Stars = styled(IonChip)`
margin-left: 3em;
`;

export default RatingsHome;


