# API Documentation:

- **Client App** <br />
  [Link](https://terreleeviolin.netlify.com)

  [Repo](https://github.com/cpark99/terre-lee-violin-app)

---

- **Base URL** <br />
  _https://pacific-tor-73483.herokuapp.com/api_

- **CORS** <br />
  NO<br />

## Login

Returns authentication token and json data for a registered user

- **URL** <br />
  _/auth/login_

- **Method** <br />
  `POST`

- **Headers** <br />

  ```javascript
    {
       "content-type": "application/json"
    }
  ```

- **URL Params**

  ##### Required:

  None

- **Data Params**

  ##### Required:

  ```javascript
    {
      "email": "(string)",
      "password": "(string)"
    }
  ```

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```javascript
      {
        "authToken": "xxxxx.yyyyy.zzzzz",
        "payload": { user_id: 1}
      }
    ```

- **Error Response:**

  - **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error: "Missing '${key}' in request body" }`

    OR

  - **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error: "Incorrect email or password" }`

- **Sample Call:**

  ```javascript
  const credentials = {
    email: 'demo@test.com',
    password: 'pa$$W0rd'
  };

  fetch(`${config.API_ENDPOINT}/auth/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }).then(res => (!res.ok ? res.json().then(e => Promise.reject(e)) : res.json()));
  ```

---

## Show user id

Returns json data about the authorized user for an authorized request

- **URL** <br />
  _/auth_

- **Method** <br />
  `GET`

- **Headers** <br />

  ```javascript
    {
       authorization: `bearer xxxxx.yyyyy.zzzzz`,
      "Content-Type": "application/json"
    }
  ```

- **URL Params**

  ##### Required:

  None

- **Data Params**

  ##### Required:

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    `{"id":1}`

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error: "Missing bearer token" }`

    OR

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error: "Unauthorized request" }`

- **Sample Call:**
  ```javascript
  fetch(`${config.API_ENDPOINT}/auth`, {
    headers: {
      authorization: `bearer xxxxx.yyyyy.zzzzz`,
      'Content-Type': 'application/json'
    }
  }).then(res => (!res.ok ? res.json().then(e => Promise.reject(e)) : res.json()));
  ```

## Submit New Student Application

---

Returns json data about the submitted application for prospective student

- **URL** <br />
  _/applications_

- **Method** <br />
  `POST`

- **Headers** <br />

  ```javascript
    {
       "content-type": "application/json"
    }
  ```

- **URL Params**

  ##### Required:

  None

- **Data Params**

  ##### Required:

  ```javascript
    {
      "email": "(string)",
      "name": "(string)",
      "phone": "(string)"
    }
  ```

  ##### Optional:

  ```javascript
    {
      "message": "(string)"
    }
  ```

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    ```javascript
      {
        "id": 1,
        "name": "Jane Doe",
        "email": "violinlover@demo.com",
        "phone": "2131234567",
        "message": "I've always wanted to learn!",
        "date_created": "2019-09-06T16:52:33.955Z"
      }
    ```

- **Error Response:**

  - **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error: "Missing '${key}' in request body" }`

- **Sample Call:**

  ```javascript
  const application = {
    email: 'violinlover@test.com',
    name: 'Jane Doe',
    phone: '2131234567',
    message: ''
  };

  fetch(`${config.API_ENDPOINT}/users`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(user)
  }).then(res => (!res.ok ? res.json().then(e => Promise.reject(e)) : res.json()));
  ```

---

## Show user profile

Returns json data about the authorized user for an authorized request

- **URL** <br />
  _/users/:id_

- **Method** <br />
  `GET`

- **Headers** <br />

  ```javascript
    {
       authorization: `bearer xxxxx.yyyyy.zzzzz`,
      "Content-Type": "application/json"
    }
  ```

- **URL Params**

  ##### Required:

  `id=[integer]`

- **Data Params**

  ##### Required:

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```javascript
      {
        "id": 1,
        "name": "Jane Doe",
        "email": "violinlover@demo.com",
        "next_lesson": "10/1/2019",
        "amount_due": "40",
        "date_created": "2019-09-06T16:52:33.955Z"
      }
    ```

- **Error Response:**

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error: "Missing bearer token" }`

    OR

  - **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error: "Unauthorized request" }`

    OR

  - **Code:** 404 NOT FOUND <br />
    **Content:** `{ error: "user doesn't exist" }`

- **Sample Call:**

  ```javascript
  const userId = 1;

  fetch(`${config.API_ENDPOINT}/users/${userId}`, {
    headers: {
      authorization: `bearer ${TokenService.getAuthToken()}`
    }
  }).then(res => (!res.ok ? res.json().then(e => Promise.reject(e)) : res.json()));
  ```

---
