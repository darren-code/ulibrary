import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Books from './pages/Books';
import Users from './pages/Users';
import AddBook from './pages/AddBook';
import BookHistory from './pages/BookHistory';
import TransferBook from './pages/TransferBook';
import GeneralContextProvider from './data/GeneralContextProvider';

const App: React.FC = () => {
  return (
    <IonApp>
        <GeneralContextProvider>
            <IonReactRouter>
                <Menu />
                <IonRouterOutlet id="main">
                  <Route path="/" exact={true}>
                    <Page />
                  </Route>
                  <Route exact path="/page/books" component={Books}/>
                  <Route exact path="/page/books/:isbn" component={BookHistory} />
                  <Route exact path="/page/books/trx/:isbn" component={TransferBook} />
                  <Route exact path="/page/users" component={Users}/>
                  <Route exact path="/page/add" component={AddBook}/>
                </IonRouterOutlet>
            </IonReactRouter>
        </GeneralContextProvider>
    </IonApp>
  );
};

export default App;
