# Nodejs Backend REST API

Project ini dibangun pada saat mengikuti online course dari Udemy </br>
https://www.udemy.com/course/nodejs-the-complete-guide/

## Web Stack

- Node.js
- Express
- MongoDB Atlas

## Live Preview

Frontend yang menggunakan backend ini telah di deploy ke [github pages](https://pages.github.com/) dan dapat diakses melalui link berikut <br/>
https://abdjahiduddin.github.io/frontend-nodejs-rest-api/
Sedangkan backend ini telah dideploy di [heroku](https://www.heroku.com/) <br/>
https://message-restapi.herokuapp.com/

Anda dapat membuat akun baru atau login menggunakan user berikut<br/>
user: john.doe@test.com <br/>
pass: 123456

## Fitur

- Login dan Signup
- Proses authentikasi menggunakan JWT
- Menampilkan daftar feed
- Menampilkan detail dari sebuah feed
- User dapat menambahkan, menghapus, dan mengubah sebuah feed

## REST API

#### Membuat user baru

```javascript
Endpoint : /auth/signup
Method   : PUT
Request  : {
    email: "email",
    password: "password",
    name: "username",
}
Response : {
    message: "User created",
    data: "User id",
}
```

#### Login

```javascript
Endpoint : /auth/login
Method   : POST
Request  : {
    email: "email",
    password: "password",
}
Response : {
    token: "JWT Token",
    userId: "User id",
}
```

#### Request status user

```javascript
Endpoint : /auth/status
Method   : GET
Response : {
    status: "Status",
}
```

#### Mengubah status user

```javascript
Endpoint : /auth/status
Method   : PUT
Request  : {
    status: "Status baru"
}
Response : {
    message: "Status updated",
}
```

#### Request seluruh feeds

```javascript
Endpoint : /feed/posts
Method   : GET
Response : {
    message: "Fetched all posts successfully",
    posts: "Seluruh feed yang tersedia",
    totalItems: "Total feed yang tersedia",
}
```

#### Membuat feed baru

```javascript
Endpoint : /feed/post
Method   : POST
Request  : {
    title: "Judul feed",
    content: "Deskripsi feed",
    image: "Gambar feed"
}
Response : {
    message: "Post created successfully!",
    post: "feed yang berhasil disimpan",
    creator: "User id",
}
```

#### Menampilkan detail feed tertentu

```javascript
Endpoint : /feed/post/:postId
Method   : GET
Response : {
    message: "Data found",
    post: "Detail feed",
}
```

#### Mengedit feed tertentu

```javascript
Endpoint : /feed/post/:postId
Method   : PUT
Request  : {
    title: "Judul feed",
    content: "Deskripsi feed",
    image: "Gambar feed"
}
Response : {
    message: "Post updated",
    post: "Feed yang telah diedit",
}
```

#### Menghapus feed tertentu

```javascript
Endpoint : /feed/post/:postId
Method   : DELETE
Response :{
    message: "File deleted",
}
```