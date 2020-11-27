import React from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonBackButton, IonFooter, IonGrid, IonCol, IonRow, IonCard, IonCardContent, IonCardTitle, IonCardHeader } from '@ionic/react';
import { renderToStaticMarkup } from 'react-dom/server';
import Topography from '../components/Topography';
import styled from 'styled-components';
import { locationOutline, mailOutline, personOutline } from 'ionicons/icons';
import IPost from '../models/IPost';


// Bilde fra denne siden er lånt fra unsplash
// Denne siden er den jeg er mest trist for at jeg ikke rakk å ferdigstille
// https://unsplash.com/photos/QXevDflbl8A

const topographyString = encodeURIComponent(renderToStaticMarkup(<Topography />));

const Profile = ({ user }: IPost) => {

  console.log(user);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot={'start'}>
            <IonButton>
              <IonBackButton text="Tilbake" defaultHref="/home"></IonBackButton>
            </IonButton>
          </IonButtons>
          <IonTitle>HikeTrack</IonTitle>
          <IonButtons slot={'end'}>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContentStyled>
        <IonGrid>
          <IonCard>
            <IonRow>
              <IonCol>
                <IonCardHeader>
                  <Title>Dynamisk Brukernavn</Title>
                </IonCardHeader>
                <IonCardContent>
                  Her skal det egentlig stå masse om profilinnehaver.
                </IonCardContent>
              </IonCol>
              <IonCol>
                <Image src="assets/profilepic.jpg" alt="profile picture og a woman"/>
              </IonCol>
            </IonRow>
          </IonCard>

          <IonCol>
            <Card>
              <IonCardHeader>
                <Title>
                  Dynamisk Turnavn
                  </Title>
              </IonCardHeader>
              <Text>
                Her skal det stå masse om en tur profilinnehaver har deltatt på,
                samt score vedkommende har gitt til turen.
                Her skal det stå masse om en tur profilinnehaver har deltatt på,
                samt score vedkommende har gitt til turen.
                </Text>
            </Card>
          </IonCol>

          <IonCol>
            <Card>
              <IonCardHeader>
                <Title>
                  Dynamisk Turnavn
                  </Title>
              </IonCardHeader>
              <Text>
                Her skal det stå masse om en tur profilinnehaver har deltatt på,
                samt score vedkommende har gitt til turen.
                Her skal det stå masse om en tur profilinnehaver har deltatt på,
                samt score vedkommende har gitt til turen.
                </Text>
            </Card>
          </IonCol>

          <IonCol>
            <Card>
              <IonCardHeader>
                <Title>
                  Dynamisk Turnavn
                  </Title>
              </IonCardHeader>
              <Text>
                Her skal det stå masse om en tur profilinnehaver har deltatt på,
                samt score vedkommende har gitt til turen.
                Her skal det stå masse om en tur profilinnehaver har deltatt på,
                samt score vedkommende har gitt til turen.
                </Text>
            </Card>
          </IonCol>
        </IonGrid>
      </IonContentStyled>

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
                <NavIcon icon={personOutline} />
              </IonCol>
            </Row>
          </IonGrid>
        </Navigation>
      </IonFooter>
    </IonPage>
  )
}

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

const Title = styled(IonCardTitle)`
font-size: 16px;
--ion-text-color: #dbe5e1;
`;

const Text = styled(IonCardContent)`
font-size: 14px;
--ion-text-color: #dbe5e1;
`;

const Card = styled(IonCard)`
margin-top: 1%;
margin-bottom: 1%;
`;

const Image = styled.img`
border-radius: 8px;
`;


export default Profile;