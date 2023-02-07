import React from "react";
import MenuButtons from "../components/MenuButtons";
import Cookies from "universal-cookie";
import url from "../source";
import GetEmployees from "../components/getEmployeesStatistics";
import { Base64 } from "js-base64";
import MyButtons from "./MyButtons";
const cookie = new Cookies();

export default function MyStatistics(){
    let id = parseInt(cookie.get("id"));
    let data = [];

    const Click = async (e) => {

        e.preventDefault();

        let first_date = document.querySelector("#first_date").value;
        let last_date = document.querySelector("#last_date").value;
        let action_type = document.querySelector("#action_type").value;
        let user = Base64.decode(cookie.get("$"))
        let pass = Base64.decode(cookie.get("#"));

        let myData = {
            first_date: `${first_date}`,
            last_date: `${last_date}`,
            act_type: `${action_type}`,
            emp_id: id
        }
        
        let result = await fetch(`${url}/api/one_later_early`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Base64.encode(`${user}:${pass}`)}`
            },
            body: JSON.stringify(myData)
        })
        
        result = await result.text()     
        

        if(result.length > 0){
            data = GetEmployees(result, result.split("\n").length - 1);

            let t = 1;

            document.querySelector(".tbody").innerHTML = "";
                for(let i = 1; i < data.length; i++){
                    document.querySelector(".tbody").innerHTML += "<tr>"
                    document.querySelector(".tbody").lastChild.innerHTML += `<th>${t++}</th>`
                    for(let j = 0; j < 6; j++){                            
                        document.querySelector(".tbody").lastChild.innerHTML  += `<td>${data[i][j][1] !== "null" ? data[i][j][1] : ""}</td>`
                    }
                    document.querySelector(".tbody").innerHTML += "</tr>"
                    
                }
        }else{

            document.querySelector(".alert").innerHTML = "данные не найдены"
            
        }

    }

    return(<>
        <MenuButtons />
        <MyButtons />
        <p className="employees">Моя статистика</p>
        <form className="change_form">
                    
                    <input type="text" placeholder="Введите первую дату" id="first_date" className="emp_input"/>
                    
                    <input type="text" placeholder="Введите последнюю дату" id="last_date" className="emp_input"/>
                    
                    <select  id="action_type" className="emp_input emp_select">
                        <option value="late">опоздал</option>
                        <option value="early" >Пошел рано</option>
                    </select>
                    
                    <button className="emp_btn" onClick = {(e) => Click(e)}>Поиск</button>
                </form>

                <table className="table">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Ид</th>
                            <th>Имя</th>
                            <th>Фамилия</th>
                            <th>Время действия</th>
                            <th>Тип действия</th>
                            <th>Причина</th>
                        </tr>
                    </thead>
                    <tbody className="tbody">
                    
                    </tbody>
                </table>
                <p className="alert"></p>
    </>)
}