import { IonCard, IonContent, IonFabButton, IonIcon, IonInput, IonItem, IonList, IonPage, IonSpinner, IonToast, useIonViewWillEnter, IonButtons } from "@ionic/react";
import { arrowForwardCircle, personAddOutline } from "ionicons/icons";
import React, { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Topography from "../components/Topography";
import { auth } from "../utils/nhost";

const topographyString = encodeURIComponent(renderToStaticMarkup(<Topography />));

const Login: React.FC = () => {
  let history = useHistory();
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [showErrorToast, setShowErrorToast] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    if (auth.isAuthenticated()) {
      history.replace("/home");
    }
  });

  const authenticateUser = async () => {
    setIsAuthenticating(true);
    try {
      await auth.login(emailAddress, password);
      setIsAuthenticating(false);
      history.replace("/home");
    } catch (exception) {
      console.error(exception);
      setIsAuthenticating(false);
      setShowErrorToast(true);
    }
  }

  const toRegister = () => {
    history.replace("/register")
  }

  const isGuest = async () => {
    history.replace("/home");
  }

  return (
    <IonPage>
      <IonContentStyled>
        <CenterContainer>
          <PageTitle>HikeTrack</PageTitle>
          <LoginCard>
            <IonList>
              <IonItem>
                <IonInput placeholder="Epostadresse" onIonInput={(e: any) => setEmailAddress(e.target.value)} />
              </IonItem>
              <IonItem>
                <IonInput placeholder="Passord" type="password" onIonInput={(e: any) => setPassword(e.target.value)} />
              </IonItem>
            </IonList>
          </LoginCard>
          <Buttons>
          <LoginButton onClick={authenticateUser}>
            {
              isAuthenticating ?
                <IonSpinner name="crescent" /> :
                <IonIcon icon={arrowForwardCircle} />
            }
          </LoginButton>
          <RegisterButton onClick={toRegister}>
            <IonIcon icon={personAddOutline} />
          </RegisterButton>
          <GuestButton onClick={isGuest}>Gjest</GuestButton>
          </Buttons>
        </CenterContainer>
        <IonToast
          isOpen={showErrorToast}
          onDidDismiss={() => setShowErrorToast(false)}
          message="Feil brukernavn/passord."
          duration={3000}
          color="warning"
        />
      </IonContentStyled>
    </IonPage>
  );
};

const LoginCard = styled(IonCard)`
  padding: 20px;
`; 

const IonContentStyled = styled(IonContent)`
  --background: none;
  background: url("data:image/svg+xml,${topographyString}") no-repeat fixed;
  background-size: cover;
`;

const PageTitle = styled.h1`
  font-size: 3em;
  align-self: center;
  color: #4a5852;
  font-family: 'Quicksand', sans-serif;
`;

const Buttons = styled(IonButtons)`
  flex-direction: row;
  justify-content: center;
`;

const LoginButton = styled(IonFabButton)`
  --background: #4a5852;
  align-self: center;
  margin: 1.2vw;
  `;

const RegisterButton = styled(IonFabButton)`
--background: #4a5852;
align-self: center;
margin: 1.2vw;
`;

const GuestButton = styled(IonFabButton)`
--background: #4a5852;
align-self: center;
margin: 1.2vw;
`;

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;

export default Login;