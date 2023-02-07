import React from "react";
import Cookies from "universal-cookie";
import { Base64 } from "js-base64";
import url from "../source";
const cookie = new Cookies();

export default function Login(){

    // $ - username
    // # - password
    // @ - role
    
    const Click = async (e) => {
        e.preventDefault();

        cookie.remove("$");
        cookie.remove("#");
        cookie.remove("@");
        cookie.remove("name");
        cookie.remove("id")

        let username = document.querySelector("#username").value;
        let password = document.querySelector("#password").value;       

        cookie.set("$", Base64.encode(username));
        cookie.set("#", Base64.encode(password));

        let myData = {
            username: `${username}`,
            password: `${password}`
        }

        let result = await fetch(`${url}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Base64.encode(`${username}:${password}`)}`
            },
            body: JSON.stringify(myData)
        })

        result = await result.text();

        result = result.split("#");
       
        if(result){ 
            if(result[2] === "no"){
                window.open("/change_login", "_self")
            }
            else if(result[0] === "super"){
                window.open("/employees",  "_self")   
            }else if(result[0] === "admin" || result[0] === "user" || result[2] === "yes"){
                window.open("/employees",  "_self")   
            }else{
                alert("неправильное имя пользователя или пароль")
            }
                         
            cookie.set("name", "name");
            cookie.set("@", Base64.encode(result[0]));
            cookie.set("id", result[1]);              
        }else{
            alert("неправильное имя пользователя или пароль")
        }
    }

    return(
        <div>
            {/* <p className="employees">Login</p> */}
            {/* <div className="login_div"> */}
                <img src="https://media-exp1.licdn.com/dms/image/C561BAQHPS6MIdZ-9sw/company-background_10000/0/1519798236857?e=2159024400&v=beta&t=RKUmCe2Q0U0zLId8NhbrFkUcZV1-KhdZQk_CSMe9NVw" alt="img" />
            <form className="login_form">
                <input type="text" placeholder="имя пользователя" id="username" className="login_input"/>
                <input type="password" placeholder="пароль" id="password" className="login_input"/>
                <button className="login_btn btn" onClick={(e) => Click(e)}>Login</button>
            </form>
            {/* s          */}
        </div>
    )
}