export default function GetEmployees(data, page_size){
    data = data.split("\n");

    for(let i = 1; i <= page_size; i++){
        data[i] = data[i].slice(1);
        data[i] = data[i].slice(0, data[i].length - 1);
        data[i] = data[i].split(",");

        for(let j = 0; j < 6; j++){
            data[i][j] = data[i][j].replaceAll('"', "");
            if(j === 3){
                data[i][j] = data[i][j].split("e:")
                data[i][j][1] = data[i][j][1].split("T")[1];
            }else{
                data[i][j] = data[i][j].split(":")
            }
        }
    }

    return data;

}