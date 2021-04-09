import React from "react";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../../src/contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import {
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import api from "../utils/api";
import "../index.css";
import { register, login, getData } from '../utils/auth';


function App() {
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsAuth(false);
  };

  const handleLogin = (data) => {
    const { email, password } = data;
    return login(email, password)
      .then((res) => {
        if (res) {
          setLoggedIn(true);
          setIsAuth(true);
          history.push("/");
          localStorage.setItem("jwt", res.token);
        }
      })
      .catch((err) => {
        setIsTooltipOpened(true);
        console.log(`Произошла ошибка: ${err}`);
      });
  };

  const handleRegister = (data) => {
    const { email, password } = data;
    return register(email, password)
      .then((res) => {
        if (res.data) {
          setIsAuth(true);
        }
      })
      .catch((err) => {
        setIsTooltipOpened(true);
        console.log(`Произошла ошибка: ${err}`);
      });
  };

  const history = useHistory();

  const [isTooltipOpened, setIsTooltipOpened] =  React.useState(false);
  const [userLoginData, setUserLoginData] = React.useState('');
  const [isAuth, setIsAuth] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(
    false
  );
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(
    false
  );
  const [selectedCard, setSelectedCard] = React.useState(false);

  const [currentUser, setCurrentUser] = React.useState({
    name: "",
    about: "",
    avatar: "",
  });

  const [cards, setCards] = React.useState([]);

  React.useEffect(() => {
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");

      getData(jwt)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setUserLoginData(res.data.email);
          }
        })
        .catch((err) => {
          setIsTooltipOpened(true);
          console.log(`Произошла ошибка: ${err}`);
        });
    }
  }, [history]);

  React.useEffect(() => {
    api
      .getInitialCards()
      .then((data) => {
        setCards(data);
      })
      .catch((err) => {
        console.log(err);
      });
    api
      .getUserInfo()
      .then((data) => {
        setCurrentUser({
          name: data.name,
          about: data.about,
          avatar: data.avatar,
          _id: data._id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== card._id);
        setCards(newCards);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditTooltipClick() {
    setIsTooltipOpened(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(false);
    setIsTooltipOpened(false);
  }

  function handleUpdateUser({ name, about }) {
    api
      .setUserInfo({ name, about })
      .then((data) => {
        setCurrentUser({
          name: data.name,
          about: data.about,
          avatar: data.avatar,
          _id: data._id,
        });
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .updateAvatarImage({ avatar })
      .then((data) => {
        setCurrentUser({
          name: data.name,
          about: data.about,
          avatar: data.avatar,
          _id: data._id,
        });
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(name, link) {
    api
      .addCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Switch>
            <ProtectedRoute
              exact
              path="/"
              loggedIn={loggedIn}
              component={Main}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              isTooltipOpened={handleEditTooltipClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              userLoginData={userLoginData}
              logout={handleLogout}
            />
            <Route path="/sign-in">
              <Login handleLogin={handleLogin} />
            </Route>
            <Route path="/sign-up">
              <Register handleRegister={handleRegister} />
            </Route>
          </Switch>
          <Footer />
        </div>
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <PopupWithForm name="cardDelete" title="Вы уверены?" buttonName="Да" />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip
          isOpen={isTooltipOpened}
          onClose={closeAllPopups}
          name="registerEdit"
          isRegSuccess={isAuth}
          regSuccess="Вы успешно зарегестрировались!"
          regFailed="Что-то пошло не так! Попробуйте ещё раз."
        />
      </div>
    </CurrentUserContext.Provider>
  );
}
export default App;
