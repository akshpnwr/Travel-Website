export const uploadImage = async (imageFile) => {
    return new Promise((resolve, reject) => {
        const storageRef = storage.ref();
        const uploadTask = storageRef.child('images/' + imageFile.name).put(imageFile);

        uploadTask.on('state_changed', function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, function (error) {
            console.log('Upload failed:', error);
            reject(error);
        }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log('File available at', downloadURL);
                resolve(downloadURL);
            });
        });
    });
}