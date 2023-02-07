import React from "react";
import Cookies from "universal-cookie";
import { Base64 } from "js-base64";
import MenuButtons from "../components/MenuButtons";
import url from "../source";
const cookie = new Cookies();

export default function AddEmployee(){
    
    const Click = async (e) => {

        e.preventDefault();

        let name = document.querySelector("#name").value;
        let last_name = document.querySelector("#last_name").value;
        let department_id = parseInt(document.querySelector("#departments").value);
        let job_id =parseInt(document.querySelector("#jobs").value);
        let email = document.querySelector("#email").value;
        let username = document.querySelector("#username").value;
        let password = document.querySelector("#password").value;
        let role = "";

        if(name === "" || last_name === "" || username === "" || password === ""){
            alert("Все места должны быть заполнены!")
        }else{

            if(job_id < 4){
                role = "super";
            }else if(job_id > 3 && job_id < 7){
                role = "admin"
            }else{
                role = "user"
            }
    
            let user = Base64.decode(cookie.get("$"));
            let pass = Base64.decode(cookie.get("#"));
    
            let data = [];
    
            let header = new Headers();

            header.append("Authorization", `Basic ${Base64.encode(`${user}:${pass}`)}`)
    
            await fetch(`${url}/api/employees`, {
                headers:header, 
            }).then(res => res.json()).then(res => {
                data = res
            }).catch(err => {
                console.log("my ",err);
            })
          
            let id = data.length + 1;

            let myData = {
                id: `${id}`,
                name: `${name}`,
                last_name: `${last_name}`,
                department_id: `${department_id}`,
                job_id: `${job_id}`,
                username: `${username}`,
                password: `${password}`,
                role: `${role}`,
                email: email,
                is_verified: "no"
            }

            let subject = "fido-biznes";

            let text = `Вы приняты на работу в "fido-biznes", ваши логин и пароль: ${username} ${password}`

            await fetch(`${url}/api/send_mail`,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${Base64.encode(`${user}:${pass}`)}`
                },
                body: JSON.stringify({
                    to_email: email,
                    text: text,
                    subject: subject
                })
            }) 
    
            let result = await fetch(`${url}/api/employees`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${Base64.encode(`${user}:${pass}`)}`
                },
                body: JSON.stringify(myData)
            })
    
            if(result.ok){
                alert("Добавлен!")
            }
        }     
    }

    return(
        <>
            <MenuButtons />
            <p className="employees">Добавить сотрудников</p>
            <form className="add_form">
                <span>
                    <label htmlFor="name" className="">Имя</label>
                    <input type="text" id="name" className="emp_input add_input" required/>
                </span>
                <span>
                    <label htmlFor="last_name">Фамилия</label>
                    <input type="text" id="last_name" className="emp_input add_input" required/>
                </span>
                <span>
                    <label htmlFor="email">Электронная почта</label>
                    <input type="email" id="email" className="emp_input add_input" required/>
                </span>
                <span>
                    <label htmlFor="departments" className="">Департамент</label>
                    <select name="department" id="departments" className="emp_input add_select" required>
                        <option value="1">Mobile development</option>
                        <option value="2">Web services</option>
                        <option value="3">Xodimlar bo`limi</option>
                    </select>
                </span>
                <span>
                    <label htmlFor="jobs">Профессия</label>
                    <select name="department" id="jobs" className="emp_input add_select" required>
                        <option value="1">Direktor</option>
                        <option value="2">Direktor o`rinbosari</option>
                        <option value="3">HR</option>
                        <option value="4">Departament boshlig`i</option>
                        <option value="5">Departament boshlig`i o`rinbosari</option>
                        <option value="6">Guruh rahbari</option>
                        <option value="7">1-darajali dasturchi</option>
                        <option value="8">2-darajali dasturchi</option>
                        <option value="9">3-darajali dasturchi</option>
                        <option value="10">amaliyotchi</option>
                    </select>
                </span>
                <span>
                    <label htmlFor="username">имя пользовател</label>
                    <input type="text" id="username" className="emp_input add_input" required/>
                </span>
                <span>
                    <label htmlFor="password">пароль</label>
                    <input type="text" id="password" className="emp_input add_input" required/>
                </span>
                
                <button className="btn  add_btn" onClick={(e) => Click(e)}>Добавить</button>          
            </form>
        </>
    )
}