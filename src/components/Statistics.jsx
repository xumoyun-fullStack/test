import React from "react";

export default function Statatistics({data}){
    return(
        <div>
            {data.array.forEach(element => {
                element.array.forEach(el => {
                    console.log(el[1]);
                });
            })}
        </div>
    )
}