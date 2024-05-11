export class FileData {
    #storageRef;
    #progressFunction = (snapshot) => {};
    #errorFunction = (error) => {};
    #successFunction = (url) => {};

    #imageData;
    #contentType;
    #post_title;

    constructor() {
        this.init();
    }

    init() {
        const storage = firebase.storage();
        this.#storageRef = storage.ref();
        this.#imageData = null;
        this.#contentType = null;
        this.#post_title = null;
    }

    child(path) {
        this.#storageRef.child(path);
        return this;
    }

    setImage(imageData, contentType = null, post_title = null) {
        this.#imageData = imageData;
        this.#contentType = contentType;
        this.#post_title = post_title;
        return this;
    }

    upload() {
        let uploadimage;

        const imagePath = this.#storageRef;

        if (this.#contentType == null) {
            uploadimage = imagePath.put(this.#imageData);
        } else {
            uploadimage = imagePath.putString(this.#imageData, "base64url", { contentType: this.#contentType });
        }

        uploadimage.on("state_changed",
            this.#progressFunction(snapshot),
            this.#errorFunction(error),
            () => {
                uploadimage.snapshot.ref.getDownloadURL().then((url) => {
                    this.#successFunction(url);
                });
            }
        );

        this.init();
        return this;
    }

    onProgress(func) {
        this.#progressFunction = func;
        return this;
    }
    onError(func) {
        this.#errorFunction = func;
        return this;
    }
    onSuccess(func) {
        this.#successFunction = func;
        return this;
    }
}