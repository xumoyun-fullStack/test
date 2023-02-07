import React, {Component} from "react";
import MenuButton from "./MenuButton";
import Cookies from "universal-cookie";
import { Base64 } from "js-base64";
const cookies = new Cookies();

class MenuButtons extends Component{
    render(){
        let role = cookies.get("@");
        role = role ? Base64.decode(role) : "";
     
        return(
            <div>
                <MenuButton url="/employees" name="Все работники" />
                {role === "super" ? <MenuButton url="/change-work" name="Изменить рабочее время"  /> : ""}
                {role === "super" || role === "admin" ? <MenuButton url="/employees_statistics" name="Статистика сотрудников" /> : ""}
                <MenuButton url="/reason" name="Причина"/>
                <MenuButton url="/my_statistics" name="Мой кабинет" />
            </div>
        )
    }
}

export default MenuButtons;