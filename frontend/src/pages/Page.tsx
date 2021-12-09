import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Page.css';

const Page: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>U-Library</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="header text-center mb-4">
          <h4>Welcome To</h4>
          <h1 className="mb-3">U-Library</h1>
          <h5><em>Powered by <strong>Hyperledger Fabric</strong></em></h5>
        </div>
        <div className="row">
          <div className="col"></div>
          <div className="col-8 text-justify">
            <p><em>U-Library</em> a decentralized library system to monitor the transaction of books while being borrowed by the readers or
              returned to the librarians. The ledger is distributed among the stakeholder of which is the librarians and the readers.
              It contains past information of the book including the one who borrowed it previously. Peer can donate, retrieve, lend, borrow, return
              book from the library.</p>
          </div>
          <div className="col"></div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Page;
