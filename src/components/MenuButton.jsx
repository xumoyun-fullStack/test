import React from "react";

export default function MenuButton({name, url}){
    let isActive = window.location.pathname;
    return(
        <a href={url} className={ isActive === url ? "active" : "menu_button"}>
           {name}
        </a>
    )
}