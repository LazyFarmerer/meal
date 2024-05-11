import {} from "https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js";
import {} from "https://www.gstatic.com/firebasejs/8.6.5/firebase-firestore.js";
import {} from "https://www.gstatic.com/firebasejs/8.6.5/firebase-storage.js";

import {Database} from "./database.js"
import {FileData} from "./fileData.js?1"

const firebaseConfig = {
    apiKey: "AIzaSyDMP8XLvpBjwZRVoTK1ppXZvlaEipFdMqU",
    authDomain: "meal-menu-51338.firebaseapp.com",
    projectId: "meal-menu-51338",
    storageBucket: "meal-menu-51338.appspot.com",
    messagingSenderId: "417673889236",
    appId: "1:417673889236:web:b493764cdb8ea5b6148241"
};
firebase.initializeApp(firebaseConfig);
let restart = 3;


const db = new Database();
const data = await db.get();
const fileData = new FileData();
getData().then();







async function getData() {
    showLoadingIndicator(true);

    showImage(data.blog_photo_url, data.post_title, data.high_quality_url);

    // 시간 체크하고 특정시간(5시간) 지났다면 다시 호출
    if (5 < diffTime(data.time.seconds)) {
        console.log(`${5}시간이 지나서 구글api 호출`);
        const response = await fetch("https://script.google.com/macros/s/AKfycbwNr8wvP0T1L5JSMOGSyM0p54BiM0eh0zRpWa_Yna_Rt-_4OUXN9MMtUTvFjlhC2kU3/exec")
            .then((response) => response.json());
        console.log(data.post_title === response.post_title);
        if (data.post_title === response.post_title) { // 같으면 그냥 조기종료
            showLoadingIndicator(false);
            db.update({
                "time": new Date(),
            });
            return;
        }

        console.log("이거 실행");
        fileData.child("blog_photo").child("menu")
        .setImage(response.base64.base64EncodedImage, response.base64.contentType, response.post_title)
        .onSuccess(async (url) => {
            // 이정도 까지 왔으면 다시 재실행
            db.update({
                "time": new Date(),
                "post_title": response.post_title,
            });
            restart--;
            if (0 < restart) {
                await getData();
            }
            showLoadingIndicator(false);
        })
        .upload();
    } else {
        showLoadingIndicator(false);
    }
}

/**
 * 올린 이미지를 저장
 */
document.getElementsByTagName("form")[0].addEventListener("submit", (event) => {
    event.preventDefault(); // 새로고침 방지
    const imageFile = document.getElementById("imageFile");
    document.getElementById("showFileImage").innerHTML = loadingIndicator("업로드 중... 학교 ㅋㅋㅋ");
    
    fileData.child("personal_photo").child("menu")
    .setImage(imageFile.files[0])
    .onSuccess((url) => {
        console.log(url);
        imageFile.value = '';
        document.getElementById("showFileImage").innerHTML = "이미지 전송 완료!";
    })
    .upload();
});

document.querySelector('input[role="switch"]').addEventListener("click", (event) => {
    const element = event.target;
    const isCheck = element.getAttribute("aria-checked");
    switch (isCheck) {
        case "true":
            showImage(data.blog_photo_url, data.post_title, data.high_quality_url);
            element.setAttribute("aria-checked", "false");
            break;
        case "false":
            showImage(data.personal_photo_url);
            element.setAttribute("aria-checked", "true");
            break;
    }
})

function showImage(url = null, title = "") {
    const dataInput = document.getElementById("dataInput");
    if (url == null) {
        dataInput.innerHTML = loadingIndicator();
        return;
    }
    dataInput.innerHTML = `
    <figure>
    <figcaption>${title}</figcaption>
    <a href="${url}" target="_blank">
        <img src="${url}"></img>
    </a>
    </figure>
    `;
}

document.getElementById("imageFile").addEventListener("change", (event) => {
    const showResult = document.getElementById("showFileImage");
    var reader = new FileReader();
    reader.onload = function(event) {
        showResult.innerHTML = `<img src="${event.target.result}" />`;
    }
    reader.readAsDataURL(event.target.files[0]);
});

/**
 * 상단에 로딩창 보여줄지 말지 표시하는 함수
 * @param {boolean} isLoading 
 */
function showLoadingIndicator(isLoading) {
    const loading = document.getElementById("loadingIndicator");
    if (isLoading) {
        loading.innerHTML = loadingIndicator("로딩중... 학교 ㅋㅋㅋ");
        return;
    }
    loading.innerHTML = "";
}

/**
 * 시간을 넘겨받아 현재시간으로부터 얼마나 흘렀는지
 * 
 * 기준은 시간
 * @param {Number} time 
 * @returns {Number} time
 */
function diffTime(time) {
    // 시간 체크하고 특정시간(5시간) 지났다면 다시 호출
    const now = new Date().getTime() / 1000;
    return (now - time) / (60*60);
}

/**
 * 로딩중 표시
 * @returns {string} 로딩중 표시
 */
function loadingIndicator(text = "") {
    return `<article aria-busy="true">${text}</article>`;
}