import React from "react";
import MenuButtons from "../components/MenuButtons";
import MyButtons from "./MyButtons";
import { Base64 } from "js-base64";
import Cookies from "universal-cookie";
import url from "../source";
const cookie = new Cookies();

export default function ChangeLogin(){

    let user = Base64.decode(cookie.get("$"));
    let pass = Base64.decode(cookie.get("#"));

    const Click = async (e) => {

        e.preventDefault();

        let id = cookie.get("id");
        let username = document.querySelector("#username").value;
        let password = document.querySelector("#password").value;
        let myData = {
            id: id,
            username: username,
            password: password,
            is_verified: "yes"
        }

        let result = await fetch(`${url}/api/change_login`,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Basic ${Base64.encode(`${user}:${pass}`)}`
            },
            body: JSON.stringify(myData)
        })

        result = await result.text();

        if(result === "done"){
            alert("Успешно изменено!");
            cookie.remove("$");
            cookie.remove("#");

            cookie.set("$", Base64.encode(username));
            cookie.set("#", Base64.encode(password));
        }
    }
    return(
        <>
        <MenuButtons />
        <MyButtons />
            <p className="employees">Изменить пароль и логин</p>

            <form className="add_form">
                <span>
                    <label htmlFor="username">имя пользовател</label>
                    <input type="text" id="username" className="emp_input add_input" required/>
                </span>
                <span>
                    <label htmlFor="password">пароль</label>
                    <input type="text" id="password" className="emp_input add_input" required/>
                </span>
                <button className="btn  add_btn" onClick={(e) => Click(e)}>Изменять</button>  
            </form>
        </>
    )
}