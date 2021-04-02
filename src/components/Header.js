import React from "react";

function Header(props) {
  return (
    <header className="header">
      <div
        className="header__logo"
        src={props.src}
        alt="Логотип Mesto Russia"
      ></div>
    </header>
  );
}
export default Header;
