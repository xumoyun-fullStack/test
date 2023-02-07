import React from "react";
import GetEmployees from "../components/getEmployeesStatistics";
import url from "../source";
import {AiFillStar} from "react-icons/ai";
import MenuButtons from "../components/MenuButtons";
import Cookies from "universal-cookie";
import { Base64 } from "js-base64";
const cookie = new Cookies();

export default function EmployeesStatistics() {
    
    let data = [];
    let page_number = 1;
    let page_size = 5
    let username = Base64.decode(cookie.get("$"));
    let password = Base64.decode(cookie.get("#"))
    let role = Base64.decode(cookie.get("@"));
    let id = cookie.get("id")

    const changePage = async (type, e) => {
        if(type === "improve"){
            page_number += 1;
            await Click(e);
        }
        else{
            if(page_number > 1){
                page_number -= 1;
                await Click(e);
            }
        }
    }

    const Click = async (e) => {
        e.preventDefault();
        document.querySelector(".alert").innerHTML = ""
        
        let first_date = document.querySelector("#first_date").value;
        let last_date = document.querySelector("#last_date").value;
        let action_type = document.querySelector("#action_type").value;
        let emp_id = document.querySelector("#emp_id").value;

        let myData;
        let result;
        let t = 1;

        if(role === "super"){
            if(first_date && last_date && action_type && emp_id){
            
                emp_id = parseInt(emp_id);
    
                myData = {
                    first_date: `${first_date}`,
                    last_date: `${last_date}`,
                    act_type: `${action_type}`,
                    emp_id: `${emp_id}`
                }
    
                result = await fetch(`${url}/api/one_later_early`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Basic ${Base64.encode(`${username}:${password}`)}`
                    },
                    body: JSON.stringify(myData)
                })
                
                result = await result.text() 
    
                if(result.length > 0){
                    data = GetEmployees(result, result.split("\n").length - 1);
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
                
            }else if(first_date && last_date && action_type ){
                myData = {
                    first_date: `${first_date}`,
                    last_date: `${last_date}`,
                    act_type: `${action_type}`,
                    page_number: `${page_number}`,
                    page_size: 4
                }
                result = await fetch(`${url}/api/later_early`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Basic ${Base64.encode(`${username}:${password}`)}`
                    },
                    body: JSON.stringify(myData)
                })
                
                result = await result.text()
                data = GetEmployees(result, result.split("\n").length - 1);
                
    
                if(data){
                    document.querySelector(".tbody").innerHTML = "";
                        for(let i = 1; i < result.split("\n").length; i++){
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
            else{
                alert("first date and last_date and action_type must fill")
            }
        }else if(role === "admin"){
            let my = {
                id: id
            }

            let emp = await fetch(`${url}/api/find_by_id`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${Base64.encode(`${username}:${password}`)}`,
                },
                body: JSON.stringify(my)
            })

            emp = await emp.json();

            let d_id = emp.department_id;

            if(first_date && last_date && action_type && emp_id){

            }
            else if(first_date && last_date && action_type){
                myData = {
                    first_date: first_date,
                    last_date: last_date,
                    act_type: action_type,
                    d_id: d_id,
                    page_number: page_number,
                    page_size: page_size
                }

                result = await fetch(`${url}/api/get_statistics_by_department`,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Basic ${Base64.encode(`${username}:${password}`)}`,
                    },
                    body: JSON.stringify(myData)
                })

                result = await result.text();

                data = GetEmployees(result, result.split("\n").length - 1);
                
    
                if(data){
                    document.querySelector(".tbody").innerHTML = "";
                        for(let i = 1; i < result.split("\n").length; i++){
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
        }

    }    
    return(
            <>
            <MenuButtons />
            <div>
                <p className="employees">Статистика сотрудников</p>

                <form className="change_form">
                    <AiFillStar className="star" />
                    <input type="text" placeholder="Введите первую дату" id="first_date" className="emp_input"/>
                    <AiFillStar className="star" />
                    <input type="text" placeholder="Введите последнюю дату" id="last_date" className="emp_input"/>
                    <AiFillStar className="star" />
                    <select  id="action_type" className="emp_input emp_select">
                        <option value="late">опоздал</option>
                        <option value="early" >Пошел рано</option>
                    </select>
                    <input type="text" placeholder="идентификатор сотрудника" id="emp_id" className="emp_input optional"/>
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
                <div className="pages">
                    <button className="previous btn" onClick={(e) => changePage("decrease", e)}>Назад</button>
                    <button className="next btn" onClick={(e) => changePage("improve", e)}>Следующий</button>
                </div>
            </div>
            </>
            
    )
}