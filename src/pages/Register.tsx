import { useState } from "react";
import { auth } from "../utils/nhost";
import { IonPage, IonList, IonItem, IonInput, IonIcon, IonCard, IonButtons, IonContent, IonFabButton, IonHeader, IonToolbar, IonBackButton, IonToast } from "@ionic/react";
import React from "react";
import { personAddOutline } from "ionicons/icons";
import styled from "styled-components";
import { renderToStaticMarkup } from "react-dom/server";
import Topography from "../components/Topography";
import { useHistory } from "react-router-dom";


const topographyString = encodeURIComponent(renderToStaticMarkup(<Topography />));

const Register = () => {
    let history = useHistory();

    const [emailAddress, setEmailAddress] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [showErrorToast, setShowErrorToast] = useState<boolean>(false);

    const registerUser = async () => {
        try {
            await auth.register(emailAddress, password, { display_name: username });
            history.replace("/home");
        } catch (exception) {
            console.error(exception);
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/login" />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContentStyled>
                <CenterContainer>
                    <PageTitle>Registrer bruker</PageTitle>
                    <RegisterCard>
                        <IonList>
                            <IonItem>
                                <IonInput placeholder="Epostadresse" onIonInput={(e: any) => setEmailAddress(e.target.value)} />
                            </IonItem>
                            <IonItem>
                                <IonInput placeholder="Passord" type="password" onIonInput={(e: any) => setPassword(e.target.value)} />
                            </IonItem>
                            <IonItem>
                                <IonInput placeholder="Brukernavn" type="text" onIonInput={(e: any) => setUsername(e.target.value)} />
                            </IonItem>
                        </IonList>
                    </RegisterCard>
                    <Buttons>
                        <RegisterButton onClick={registerUser}>
                            <IonIcon icon={personAddOutline} />
                        </RegisterButton>
                    </Buttons>
                </CenterContainer>
                <IonToast
                    isOpen={showErrorToast}
                    onDidDismiss={() => setShowErrorToast(false)}
                    message="Du må fylle alle felt"
                    duration={3000}
                    color="warning"
                />
            </IonContentStyled>
        </IonPage>

    )
}
const RegisterCard = styled(IonCard)`
  padding: 20px;
`;

const IonContentStyled = styled(IonContent)`
  --background: none;
  background: url("data:image/svg+xml,${topographyString}") no-repeat fixed;
  background-size: cover;
`;

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;

const RegisterButton = styled(IonFabButton)`
--background: #4a5852;
align-self: center;
margin: 1.2vw;
`;

const Buttons = styled(IonButtons)`
  flex-direction: row;
  justify-content: center;
`;

const PageTitle = styled.h1`
  font-size: 2.5em;
  background-color: 219, 229, 225;
  align-self: center;
  color: #4a5852;
  font-family: 'Quicksand', sans-serif;
`;

export default Register;