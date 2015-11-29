(function(global) {
    var module = {};

    // our google apps ID
    var CLIENT_ID = '780199501376-q7dm26lauueljp43upe0jdt6jje5s255.apps.googleusercontent.com';
    // required permissions
    var SCOPES = ['https://www.googleapis.com/auth/drive'];

    /**
     * Load the password file's content.
     *
     * The Google Drive API is automatically loaded and authorized.
     * The password's file must be named <code>passwords.shadow</code> and only
     * the first one found is retrieved.
     *
     * @return {Promise} Promise for the file's content.
     */
    module.load = function() {
        // authorize app with google drive
        return gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES})
        // load google drive api
        .then(function() {
            return gapi.client.load('drive', 'v2');
        // find the file named 'passwords.shadow'
        }).then(function() {
            var request = gapi.client.drive.files.list({
                q: "title = 'passwords.shadow'",
                fields: 'items(id,title)',
                immediate: true,
            });
            return new Promise(function(resolve, reject) {
                request.execute(resolve);
            });
        // read the file content
        }).then(function(response) {
            return new Promise(function(resolve, reject) {
                var accessToken = gapi.auth.getToken().access_token;
                var fileId = response.items[0].id;
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://www.googleapis.com/drive/v2/files/'+fileId+'?alt=media');
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
                xhr.onload = function() {
                    resolve(xhr.responseText);
                };
                xhr.send();
            });
        });
    };

    global.gdrive = module;
})(this);
