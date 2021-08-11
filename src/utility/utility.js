import Pusher from "pusher-js";
import { v1 } from "uuid";

export const getFileName = (filename) => {

    const extension = filename.split('.').pop();

    const newFileName = v1() + Date.now() + '.' + extension;

    return newFileName;
}


export const getWindowSizeInteger = windowWidth => {
    let widthInteger;
    if (windowWidth > 0 && windowWidth < 600) widthInteger = 1; //mobile
    if (windowWidth >= 600 && windowWidth < 1200) widthInteger = 2; //tablet
    if (windowWidth >= 1200 && windowWidth < 2560) widthInteger = 3; //desktop 1080
    if (windowWidth >= 2560 && windowWidth < 3840) widthInteger = 4; //2k
    if (windowWidth >= 3840) widthInteger = 5; //4k
    return widthInteger;
};




export let AppUrl = 'http://localhost:8000/';
// export let AppUrl = 'https://stormy-forest-71570.herokuapp.com/';
// if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
//     // AppUrl = 'http://localhost:8000/';
//     AppUrl = 'https://stormy-forest-71570.herokuapp.com/';
// }

export const getPusher = () => {
    const pusherKey = '540ea742ac9e8d6d5157';
    const pusherCluster = 'us2'

    const pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
    });
    return pusher;
}