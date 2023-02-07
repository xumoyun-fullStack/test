import React from "react";
import MenuButtons from "../components/MenuButtons";
import {Base64} from "js-base64";
import Cookies from "universal-cookie";
import url from "../source";
const cookie = new Cookies();

export default function SetReason(){


    const Click = async (e) => {

        e.preventDefault();

        let user = Base64.decode(cookie.get("$"));
        let pass = Base64.decode(cookie.get("#"));

        let name = document.querySelector("#name").value ;
        let last_name = document.querySelector("#last_name").value;
        

        let id = document.querySelector("#id").value;
        let myData

        if(name && last_name && !id){
            myData = {
                name: `${name}`,
                last_name: `${last_name}`
            }
    
            let result = await fetch(`${url}/api/get_by_name_and_last_name`,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${Base64.encode(`${user}:${pass}`)}`
                },
                body: JSON.stringify(myData)
            })
    
            result = await result.text();
    
            id = parseInt(result);
    
            if(result === ""){
                alert("Сотрудник с таким именем не найден");
            }
        }

        else if(!name && !last_name && id){
            id = parseInt(id);

            let first_date = document.querySelector("#first_date").value ;
            let last_date = document.querySelector("#last_date").value;
            let reason = document.querySelector("#reason").value;
            let type = document.querySelector("#action_type").value;

            let myData = {
                first_date: `${first_date}`,
                last_date: `${last_date}`,
                reason: `${reason}`,
                act_type: `${type}`,         
                emp_id : id
            }
            
            let res = await fetch(`${url}/api/set_reason`,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${Base64.encode(`${user}:${pass}`)}`
                },
                body: JSON.stringify(myData)
            })

            res = await res.text();

            if(res === "done"){
                alert("Выполнено");
            }else{
                alert("Что-то не так!")
            }
        }
    }

    return(
        <>
        <MenuButtons />

            <p className="employees">Причина</p>

            <form className="emp_form add_form reason_input">
                <span>
                    <label htmlFor="name">Имя</label>
                    <input type="text" id="name" className="emp_input add_input optional" placeholder="Имя"/>
                </span>
                <span>
                    <label htmlFor="last_name">Фамилия</label>
                    <input type="text" id="last_name" className="emp_input add_input optional" placeholder="Фамилия"/>
                </span>
                <span>
                    <label htmlFor="name">Идентификатор</label>
                    <input type="text" id="id" className="emp_input add_input" placeholder="Идентификатор"/>
                </span>
                <span>
                    <label htmlFor="first_date">Первое свидание</label>
                    <input type="text" id="first_date" className="emp_input add_input" placeholder="Первое свидание"/>
                </span>
                <span>
                    <label htmlFor="last_date">Последнее свидание</label>
                    <input type="text" id="last_date" className="emp_input add_input" placeholder="Последнее свидание"/>
                </span>
                <span>
                    <label htmlFor="reason">Причина</label>
                    <input type="text" id="reason" className="emp_input add_input" placeholder="Причина"/>
                </span>
                <span>
                    <label htmlFor="type">Ситуация</label>
                    <select  id="action_type" className="emp_input emp_select">
                        <option value="late">опоздал</option>
                        <option value="early" >Пошел рано</option>
                </select>
                </span>
                <button className="btn add_btn" onClick={(e) => Click(e)}>Добавить</button>
            </form>

            
        </>
    )
} 