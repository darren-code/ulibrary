import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterLink,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
  addOutline,
  addSharp,
  peopleOutline,
  peopleSharp,
  pricetagOutline,
  pricetagSharp,
} from "ionicons/icons";
import "./Menu.css";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "Books",
    url: "/page/books",
    iosIcon: pricetagOutline,
    mdIcon: pricetagSharp,
  },
  {
    title: "Users",
    url: "/page/users",
    iosIcon: peopleOutline,
    mdIcon: peopleSharp,
  },
  {
    title: "Insert Book",
    url: "/page/add",
    iosIcon: addOutline,
    mdIcon: addSharp,
  },
];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" side="start">
      <IonContent>
        <IonList id="inbox-list">
          <IonRouterLink routerLink="/">
            <IonListHeader>U-Library</IonListHeader>
            <IonNote>Monitor your book with ease</IonNote>
          </IonRouterLink>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
