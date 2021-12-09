import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { useContext, useState } from "react";
import "./Page.css";
import axios from "axios";
import { addBook } from "../data/Urls";
import { useHistory } from "react-router";
import GeneralContext from "../data/general-context";

const AddBook: React.FC = () => {
  const [holder, setHolder] = useState("");
  const [genre, setGenre] = useState("");
  const [title, setTitle] = useState("");
  const [isbn, setISBN] = useState("");
  const [status, setStatus] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");

  const history = useHistory();
  const triggerCtx = useContext(GeneralContext);

  const [presentToast, dismissToast] = useIonToast();
  const [showLoader, hideLoader] = useIonLoading();

  const showToast = (msg: string, color: "danger" | "success") => {
    presentToast({
      buttons: [{ text: "Proceed", handler: () => dismissToast() }],
      color: color,
      message: msg,
      duration: 2000,
    });
  };

  const submitHandler = () => {
    if (isbn == "") {
      showToast("The ISBN must not be empty", "danger");
    } else if (title == "") {
      showToast("The title must not be empty", "danger");
    } else if (genre == "") {
      showToast("The genre must not be empty", "danger");
    } else if (status == "") {
      showToast("The status must not be empty", "danger");
    } else if (holder == "") {
      showToast("The stakeholder must not be empty", "danger");
    } else if (publisher == "") {
      showToast("The publisher must not be empty", "danger");
    } else if (author == "") {
      showToast("The author must not be empty", "danger");
    } else {

      showLoader({
        message: "Loading...",
        spinner: "circular",
      });

      const book = {
        isbn: isbn,
        title: title,
        genre: genre,
        holder: holder,
        status: status,
        publisher: publisher,
        author: author
      };

      axios(addBook, {
        method: "post",
        data: book,
        auth: {
          username: "admin",
          password: "admin",
        },
      })
        .then((res) => {
          console.info(res);
          hideLoader();
          showToast("Successfully inserted a new book", "success");
          history.push('/page/books');
          triggerCtx.triggerRender(true);
        })
        .catch((err) => {
          console.error(err);
          hideLoader();
          showToast("Failed adding a new book", "danger");
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
          <IonTitle>Insert Book - U-Library</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="header text-center mb-4">
          <h1 className="mb-3">Insert Book</h1>
        </div>
        <div className="d-flex justify-content-center">
          <div className="login-form">
            <form>
              <div className="form-group">
                <label>ISBN</label>
                <IonInput
                  required
                  type="text"
                  value={isbn}
                  onIonChange={(e) => setISBN(e.detail.value!)}
                  className="form-control mb-1"
                />
              </div>
              <div className="form-group">
                <label>Title</label>
                <IonInput
                  required
                  type="text"
                  value={title}
                  onIonChange={(e) => setTitle(e.detail.value!)}
                  className="form-control mb-1"
                />
              </div>
              <div className="form-group">
                <label>Author</label>
                <IonInput
                  required
                  type="text"
                  value={author}
                  onIonChange={(e) => setAuthor(e.detail.value!)}
                  className="form-control mb-1"
                />
              </div>
              <div className="form-group">
                <label>Publisher</label>
                <IonInput
                  required
                  type="text"
                  value={publisher}
                  onIonChange={(e) => setPublisher(e.detail.value!)}
                  className="form-control mb-1"
                />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <IonInput
                  required
                  type="text"
                  value={genre}
                  onIonChange={(e) => setGenre(e.detail.value!)}
                  className="form-control mb-1"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <IonInput
                  required
                  type="text"
                  value={status}
                  onIonChange={(e) => setStatus(e.detail.value!)}
                  className="form-control mb-1"
                />
              </div>
              <div className="form-group">
                <label>Stakeholder</label>
                <IonInput
                  required
                  type="text"
                  value={holder}
                  onIonChange={(e) => setHolder(e.detail.value!)}
                  className="form-control mb-1"
                />
              </div>
              <div className="form-group mt-2">
                <div className="row justify-content-center">
                  <IonButton onClick={submitHandler}>Insert Book</IonButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AddBook;
