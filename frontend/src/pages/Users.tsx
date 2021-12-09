import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonLoading,
} from "@ionic/react";
import axios from "axios";
import { useEffect, useState } from "react";
import User from "../data/User.model";
import { userList } from "../data/Urls";
import "./Page.css";

const Users: React.FC = () => {
  const [showLoader, hideLoader] = useIonLoading();
  const [fetched, setFetched] = useState(false);
  const [users, setUsers] = useState<Array<User>>([]);

  useEffect(() => {
    showLoader();

    axios(userList, {
      method: "get",
      auth: {
        username: "admin",
        password: "admin",
      },
    })
      .then((res) => {
        console.log(res.data);
        if (!fetched) {
          for (const val in res.data) {
            console.log(res.data[val]);
          }
          setUsers(res.data);
          setFetched(true);
        }
        hideLoader();
      })
      .catch((err) => {
        console.log(err);
        hideLoader();
      });
  }, []);

  let layout;
  if (users.length === 0) {
    layout = (
      <tr>
        <td colSpan={3} className="text-center">
          No agents found
        </td>
      </tr>
    );
  } else {
    layout = users.map((a) => {
      return (
        <tr key={a.id}>
          <td>{a.id}</td>
          <td>{a.usertype}</td>
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
          <IonTitle>Users - U-Library</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="header text-center mb-4">
          <h1 className="mb-3">List of Users</h1>
        </div>
        <div className="d-flex justify-content-center">
          <div className="col">
            <table className="table">
              <tr>
                <th>Name</th>
                <th>Type</th>
              </tr>
              {layout}
            </table>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Users;
