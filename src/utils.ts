
export const random = (data:number)=>{
    let options = "qwertyuioasdfghjklzxcvbnm12345678";
    let length = options.length;

    let ans = "";

    for (let i = 0; i < data; i++) {
        ans += options[Math.floor((Math.random() * length))] // 0 => 20
    }

    return ans;
}