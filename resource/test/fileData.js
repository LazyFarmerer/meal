export class FileData {
    #storage = firebase.storage();
    #storageRef;
    #progressFunction = (snapshot) => {};
    #errorFunction = (error) => {};
    #successFunction = (url) => {};

    #imageData = null;
    #contentType = null;
    #post_title = null;

    constructor() {
        this.init();
    }

    init() {
        this.#storageRef = this.#storage.ref();
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

    upload(image) {
        let uploadimage;

        if (this.#contentType == null) {
            uploadimage = imagePath.put(image);
        } else {
            uploadimage = imagePath.putString(image, "base64url", { contentType: contentType });
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