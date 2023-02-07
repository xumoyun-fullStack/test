import React from "react";
import MenuButton from "../components/MenuButton";

export default function MyButtons(){
    return(
        <>
            <div className="btns">
                <MenuButton url="/my_statistics" name="Моя статистика"/>
                <MenuButton url="/change_login" name="Изменить пароль"/>
            </div>
        </>
    )
}