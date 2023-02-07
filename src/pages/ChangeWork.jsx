import React from "react";
import { useEffect } from "react";
import url
 from "../source";
import GetWorkTimes from "../components/getWorkTimes";
import MenuButtons from "../components/MenuButtons";
import { Base64 } from "js-base64";
import Cookies from "universal-cookie";
const cookie = new Cookies();

export default function ChangeWork (){

    let page = 1;
    let username = Base64.decode(cookie.get("$"));
    let password = Base64.decode(cookie.get("#"));
    let id =  cookie.get("id");
    
    const Click = async (e)  =>{
        
        e.preventDefault();
        
        let arr_time = document.querySelector("#arrival_time").value;
        let ex_time = document.querySelector("#exit_time").value;

        if(arr_time === "") {
            alert("invalid");
            return;
        }
        const myData = {
            arr_time: `${arr_time}`,
            ex_time: `${ex_time}`,
            emp_id: id
        }
         
        let result = await fetch(`${url}/api/change_work_time`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Base64.encode(`${username}:${password}`)}`,
            },
            
            body: JSON.stringify(myData)
        });

        console.log(result)
        if(result.ok){
            alert("changed")
        }
        
    }

    useEffect(() => async function(){
        console.log(page)
        let myData = {
            page_number: page,
            page_size: 5
        }
        let result = await fetch(`${url}/api/work_times`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Base64.encode(`${username}:${password}`)}`,
            },
            
            body: JSON.stringify(myData)
        })

        result = await result.text();
        result = GetWorkTimes(result, 5);

        document.querySelector("tbody").innerHTML = "";
        let t = 1;
        for(let i = 1; i < result.length; i++){
            document.querySelector("tbody").innerHTML += 
            `<tr>
                <th>${t++}</th>
                <td>${result[i][0]}</td>
                <td>${result[i][1]}</td>
                <td>${result[i][2]}</td>
                <td>${result[i][3]}</td>
                <td>${result[i][4]}</td>
            </tr>`
        }
    })
    const Load = async() => {
        console.log(page)
        let myData = {
            page_number: page,
            page_size: 5
        }
        let result = await fetch(`${url}/api/work_times`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Base64.encode(`${username}:${password}`)}`,
            },
            body: JSON.stringify(myData)
        })

        result = await result.text();
        result = GetWorkTimes(result, 5);
        document.querySelector("tbody").innerHTML = "";
        let t = 1;
        for(let i = 1; i < result.length; i++){
            document.querySelector("tbody").innerHTML += 
            `<tr>
                <th>${t++}</th>
                <td>${result[i][0]}</td>
                <td>${result[i][1]}</td>
                <td>${result[i][2]}</td>
                <td>${result[i][3]}</td>
                <td>${result[i][4]}</td>
            </tr>`
        }
    }

    const changePage = async (type, e) => {
        
        if(type === "improve"){
             page += 1;
            Load()
        }
        else{
            if(page > 1){
                page -= 1;
                Load();
            }
        }
    }
    
    return(
            
            <>
          
          
                <MenuButtons />
                <div className="change_work_time">
                    <p className="employees">Изменить рабочее время</p>

                    <form className="change_form">
                        <input type="text" placeholder="Время прибытия" id = "arrival_time" className="change_work_input"/>
                        <input type="text" placeholder="Время выхода" id = "exit_time" className="change_work_input"/>
                        <button className="change_btn" onClick={(e) => Click(e)}>Изменить</button>
                    </form>
                    <table className="table">
                        
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Date</th>
                                    <th>Arrival time</th>
                                    <th>Exit time</th>
                                    <th>Modified data</th>
                                    <th>Modified by</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                    </table>
                <div className="pages">
                    <button className="previous btn" onClick={(e) => changePage("decrease", e)}>Назад</button>
                    <button className="next btn" onClick={(e) => changePage("improve", e)}>Следующий</button>
                </div>
                </div>
            </>
            
    )     
        
}