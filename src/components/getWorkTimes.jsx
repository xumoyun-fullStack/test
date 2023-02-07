export default function GetWorkTimes(data, page_size){
    data = data.split("\n");

    for(let i = 1; i < data.length; i++){
        data[i] = data[i].split("#")
    }
    
    return data;
}
