import {} from "https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js";
import {} from "https://www.gstatic.com/firebasejs/8.6.5/firebase-firestore.js";
import {} from "https://www.gstatic.com/firebasejs/8.6.5/firebase-storage.js";

import {Database} from "../resource/component/database.js"
import {FileData} from "../resource/component/fileData.js"

const firebaseConfig = {
    apiKey: "AIzaSyDMP8XLvpBjwZRVoTK1ppXZvlaEipFdMqU",
    authDomain: "meal-menu-51338.firebaseapp.com",
    projectId: "meal-menu-51338",
    storageBucket: "meal-menu-51338.appspot.com",
    messagingSenderId: "417673889236",
    appId: "1:417673889236:web:b493764cdb8ea5b6148241"
};
firebase.initializeApp(firebaseConfig);
let data;

const db = new Database();
const fileData = new FileData();

const index_box = document.getElementById("index_box");
const index_button = document.getElementById("index_button");


main().then()


async function main() {
    data = await db.get();
    index_box.value = data.index;
}

index_button.addEventListener("click", async function() {
    // 버튼 비활성화 & 로딩인디케이터
    showLoadingIndicator(true)
    index_button.disabled = true;
    const response = await fetch(`https://script.google.com/macros/s/AKfycbwNr8wvP0T1L5JSMOGSyM0p54BiM0eh0zRpWa_Yna_Rt-_4OUXN9MMtUTvFjlhC2kU3/exec?index=${index_box.value}`)
    .then((response) => response.json());

    fileData.child("blog_photo").child("menu")
    .setImage(response.base64.base64EncodedImage, response.base64.contentType, response.post_title)
    .onSuccess(async (url) => {
        console.log(url);
        db.update({
            "index": Number(index_box.value),
            "time": new Date(),
            "post_title": response.post_title,
        });
        showLoadingIndicator(false);
        index_button.disabled = false;
    })
    .upload();
});




/**
 * 상단에 로딩창 보여줄지 말지 표시하는 함수
 * @param {boolean} isLoading 
 */
function showLoadingIndicator(isLoading) {
    const loading = document.getElementById("loadingIndicator");
    if (isLoading) {
        loading.innerHTML = loadingIndicator("로딩중...");
        return;
    }
    loading.innerHTML = "";
}

/**
 * 로딩중 표시
 * @returns {string} 로딩중 표시
 */
function loadingIndicator(text = "") {
    return `<article aria-busy="true">${text}</article>`;
}