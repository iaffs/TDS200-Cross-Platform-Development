import { useSubscription } from "@apollo/client";
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonTitle, IonToolbar, IonFooter, IonGrid, IonRow, IonCol } from '@ionic/react';
import gql from "graphql-tag";
import { exitOutline, locationOutline, mailOutline, personOutline, addCircleOutline } from 'ionicons/icons';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import IPostList from '../models/IPostList';
import { auth } from '../utils/nhost';
import Topography from '../components/Topography';
import { renderToStaticMarkup } from "react-dom/server";
import styled from "styled-components";
import PostCardHome from "../components/PostCardHome";

// favicon fra https://phosphoricons.com/ og ikonet heter "path"


const GET_POSTS = gql`
  subscription {
    posts {
      id
      title
      description
      image_filename
      user {
        id
        display_name
      }
    }
  }
`;

const topographyString = encodeURIComponent(renderToStaticMarkup(<Topography />));

const Home = (props: any) => {
  let history = useHistory();

  const { loading, data, error } = useSubscription<IPostList>(GET_POSTS);
  console.log(data);
  console.log(loading);
  console.log(error);

  if (loading) {
    return <IonLabel>Laster...</IonLabel>
  }

  const clickLogin = () => {
    history.replace("/login");
  }

  const toProfile = () => {
    history.replace("/profile");
  }

  const logout = async () => {
    try {
      await auth.logout();
      history.replace("/login");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot={'start'}>
            {auth.isAuthenticated() &&
              <IonButton onClick={logout}>
                <IonIcon icon={exitOutline}></IonIcon>
              </IonButton>
            }
          </IonButtons>
          <IonTitle>HikeTrack</IonTitle>
          <IonButtons slot={'end'}>
            {
              (auth.isAuthenticated() === false) &&
              <IonButton onClick={clickLogin}>Login</IonButton>
            }
            {
              auth.isAuthenticated() &&
              <IonButton routerLink="/newpost">
                <IonIcon icon={addCircleOutline}></IonIcon>
              </IonButton>
            }
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContentStyled class="limited-size" fullscreen >
        {
          (auth.isAuthenticated() === true) &&
          data?.posts.map(post => (
            <Link style={{ textDecoration: 'none' }} key={post.id} to={{
              pathname: `/detail/${post.id}`,
              state: {
                post
              }
            }}>
              <PostCardHome {...post} />
            </Link>
          ))
        }
        {
          (auth.isAuthenticated() === false) &&
          data?.posts.map(post => (
            <PostCardHome {...post} key={post.id} />
          ))
        }
      </IonContentStyled>

      {
        (auth.isAuthenticated() === true) &&
        <IonFooter>
          <Navigation>
            <IonGrid fixed={true}>
              <Row>
                <IonCol>
                  <NavIcon icon={locationOutline} />
                </IonCol>
                <IonCol>
                  <NavIcon icon={mailOutline} />
                </IonCol>
                <IonCol>
                  <NavIcon onClick={toProfile} icon={personOutline} />
                </IonCol>
              </Row>
            </IonGrid>
          </Navigation>
        </IonFooter>
      }
    </IonPage>
  );
};

const IonContentStyled = styled(IonContent)`
  --background: none;
  background: url("data:image/svg+xml,${topographyString}") no-repeat fixed;
  background-size: cover;
  z-index: -999999;
`;

const Navigation = styled(IonToolbar)`
justify-content: space-around;
`;

const NavIcon = styled(IonIcon)`
font-size: 18px;
`;

const Row = styled(IonRow)`
text-align: center;
`;


export default Home;
