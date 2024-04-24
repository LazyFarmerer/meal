let restart = 1;

getData().then();





async function getData() {
    showLoadingIndicator(true);
    await data.get();

    showImage(data.blog_photo_url, data.post_title);

    // 시간 체크하고 특정시간(5시간) 지났다면 다시 호출
    if (5 < diffTime(data.time.seconds)) {
        console.log(`${5}시간이 지나서 구글api 호출`)
        const response = await fetch("https://script.google.com/macros/s/AKfycbwNr8wvP0T1L5JSMOGSyM0p54BiM0eh0zRpWa_Yna_Rt-_4OUXN9MMtUTvFjlhC2kU3/exec")
            .then((response) => response.json());
        console.log(data.post_title === response.post_title);
        if (data.post_title === response.post_title) { // 같으면 그냥 조기종료
            showLoadingIndicator(false);
            data.update({
                "time": new Date(),
            });
            return;
        }

        data.uploadBase64File(response.base64.base64EncodedImage, response.base64.contentType, response.post_title);
        // 이정도 까지 왔으면 다시 재실행
        restart--;
        if (0 < restart) {
            await getData();
        }
    }

    showLoadingIndicator(false);
}

/**
 * 올린 이미지를 저장
 */
function submitMealImageFile(event) {
    event.preventDefault(); // 새로고침 방지
    const imageFile = document.getElementById("imageFile");
    document.getElementById("showFileImage").innerHTML = loadingIndicator("업로드 중... 학교 ㅋㅋㅋ");

    data.uploadImageFile(imageFile.files[0], (url) => {
        console.log(url);
        imageFile.value = '';
        document.getElementById("showFileImage").innerHTML = "이미지 전송 완료!";
    });

}

function switchEvent(event) {
    const element = event.target;
    const isCheck = element.getAttribute("aria-checked");
    switch (isCheck) {
        case "true":
            showImage(data.blog_photo_url, data.post_title);
            element.setAttribute("aria-checked", "false");
            break;
        case "false":
            showImage(data.personal_photo_url);
            element.setAttribute("aria-checked", "true");
            break;
    }
}

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

function showFileImage(event) {
    const showResult = document.getElementById("showFileImage");
    var reader = new FileReader();
    reader.onload = function(event) {
        // var img = document.createElement("img");
        // img.setAttribute("src", event.target.result);
        // document.querySelector("div#showFileImage").appendChild(img);
        // console.log(event.target.result);
        showResult.innerHTML = `<img src="${event.target.result}" />`;
    }
    reader.readAsDataURL(event.target.files[0]);
}

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