import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonMenuButton,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { useContext, useState } from "react";
import "./Page.css";
import { useHistory, useParams } from "react-router";
import { bookTransfer } from "../data/Urls";
import axios from "axios";
import GeneralContext from "../data/general-context";

const TransferBook: React.FC = () => {
  const [holder, setHolder] = useState("");
  const [status, setStatus] = useState("");

  const triggerCtx = useContext(GeneralContext);
  const history = useHistory();

  const [presentToast, dismissToast] = useIonToast();
  const [showLoader, hideLoader] = useIonLoading();

  const { isbn } = useParams<{ isbn: string }>();

  const showToast = (msg: string, color: "danger" | "success") => {
    presentToast({
      buttons: [{ text: "Okay", handler: () => dismissToast() }],
      color: color,
      message: msg,
      duration: 2000,
    });
  };

  const submitHandler = () => {
    if (holder == "") {
      showToast("The stakeholder of the book must not be empty", "danger");
    } else {
      showLoader({
        message: "Loading...",
        spinner: "circular",
      });
      
      const stakeholder = {
        isbn: isbn,
        holder: holder,
        status: status,
      };

      axios(bookTransfer, {
        method: "put",
        data: stakeholder,
        auth: {
          username: "admin",
          password: "admin",
        },
      })
        .then((res) => {
          console.info(res);
          hideLoader();
          showToast("Successfully transferred to new stakeholder", "success");
          history.push('/page/books');
          triggerCtx.triggerRender(true);
        })
        .catch((err) => {
          console.error(err);
          hideLoader();
          if (err.code == 500) {
            showToast("Request timed out please try again", "danger");
          } else {
            showToast("Failed while transferring to the new stakeholder", "danger");
          }
        });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Transfer Book - U-Library</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="header text-center mb-4">
          <h1 className="mb-3">Transfer Book</h1>
        </div>
        <div className="d-flex justify-content-center">
          <div className="login-form">
            <form>
              <div className="form-group">
                <label>Stakeholder</label>
                <IonInput
                  required
                  type="text"
                  value={holder}
                  onIonChange={(e) => setHolder(e.detail.value!)}
                  className="form-control mb-1"/>
              </div>
              <div className="form-group">
                <label>Status</label>
                <IonInput
                  required
                  type="text"
                  value={status}
                  onIonChange={(e) => setStatus(e.detail.value!)}
                  className="form-control mb-1"/>
                {/* <IonSelect
                  interface="popover"
                  className="form-control mb-1"
                  value={status}
                  onIonChange={(e) => setStatus(e.detail.value!)}>
                  <IonSelectOption value="Available">Available</IonSelectOption>
                  <IonSelectOption value="Borrowed">Borrowed</IonSelectOption>
                </IonSelect> */}
              </div>
              <div className="form-group mt-2">
                <div className="row justify-content-center">
                  <IonButton onClick={submitHandler}>Transfer</IonButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TransferBook;
