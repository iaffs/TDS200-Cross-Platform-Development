import React from "react";
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from "@ionic/react";
import IPost from "../models/IPost";
import gql from "graphql-tag";
import { useSubscription } from "@apollo/client";
import Ratings from "./Ratings";
import { auth } from "../utils/nhost";
import styled from "styled-components";

// Bildene som dukker opp i "cards" er lånt fra unsplash
// Store deler av koden i denne komponenten er fra forelesning og øvingsoppgaver

const GET_AVG_STARS = gql`
subscription avgRatingPost($post_id: Int!) {
  ratings_aggregate(where: {post_id: {_eq: $post_id}}) {
    aggregate {
      avg {
        stars
      }
    }
  }
}
`;

const PostCard = ({ id, title, description, user, image_filename }: IPost) => {

  const { loading, data, error } = useSubscription(GET_AVG_STARS, {
    variables: {
      post_id: id
    }
  });

  console.log(error);

  return (
    <IonCard>
      <img src={`https://backend-s6qgrkq2.nhost.app/storage/o/public/${image_filename}`} />
      <IonCardHeader>
        {
          auth.isAuthenticated() &&
          <Title>
            {user?.display_name}
            <Ratings
              rating={!loading && data?.ratings_aggregate.aggregate.avg.stars}
              onRatingChange={e => console.log(e)} ></Ratings> ratings
          </Title>
        }
        <IonCardTitle>
          {title}
        </IonCardTitle>
      </IonCardHeader>
      <Description>
        {description}
      </Description>
    </IonCard>
  )
};

const Description = styled(IonCardContent)`
color: #dbe5e1;
`;

const Title = styled(IonCardSubtitle)`
color: #dbe5e1;
`;


export default PostCard;

