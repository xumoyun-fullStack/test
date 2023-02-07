import React, { useEffect, useState } from "react";
import url from "../source";
import MenuButtons from "../components/MenuButtons";
import { Base64 } from "js-base64";
import Cookies from "universal-cookie";
import GetWorkTimes from "../components/getWorkTimes"
const cookie = new Cookies();

export default function Employees(){
    
    let page_number = 1;
    let page_size = 5;
    let user = Base64.decode(cookie.get("$"))
    let pass = Base64.decode(cookie.get("#"))
    let role = Base64.decode(cookie.get("@"));
    let s = 1;    

    const [search, setSearch] = useState("");
    const [result, setResult] = useState([]);

    const SearchName = async (value) => {

       if(value.length > 1){
        let myData = {
            page_number: page_number,
            page_size: page_size,
            n : `${value}`                 
        }
        setSearch(value);
        let res = await fetch(`${url}/api/get_by_name`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Base64.encode(`${user}:${pass}`)}`
            },
            body: JSON.stringify(myData)
        })

        if(!res){
            setResult("");
            return;
        }
        res = await res.json();

        setResult(res) 
       }   else{
        setSearch("")
        setResult("");
       }  
                 
    }

    useEffect((e) => function(){
        Load();    
    },[search])

    const Load = async () =>{
        s = 1;
        
        let myData = {}
        let result;

            myData = {
                page_number: page_number,
                page_size: page_size
            }
             result = await fetch(`${url}/api/all`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${Base64.encode(`${user}:${pass}`)}`,
                },
                
                body: JSON.stringify(myData)
            })
        
        result = await result.text();
        result = GetWorkTimes(result, page_size);
       
        document.querySelector("tbody").innerHTML = "";

        let t = 1;
        for(let i = 1; i < result.length ;i++){
               let id = result[i][0];
                document.querySelector("tbody").innerHTML += `
                    <tr>
                        <th>${t++}</th>
                        <td>${result[i][0]}</td>
                        <td>${result[i][1]}</td>
                        <td>${result[i][2]}</td>
                        <td>${result[i][3]}</td>
                        <td>${result[i][4]}</td>
                        <td>${result[i][5]}</td>
                        ${role === "super" ? `<td class="td"><a href=${`/employee/${id}` }>Редактировать</a></td>` : ""}
                    </tr>
                `       
        } 

    } 

    const SendRequest = async (myData, link) => {
        let result = await fetch(`${url}/api/${link}`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${Base64.encode(`${user}:${pass}`)}`
            },
            body: JSON.stringify(myData)
        })

        result = await result.text();

        result = GetWorkTimes(result, page_size);

        document.querySelector("tbody").innerHTML = "";

        let t = 1;
        for(let i = 1; i < result.length ;i++){
               let id = result[i][0];
                document.querySelector("tbody").innerHTML += `
                    <tr>
                        <th>${t++}</th>
                        <td>${result[i][0]}</td>
                        <td>${result[i][1]}</td>
                        <td>${result[i][2]}</td>
                        <td>${result[i][3]}</td>
                        <td>${result[i][4]}</td>
                        <td>${result[i][5]}</td>
                        ${role === "super" ? `<td class="td"><a href=${`/employee/${id}`}>Редактировать</a></td>` : ""}
                    </tr>
                `       
        }

        if(result.length === 1) document.querySelector(".alert").innerHTML = "данные не найдены";
    }
     
    const Click = async (e) => {
            e.preventDefault();
            setSearch("")
            
            document.querySelector(".alert").innerHTML = "";
            s = 2;
        
            let name = document.querySelector("#name").value;
            let d_name = document.querySelector("#departments").value;
            let j_name = document.querySelector("#jobs").value;                   
            
            if(name.length === 0 && d_name === "0" && j_name === "0"){            
                window.open("/employees", "_self")            
                return;
            }else if(name.length > 0 && d_name === "0" && j_name === "0"){

                let myData = {
                    page_number: page_number,
                    page_size: page_size,
                    n : `${name}`
                }

                let res = await fetch(`${url}/api/get_by_name`,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Basic ${Base64.encode(`${user}:${pass}`)}`
                    },
                    body: JSON.stringify(myData)
                })
        
                res = await res.json();
                console.log(res)
                let t = 1;
                document.querySelector("tbody").innerHTML = "";
        for(let i = 0; i < res.length ;i++){
               let id = res[i].id;
                document.querySelector("tbody").innerHTML += `
                    <tr>
                        <th>${t++}</th>
                        <td>${res[i].id}</td>
                        <td>${res[i].name}</td>
                        <td>${res[i].last_name}</td>
                        <td>${res[i].department_name}</td>
                        <td>${res[i].job_name}</td>
                        <td>${res[i].email}</td>
                        ${role === "super" ? `<td class="td"><a href=${`/employee/${id}`}>Редактировать</a></td>` : ""}
                    </tr>
                `       
        }
            }
          else if(name.length === 0 && d_name !== "0" && j_name !== "0"){
                let myData = {
                    page_number: page_number,
                    page_size: page_size,
                    d_name: `${d_name}`,
                    j_name: `${j_name}`
                }

                SendRequest(myData, "get_by_department_and_job")
            }else if(name.length === 0 && d_name !== "0" && j_name === "0"){
                let myData = {
                    page_number: page_number,
                    page_size: page_size,
                    d_name: `${d_name}`
                }

                SendRequest(myData, "get_by_department");

            }else if(name.length === 0 && d_name === "0" && j_name !== "0"){
                let myData = {
                    page_number: page_number,
                    page_size: page_size,
                    j_name: `${j_name}`
                }

                SendRequest(myData, "get_by_job");
                
            }
    }; 

    const changePage = async (type, e) => {
        e.preventDefault();

        if(type === "improve"){
            page_number += 1;
           s === 1 ? Load() : Click(e);
        }
        else{
           
            if(page_number > 1){
                page_number -= 1;     
                s === 1 ? Load() : Click(e);     
                
            }
        }
    }

    const getValue = (e, val) => {
        console.log(val)
        document.querySelector("#name").value = val;
        setSearch("");
    }
         
        return(    
        <> 
        <MenuButtons />
        <p className="employees">Список сотрудников</p>

            <div className="employees_div">          
            
                <div className="search_bar">  
                    <span>
                        <input type="text" placeholder="Введите имя" id="name" className="emp_input" onChange={(e) => SearchName(e.target.value)} />
                        <div className="results ">
                            {search === "" ? "" : result ? result?.map((el, index)=>{
                                return <li onClick={(e) => getValue(e, el.name)}key={index}>{el.name}</li>
                            }) : ""}
                        </div>
                    </span>                         
                    <select name="department" id="departments" className="emp_input add_select" >
                        <option value="0" >Departamentlar</option>
                        <option value="Mobile development">Mobile development</option>
                        <option value="Web services">Web services</option>
                        <option value="Xodimlar bo`limi">Xodimlar bo`limi</option>
                    </select>
                    <select name="department" id="jobs" className="emp_input add_select" required>
                        <option value="0">Ish</option>
                        <option value="Direktor">Direktor</option>
                        <option value="Direktor o`rinbosari">Direktor o`rinbosari</option>
                        <option value="3">HR</option>
                        <option value="Departament boshlig`i">Departament boshlig`i</option>
                        <option value="Departament boshlig`i o`rinbosari">Departament boshlig`i o`rinbosari</option>
                        <option value="Guruh rahbari">Guruh rahbari</option>
                        <option value="1-darajali dasturchi">1-darajali dasturchi</option>
                        <option value="2-darajali dasturchi">2-darajali dasturchi</option>
                        <option value="3-darajali dasturchi">3-darajali dasturchi</option>
                        <option value="amaliyotchi">amaliyotchi</option>
                    </select>
                    <button className="btn emp_input" onClick= {(e) =>  Click(e)}>Поиск</button>                    
                </div>
                
                <table className="table" border= "1px">
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Ид номер</th>
                        <th>Имя сотрудника</th>
                        <th>Фамилия сотрудника</th>
                        <th>Профессия</th>
                        <th>Департамент</th>
                        <th>Электронная почта</th>
                        {role === "super" ? <th>Редактировать</th> : ""}
                    </tr>
                    </thead>
                    <tbody>
                           
                    </tbody>               
                </table>
                <p className="alert"></p>
                <div className="pages">
                    <button className="btn" onClick={(e) => changePage("decrease", e)}>Назад</button>
                    <button className={`btn btn_emp ${role === "super" ? "ad_btn_visible": "ad_btn"}`} onClick={() => window.open("/add", "_self")}>Добавить сотрудника</button>
                    <button className=" btn"     onClick={(e) => changePage("improve", e)}>Следующий</button>
                </div>
            </div>
        </>         
        )  
}