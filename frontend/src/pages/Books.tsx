import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import "./Page.css";

import axios from "axios";
import { bookShelf, deleteBook } from "../data/Urls";
import { readerOutline, swapHorizontalOutline, trashBinOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import Book, { FabricBook } from "../data/Book.model";
import GeneralContext from "../data/general-context";

const Books: React.FC = () => {
  const [presentToast, dismissToast] = useIonToast();
  const [showLoader, hideLoader] = useIonLoading();
  const [displayLoader, closeLoader] = useIonLoading();
  const history = useHistory();
  const triggerCtx = useContext(GeneralContext);
  const [present] = useIonAlert();
  const [books, setBooks] = useState<Array<FabricBook>>([]);

  useEffect(() => {
    showLoader();

    if (triggerCtx.trigger) {
      axios(bookShelf, {
        method: "get",
        auth: {
          username: "admin",
          password: "admin",
        },
      })
        .then((res) => {
          console.log(res.data);
          triggerCtx.triggerRender(false);
          setBooks(res.data);
          hideLoader();
        })
        .catch((err) => {
          console.log(err);
          hideLoader();
        });
    } else {
      hideLoader();
    }
  }, [triggerCtx.trigger]);

  const showToast = (msg: string, color: "danger" | "success") => {
    presentToast({
      buttons: [{ text: "Proceed", handler: () => dismissToast() }],
      color: color,
      message: msg,
      duration: 2000,
    });
  };

  const transferHandler = (id: any) => {
    history.push("/page/books/trx/" + id);
  };

  const historyHandler = (id: any) => {
    history.push("/page/books/" + id);
  };

  const removeBook = (id: any) => {
    displayLoader({
      message: "Loading...",
      spinner: "circular",
    });
    axios(
      deleteBook + id, {
        method: "delete",
        auth: {
          username: "admin",
          password: "admin",
        },
      }
    ).then((res) => {
      console.info(res.data)
      showToast("The book is successfully deleted", "success");
      triggerCtx.triggerRender(true);
      closeLoader();
    }).catch((err) => {
      console.error(err)
      showToast("Error occured", "danger");
      closeLoader();
    })
  }

  const deleteHandler = (id: any) => {
    present({
      cssClass: 'ion-dialog',
      header: 'Delete Book',
      message: `Are you sure deleting book with ISBN ${id} ?`,
      buttons: ['Cancel', { text: 'Yes', handler: (d) =>  
        removeBook(id)
      }],
      onDidDismiss: (e) => console.log('did dismiss'),
    })
  }

  let view;
  if (books.length === 0) {
    view = (
      <tr>
        <td colSpan={5} className="text-center">
          Library is empty at the moment.
        </td>
      </tr>
    );
  } else {
    view = books.map((book, index) => {
      return (
        <tr key={book.Key}>
          <td>{book.Record?.Title}</td>
          <td>{book.Record?.Genre}</td>
          <td>{book.Record?.Holder}</td>
          <td>{book.Record?.Status}</td>
          <td>{book.Record?.Author}</td>
          <td>{book.Record?.Publisher}</td>
          <td>
            <IonButton onClick={() => transferHandler(book.Key)}>
              <IonIcon icon={swapHorizontalOutline} />
            </IonButton>
            <IonButton onClick={() => historyHandler(book.Key)}>
              <IonIcon icon={readerOutline} />
            </IonButton>
            <IonButton onClick={() => deleteHandler(book.Key)}>
              <IonIcon icon={trashBinOutline} />
            </IonButton>
          </td>
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
          <IonTitle>Books - U-Library</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="header text-center mb-4">
          <h1 className="mb-3">Book List</h1>
        </div>
        <div className="d-flex justify-content-center">
          <div className="col">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Stakeholder</th>
                  <th>Status</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{view}</tbody>
            </table>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Books;
