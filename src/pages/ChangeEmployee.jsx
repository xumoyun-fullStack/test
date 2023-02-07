import React from "react";
import MenuButtons from "../components/MenuButtons";
import Cookies from "universal-cookie";
import { Base64 } from "js-base64";
import url from "../source";
const cookie = new Cookies();

export default function ChangeEmployee(){

    let user = Base64.decode(cookie.get("$"));
    let pass = Base64.decode(cookie.get("#"));


    const Click = async (e) => {
        e.preventDefault();

        let department_id = parseInt(document.querySelector("#departments").value);
        let job_id = parseInt(document.querySelector("#jobs").value);
        let role;
        
            if(job_id < 4){
                role = "super";
            }else if(job_id > 3 && job_id < 7){
                role = "admin"
            }else{
                role = "user"
            }

            let id = window.location.href
            id = id.split("/")[4];
            id = parseInt(id);

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

            let myData ;
            
                myData = {
                    emp_id: id,
                    d_id: department_id,
                    j_id: job_id,
                    role: role
                }
                let result2 = await fetch(`${url}/api/change_employee_work`,{
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json",
                        "Authorization": `Basic ${Base64.encode(`${user}:${pass}`)}`
                    },
                    body: JSON.stringify(myData)
                })

                result2 = await result2.text();

                
                if(result2 === "done"){
                    alert("Успешно изменено!")
            
                    await fetch(`${url}/api/send_mail`,{
                        method: "POST",
                        headers:{
                            "Content-Type": "application/json",
                            "Authorization": `Basic ${Base64.encode(`${user}:${pass}`)}`
                        },
                        body: JSON.stringify({
                            to_email: email,
                            text: "Ваша позиция изменена!",
                            subject: "fido-biznes"
                        })
                    })         
                    
                }else{
                    console.log("something wrong")
                }              

        }
        
    
    return(
        <>
            <MenuButtons />

            <p className="employees">Сменить сотрудника</p>

            <form className="add_form">
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
                <button className="btn  add_btn" onClick={(e) => Click(e)}>Добавить</button>  
            </form>
        </>
    )
}