
export class Data {
    #data;

    /**
     * 정보를 저장해두고 사용하는 클래스
     * @param {Object} jsonData 
     */
    constructor(jsonData) {
        this.#data = jsonData;
    }


    get is_blog() { return this.#data.is_blog; }
    set is_blog(value) {}
    get post_title() { return this.#data.post_title; }
    set post_title(value) {}
    get blog_photo_url() { return this.#data.blog_photo_url; }
    set blog_photo_url(value) {}
    get personal_photo_url() { return this.#data.personal_photo_url; }
    set personal_photo_url(value) {}
    get time() { return this.#data.time; }
    set time(value) {}
    get index() { return this.#data.index; }
    set index(value) {}
    get user_time() { return this.#data.user_time; }
    set user_time(value) {}
}