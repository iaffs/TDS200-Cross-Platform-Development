import { useMutation, useSubscription } from "@apollo/client";
import { IonBackButton, IonButton, IonButtons, IonCard, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import gql from "graphql-tag";
import { trashBinOutline } from "ionicons/icons";
import React, { useState } from "react";
import PostCard from "../components/PostCard";
import ICommentList from "../models/ICommentList";
import IPost from "../models/IPost";
import { auth } from "../utils/nhost";
import styled from "styled-components";
import { useHistory } from "react-router";
import { renderToStaticMarkup } from "react-dom/server";
import Topography from "../components/Topography";

const GET_COMMENTS = gql`
  subscription getCommentsByPostID($post_id: Int!) {
    posts_by_pk(id: $post_id) {
      comments {
        text
        user {
          display_name
        }
      }
    }
  } 
`;

const INSERT_COMMENT = gql`
  mutation InsertComment($comment: comments_insert_input!) {
    insert_comments_one(object: $comment) {
      user_id,
      post_id,
      text
    }
  }
`;

const INSERT_RATING = gql`
mutation giveRating($ratings: ratings_insert_input!) {
  insert_ratings_one(object: $ratings) {
    user_id,
    post_id,
    stars
  }
}
`;

const DELETE_POST = gql`
  mutation DeletePost($post_id: Int!) {
    delete_comments (
      where: {
        post_id: {
          _eq: $post_id
        }
      }
    ) {
      affected_rows
    }
    delete_posts_by_pk (
      id: $post_id
          ) { id }
  }
`;

const topographyString = encodeURIComponent(renderToStaticMarkup(<Topography />));

const Detail = (props: any) => {
  const post: IPost = props.location?.state?.post;

  let history = useHistory();

  const [comment, setComment] = useState<string>("");
  const [insertCommentMutation] = useMutation(INSERT_COMMENT);
  const [deletePostMutation] = useMutation(DELETE_POST);

  const { loading, data } = useSubscription<ICommentList>(GET_COMMENTS, {
    variables: {
      post_id: post?.id
    },
    fetchPolicy: "no-cache"
  });


  if (!post) {
    return <div></div>;
  }

  if (loading) {
    return <IonLabel>Laster kommentarer</IonLabel>
  }

  const insertComment = async () => {
    try {
      await insertCommentMutation({
        variables: {
          comment: {
            post_id: post?.id,
            user_id: auth.getClaim('x-hasura-user-id'),
            text: comment
          }
        }
      })
    } catch (exception) {
      console.error(exception);
    }
    setComment("");
    document.getElementById("comment-section")?.setAttribute("value", "");
  }

  const deletePost = async () => {
    try {
      await deletePostMutation({
        variables: {
          post_id: post.id
        }
      });
      history.goBack();
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Tilbake" defaultHref="/home" />
          </IonButtons>
          <IonTitle>Mer informasjon</IonTitle>
          {
            (auth.isAuthenticated() === true) &&
            post?.user?.id === auth.getClaim('x-hasura-user-id') &&
            <IonButtons slot="end">
              <IonButton onClick={deletePost}>
                <IonIcon color="danger" icon={trashBinOutline} />
              </IonButton>
            </IonButtons>
          }
        </IonToolbar>
      </IonHeader>
      <IonContentStyled>
        <PostCard {...post} />
        <IonCard>
          <IonList>
            {
              data?.posts_by_pk?.comments?.map((comment, i) => (
                <IonItem key={i}>
                  <Name>{comment?.user?.display_name}</Name>
                  <CommentContent>{comment?.text}</CommentContent>
                </IonItem>
              ))}
          </IonList>
        </IonCard>
        <IonCard>
          <IonItem lines="none">
            <IonTextarea placeholder="Kommentar" id="comment-section" onIonChange={(e: any) => setComment(e.target.value)} />
          </IonItem>
          <CommentButton expand="block" onClick={insertComment}>Post kommentar</CommentButton>
        </IonCard>
      </IonContentStyled>
    </IonPage>
  )
};

const CommentButton = styled(IonButton)`
  --color: #4a5852;
`;

// Topografi-bakgrunn lånt fra https://www.heropatterns.com/
const IonContentStyled = styled(IonContent)`
--background: none;
  background: url("data:image/svg+xml,${topographyString}") no-repeat fixed;
  background-size: cover;
  z-index: -999999;
`;

const Name = styled.h2`
font-size: 16px;
margin-right: 7px;
self-align: center;
margin-top: auto;
margin-bottom: auto;
`;

const CommentContent = styled.p`
font-size: 14px;
padding-left: 2px;
`;

export default Detail;