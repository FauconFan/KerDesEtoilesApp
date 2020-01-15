import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonToggle,
  IonRouterLink,
  IonLabel,
  IonItemDivider} from '@ionic/react';
import React from 'react';
import { RouteComponentProps } from "react-router-dom";
import { CallNumber } from '@ionic-native/call-number/ngx';

import errorPage from '../modules/errorPage';
import getData from '../modules/getData';
import objToStrMap from '../modules/objToStrMap';

const namesOfIndex : string[] = [
  "Les allos shotguns",
  "Les allos éphémères",
  "Les allos funs",
  "Les allos bouffe",
  "Les allos force"
];

function callThisNumber(number : string) {
  (new CallNumber()).callNumber(number, true);
}

function scrollTo(element : string) {
  let htmlEl = document.getElementById(element)!;
  htmlEl.scrollIntoView(true);
}

function genAlloDisplay(allo : any) {
  let contentButton = "Appeler (le " + allo.numero + ")";

  if (allo.prix > 0) {
    contentButton += " - " + allo.prix.toString() + " €";
  }

  return (
    <div key={allo.name}>
      <h2>{allo.name}</h2>
      <p>{allo.description}</p>
      <IonButton expand="full" onClick={function() {callThisNumber(allo.numero)}}>{contentButton}</IonButton>
    </div>
  );
}

function genAlloDomainDisplay(_alloDomain : any, index : number) {
  let names_allos = [];
  for (let key in _alloDomain) {
    names_allos.push(key);
  }

  if (names_allos.length == 0) {
    return (<> </>);
  }

  let key = "_alloDomain" + index.toString();

  let alloDomain = objToStrMap(_alloDomain);

  let pahtToDomainPhoto = "assets/images/allo_" + index.toString() + ".jpg";

  return (
    <div key={key}>
      <h1 className="ion-text-center">{namesOfIndex[index]}</h1>
      <IonCard>
        <img src={pahtToDomainPhoto} alt=""></img>
      </IonCard>
      {names_allos.map((allo) => {
        return genAlloDisplay(alloDomain.get(allo));
      })}
    </div>
  );
}

function genActivitiesDisplay(activities : any) {
  let genActivityDisplay = (activity : any) => {
    return (
      <div key={activity.name}>
        <h2>{activity.name}</h2>
        <p>{activity.description}</p>
      </div>
    );
  }

  if (activities.length == 0) {
    return (
      <p key="no_activities">Pas d'activité prévue pour l'instant.</p>
    );
  }

  return (activities.map((activity : any, index : number) => {
    return (genActivityDisplay(activity));
  }));
}

function switchDarkMode(def: boolean = false) {
  const _el = document.querySelector('#root');
  const el = _el as HTMLInputElement;
  if (def || el.style.getPropertyValue('--ion-background-color') != "black") {
    el.style.setProperty('--ion-background-color', 'black');
    el.style.setProperty('--ion-text-color', 'white');
  }
  else {
    el.style.setProperty('--ion-background-color', 'white');
    el.style.setProperty('--ion-text-color', 'black');
  }
}

const Home: React.FC<RouteComponentProps> = () => {
  let _data = getData();
  if (_data == undefined) {
    return (errorPage());
  }

  switchDarkMode(true);

  let data = _data as Map<string, any>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            La Ker des Étoiles
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
          
        <IonRefresher slot="fixed" onIonRefresh={() => {window.location.reload()}}>
          <IonRefresherContent pullingIcon="arrow-dropdown" pullingText="Tirer vers le bas pour mettre à jour" refreshingText="Mise à jour">
          </IonRefresherContent>
        </IonRefresher>

        <IonCard>
          <img src="assets/images/background_home.jpg" alt=""></img>
        </IonCard>

        <div key="text_bienvenur">
          <p>Bonjour à tous.</p>
          <p>Nous avons le plaisir de vous présenter notre application afin de pouvoir nous appeler sans avoir à chercher notre numéro à chaque fois 😄.</p>
          <p>Nous vous invitons à choisir votre allo. Vous pouvez appuyez sur le bouton 'Appeler le 0...', cela appellera directement le numéro.</p>
          <p>Pour le paiement des allos (si il y a), cela se fera sur Lydia à réception de la livraison.</p>
          <h2>Notes sur l'application</h2>
          <p>Si vous avez ouvert l'application depuis longtemps (plus de 15 min), vous avez la possibilité de recharger les numéros de téléphone en slidant l'application vers le bas (de la même manière qu'une page web).</p>
        </div>
  
        <IonButton color="secondary" expand="full" onClick={() => {switchDarkMode();}}>Switch Dark Mode</IonButton>
  
        <h1>Sommaire</h1>

        <div key="summary">
          <h2><IonLabel onClick={() => {scrollTo('I-allos');}}>I - Allos</IonLabel></h2>
          <h2><IonLabel onClick={() => {scrollTo('II-activite');}}>II - Activités</IonLabel></h2>
          <h2><IonLabel onClick={() => {scrollTo('III-apropos');}}>III - À propos</IonLabel></h2>
        </div>

        <h1 id="I-allos">I - Allos</h1>

        {
          data.get('allos').map((alloDomain : any, index : number) => {
            return genAlloDomainDisplay(alloDomain, index);
          })
        }

        <h1 id="II-activite">II - Activités</h1>

        {genActivitiesDisplay(data.get('activities'))}

        <h1 id="III-apropos">III - À propos</h1>

        <p>Cette application a été développé par la liste 'La Ker des Étoiles' avec pour développeur principal Joseph Priou, avec l'aide de Corentin Hubert, ainsi que toute l'équipe technique de la liste.</p>
        <p>Nous aimerions nous excuser pour la gène occasionnée par l'installation de l'application qui n'a pas pu se faire sur Google Play ou sur l'App Store dû à un manque de temps.</p>
        <p></p>
        <p>Force à 'La Ker des Étoiles'</p>
        
        
      </IonContent>
    </IonPage>
  );
};

export default Home;
