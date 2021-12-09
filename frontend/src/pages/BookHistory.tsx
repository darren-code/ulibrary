import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { useEffect, useState } from "react";
import "./Page.css";

import axios from "axios";
import { bookHistory } from "../data/Urls";
import { useParams } from "react-router";
import History from "../data/History.model";
import { PersistentRecord } from "../data/Book.model";

const HistoryBook: React.FC = () => {
  const { isbn } = useParams<{ isbn: string }>();
  const [presentToast, dismissToast] = useIonToast();
  const [showLoader, hideLoader] = useIonLoading();
  const [fetched, setFetched] = useState(false);
  const [track, setTrack] = useState<[]>([]);
  const [detail, setDetail] = useState<PersistentRecord>();

  useEffect(() => {
    showLoader();

    axios(bookHistory + isbn, {
      method: "get",
      auth: {
        username: "admin",
        password: "admin",
      },
    })
      .then((res) => {
        console.log(res.data);
        if (!fetched) {
          setTrack(res.data);
          setDetail(res.data[0].Value);
          setFetched(true);
        }
        hideLoader();
      })
      .catch((err) => {
        console.log(err);
        hideLoader();
      });
  }, []);

  const showToast = (msg: string, color: "danger" | "success") => {
    presentToast({
      buttons: [{ text: "Proceed", handler: () => dismissToast() }],
      color: color,
      message: msg,
      duration: 2000,
    });
  };

  let layout;
  if (track.length === 0) {
    layout = (
      <tr>
        <td colSpan={6} className="text-center">
          This book has no history
        </td>
      </tr>
    );
  } else {
    layout = track.map((log: History) => {
      return (
        <tr key={log.TxId}>
          <td>{log.Value?.Holder}</td>
          <td>{log.Value?.Status}</td>
          <td>{log.timestamp}</td>
          <td>{log.IsDelete}</td>
        </tr>
      );
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>History Books - U-Library</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="header text-center mb-4">
          <h1 className="mb-3">{detail?.ISBN} Log Book</h1>
          <div className="d-flex justify-content-center">
            <div className="row">
              <div className="col">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{detail?.Title}</h5>
                    <p className="card-text">{detail?.Author}</p>
                    <p className="card-text">{detail?.Publisher}</p>
                    <p className="card-text">{detail?.Genre}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <div className="row">
            <div className="col">
              <table className="table">
                <thead>
                  <tr>
                    <th>Stakeholder</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th>Deleted</th>
                  </tr>
                </thead>
                <tbody>{layout}</tbody>
              </table>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HistoryBook;
