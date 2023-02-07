import React, { useEffect } from "react";
import Cookies from "universal-cookie";
import { Base64 } from "js-base64";
import url from "../source";
import MenuButtons from "../components/MenuButtons";
const cookie = new Cookies();

export default function OneEmployee(){
    let id = window.location.href
    id = id.split("/")[4];
    id = parseInt(id);

    let user = Base64.decode(cookie.get("$"))
    let pass = Base64.decode(cookie.get("#"))
    let result;

    useEffect( () => async function(){
        Load();
    }, [])

    const Load = async () => {
        let myData = {
            id: id
        }
        result = await fetch(`${url}/api/get_by_id`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Base64.encode(`${user}:${pass}`)}`,
            },
            body: JSON.stringify(myData)
        })

        result = await result.json();
        
        document.querySelector(".name").innerHTML = result.name;
        document.querySelector(".last_name").innerHTML = result.last_name;
        document.querySelector(".department").innerHTML = result.department_name;
        document.querySelector(".job").innerHTML = result.job_name;
        document.querySelector(".email").innerHTML = result.email;        
    }

    const Click = async (e) => {
        
        e.preventDefault();

        let mymail = {
            id: id
        }
    
        let email = await fetch(`${url}/api/get_email`,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Basic ${Base64.encode(`${user}:${pass}`)}`
            },
            body: JSON.stringify(mymail)
        })
    
        email = await email.text();

        let myData = {
                    emp_id: id
                }

                let result2 = await fetch(`${url}/api/delete_employee`,{
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json",
                        "Authorization": `Basic ${Base64.encode(`${user}:${pass}`)}`
                    },
                    body: JSON.stringify(myData)
                })

                result2 = await result2.text();

                if(result2 === "done"){
                    alert("Успешно удалено!");

                    await fetch(`${url}/api/send_mail`,{
                        method: "POST",
                        headers:{
                            "Content-Type": "application/json",
                            "Authorization": `Basic ${Base64.encode(`${user}:${pass}`)}`
                        },
                        body: JSON.stringify({
                            to_email: email,
                            text: "Вас уволили из 'fido-biznes'а, спасибо за сотрудничество!",
                            subject: "fido-biznes"
                        })
                    }) 
                    window.open("/employees", "_self")
                }
    }

    return(
        <>
            <MenuButtons/>
            <p className="employees">One</p>

            <div className="emp">
                <span>
                    <b>Имя</b>
                    <b className="name"></b>
                </span>
                <span>
                    <b>Фамилия</b>
                    <b className="last_name"></b>
                </span>
                <span>
                    <b>Департамент</b>
                    <b className="department"></b>
                </span>
                <span>
                    <b>Работа</b>
                    <b className="job"></b>
                </span>
                <span>
                    <b>Электронная почта</b>
                    <b className="email"></b>
                </span>
                <span>
                    <div className="emp_btns">
                        <button className="btn btn_emp" onClick = {() => window.open(`/change_employee/${id}`, "_self")}>Сменить сотрудника</button>
                        <button className="btn btn_emp" onClick={(e) => Click(e)}>Удалить сотрудника</button>
                    </div>
                </span>         
            </div>     
        </>
    )
}