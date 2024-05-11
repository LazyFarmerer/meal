import {Data} from "./data.js"

export class Database {
    #db;

    constructor() {
        this.#db =  firebase.firestore();
    }

    /**
     * 데이터 가져옴
     * @returns {Promise<Data>} 딕셔너리
     */
    async get() {
        const doc = await this.#db.collection("photo").doc("meal_photo").get();
        const data = new Data(doc.data());
        return data;
    }

    /**
     * 정보를 저장함
     * @param {object} dic 
     */
    update(dic) {
        this.#db.collection("photo").doc("meal_photo").update(dic)
        .then(() => {
            // console.log(`성공`);
        })
        .catch((err) => {
            // console.log(`오류: ${err}`);
        });
    }

}