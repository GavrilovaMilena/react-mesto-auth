import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const inputRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateAvatar({
      avatar: inputRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name="avatarEdit"
      title="Обновить аватар"
      buttonName="Сохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <form name="avatarForm" className="popup__form popup__form_avatar">
        <input
          name="avatar"
          type="url"
          className="popup__input popup__input_avatar"
          placeholder="Ссылка на картинку"
          required
          id="url-avatar"
          autoComplete="off"
          ref={inputRef}
        />

        <span id="url-avatar-error" className="error"></span>
      </form>
    </PopupWithForm>
  );
}
export default EditAvatarPopup;
