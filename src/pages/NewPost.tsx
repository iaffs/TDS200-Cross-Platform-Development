import { useMutation } from "@apollo/client";
import { useCamera } from "@capacitor-community/react-hooks/camera";
import { CameraResultType } from "@capacitor/core";
import { IonBackButton, IonButton, IonButtons, IonCard, IonContent, IonHeader, IonInput, IonItem, IonList, IonPage, IonTitle, IonToolbar, IonToast } from "@ionic/react";
import gql from "graphql-tag";
import React, { useState } from "react";
import { auth, storage } from "../utils/nhost";
import Topography from '../components/Topography';
import { renderToStaticMarkup } from "react-dom/server";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const topographyString = encodeURIComponent(renderToStaticMarkup(<Topography />));

const INSERT_POST = gql`
    mutation InsertPost($post: posts_insert_input!) {
        insert_posts_one(object: $post) { 
            title,
            user_id,
            description,
            image_filename
        }
    }  
`;

const useImageUpload = () => {
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const startUploading = async ({ base64string, filenameWithExtension }: { base64string: string, filenameWithExtension: string }) => {
        try {
            await storage.putString(`/public/${filenameWithExtension}`, base64string, "data_url", null, (pe: ProgressEvent) => {
                setUploadProgress((pe.loaded / pe.total) * 100);
            });
        } catch (e) {
            console.warn(e);
        }
    };

    return {
        uploadProgress,
        startUploading
    }
};

const NewPost = () => {
    let history = useHistory();

    const { startUploading } = useImageUpload();
    const { photo, getPhoto } = useCamera();
    const [insertPostMutation] = useMutation(INSERT_POST);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [filename, setFilename] = useState<string>("");
    const [toastMessage, setToastMessage] = useState<string>('');
    const [showToast, setShowToast] = useState<boolean>(false);

    const triggerCamera = async () => {
        await getPhoto({
            resultType: CameraResultType.DataUrl,
            quality: 20,
            allowEditing: false
        });
        setFilename(`${Date.now().toString()}.jpeg`);
    }

    const uploadImage = async () => {
        if (photo?.dataUrl) {
            await startUploading({
                base64string: photo.dataUrl,
                filenameWithExtension: filename
            })
        } else {
            setToastMessage("Du trenger tittel, beskrivelse eller bilde")
            setShowToast(true);
        }
    }

    const insertPost = async () => {
        if (title === '' || description.length < 1 || filename === "") {
            setToastMessage("Du trenger tittel, beskrivelse eller bilde")
            setShowToast(true);
            return;
        } else {
            try {
                await uploadImage()
                await insertPostMutation({
                    variables: {
                        post: {
                            title,
                            description,
                            image_filename: filename,
                            user_id: auth.getClaim('x-hasura-user-id')
                        }
                    }
                });

                setTimeout(() => {
                    history.goBack();
                },
                    300)
            } catch (e) {
                setToastMessage("Det skjedde en feil, prøv igjen")
                setShowToast(true);
            }
        }
    }


    return (
        <IonPage>
            <IonContentStyled>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot={'start'}>
                            <IonBackButton defaultHref="/home"></IonBackButton>
                        </IonButtons>
                        <IonTitle>Nytt innlegg</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonCard>
                    <img src={photo?.dataUrl} />
                    <IonList>
                        <IonItem>
                            <IonInput placeholder="Tittel" onIonInput={(e: any) => setTitle(e.target.value)} />
                        </IonItem>
                        <IonItem>
                            <IonInput placeholder="Beskrivelse" onIonInput={(e: any) => setDescription(e.target.value)} />
                        </IonItem>
                    </IonList>
                    <Button onClick={triggerCamera}>Ta bilde</Button>
                    <Button onClick={insertPost}>Send post</Button>
                </IonCard>
            </IonContentStyled>
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={3000}
                color='warning'
            />
        </IonPage>
    );
};

const IonContentStyled = styled(IonContent)`
  --background: none;
  background: url("data:image/svg+xml,${topographyString}") no-repeat fixed;
  background-size: cover;
`;

const Button = styled(IonButton)`
  --color: #51615a;
  --margin: 1.5wv;
`;

export default NewPost;