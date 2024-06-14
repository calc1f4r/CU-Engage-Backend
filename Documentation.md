## Documentation to use API

### Authentication API

## Register

| Description  |                        |
| ------------ | ---------------------- |
| **Endpoint** | `api/v1/auth/register` |
| **Method**   | `POST`                 |

### Parameters

| Name       | Type   | Required | Description              |
| ---------- | ------ | -------- | ------------------------ |
| `email`    | String | Yes      | The user's email address |
| `password` | String | Yes      | The user's password      |

### Responses

#### Success

| Code | Content                                                            |
| ---- | ------------------------------------------------------------------ |
| 201  | `{ message: "Registration successful! Welcome to our platform." }` |

#### Errors

| Code | Content                                        |
| ---- | ---------------------------------------------- |
| 400  | `{ error: "Email and password are required" }` |
| 409  | `{ error: "User already exists" }`             |
| 500  | `{ error: "Registration failed" }`             |

## Login

| Description  |                     |
| ------------ | ------------------- |
| **Endpoint** | `api/v1/auth/login` |
| **Method**   | `POST`              |

### Parameters

| Name       | Type   | Required | Description              |
| ---------- | ------ | -------- | ------------------------ |
| `email`    | String | Yes      | The user's email address |
| `password` | String | Yes      | The user's password      |

### Responses

#### Success

| Code | Content                                          |
| ---- | ------------------------------------------------ |
| 200  | `{ message: "Login successful! Welcome back." }` |

#### Errors

| Code | Content                                                                           |
| ---- | --------------------------------------------------------------------------------- |
| 400  | `{ error: "Email and password are required" }`                                    |
| 404  | `{ error: "User not found" }`                                                     |
| 403  | `{ error: "The password you entered is incorrect. Please check and try again." }` |
| 500  | `{ error: "Login failed" }`                                                       |

---

## Logout

| Description  |                      |
| ------------ | -------------------- |
| **Endpoint** | `api/v1/auth/logout` |
| **Method**   | `POST`               |

### Parameters

No parameters are required for this endpoint.

### Responses

#### Success

| Code | Content                            |
| ---- | ---------------------------------- |
| 200  | `{ message: "Logout successful" }` |

#### Errors

| Code | Content                      |
| ---- | ---------------------------- |
| 500  | `{ error: "Logout failed" }` |

> Note: A valid session token is required for this operation. The session token should be included in the `Cookie` header of the HTTP request.

## User API Usage Documentation

## Get Profile

| Description  |                   |
| ------------ | ----------------- |
| **Endpoint** | `api/v1/users/me` |
| **Method**   | `GET`             |

### Parameters

No parameters are required for this endpoint.

### Responses

#### Success

| Code | Content                                                           |
| ---- | ----------------------------------------------------------------- |
| 200  | `{ message: "Profile retrieved successfully", profile: { ... } }` |

#### Errors

| Code | Content                                 |
| ---- | --------------------------------------- |
| 401  | `{ error: "Unauthorized" }`             |
| 500  | `{ error: "Profile retrieval failed" }` |

> Note: A valid session token is required for this operation. The session token should be included in the `Cookie` header of the HTTP request.

---

## Get User by Username

| Description  |                           |
| ------------ | ------------------------- |
| **Endpoint** | `api/v1/users/@:username` |
| **Method**   | `GET`                     |

### Parameters

| Name       | Type   | Required | Description              |
| ---------- | ------ | -------- | ------------------------ |
| `username` | String | Yes      | The username of the user |

### Responses

#### Success

| Code | Content                                                     |
| ---- | ----------------------------------------------------------- |
| 200  | `{ message: "User retrieved successfully", user: { ... } }` |

#### Errors

| Code | Content                              |
| ---- | ------------------------------------ |
| 404  | `{ error: "User not found" }`        |
| 500  | `{ error: "User retrieval failed" }` |

> Note: A valid session token is required for this operation. The session token should be included in the `Cookie` header of the HTTP request.

#### Update User

**Endpoint:** `api/v1/users/me`

**Method:** `PATCH`

**Body:**

```json
{
  "username": "newUsername",
  "firstName": "newFirstName",
  "lastName": "newLastName",
  "avatar": "newAvatarURL",
  "bio": "newBio",
  "githubLink": "newGithubLink",
  "linkedinLink": "newLinkedinLink",
  "projects": ["newProject1", "newProject2"],
  "isFacility": false,
  "uid": "newUID",
  "eid": "newEID"
}
```

**Session:** Session token required

---

## Get Joined Clubs

| Description  |                                |
| ------------ | ------------------------------ |
| **Endpoint** | `api/v1/users/me/clubs/joined` |
| **Method**   | `GET`                          |

### Parameters

No parameters are required for this endpoint.

### Responses

#### Success

| Code | Content                                                              |
| ---- | -------------------------------------------------------------------- |
| 200  | `{ message: "Joined clubs retrieved successfully", clubs: [ ... ] }` |

#### Errors

| Code | Content                                      |
| ---- | -------------------------------------------- |
| 401  | `{ error: "Unauthorized" }`                  |
| 500  | `{ error: "Joined clubs retrieval failed" }` |

> Note: A valid session token is required for this operation. The session token should be included in the `Cookie` header of the HTTP request.

---

## Get Created Clubs

| Description  |                                 |
| ------------ | ------------------------------- |
| **Endpoint** | `api/v1/users/me/clubs/created` |
| **Method**   | `GET`                           |

### Parameters

No parameters are required for this endpoint.

### Responses

#### Success

| Code | Content                                                               |
| ---- | --------------------------------------------------------------------- |
| 200  | `{ message: "Created clubs retrieved successfully", clubs: [ ... ] }` |

#### Errors

| Code | Content                                       |
| ---- | --------------------------------------------- |
| 401  | `{ error: "Unauthorized" }`                   |
| 500  | `{ error: "Created clubs retrieval failed" }` |

> Note: A valid session token is required for this operation. The session token should be included in the `Cookie` header of the HTTP request.

---

## Get Joined Societies

| Description  |                                    |
| ------------ | ---------------------------------- |
| **Endpoint** | `api/v1/users/me/societies/joined` |
| **Method**   | `GET`                              |

### Parameters

No parameters are required for this endpoint.

### Responses

#### Success

| Code | Content                                                                      |
| ---- | ---------------------------------------------------------------------------- |
| 200  | `{ message: "Joined societies retrieved successfully", societies: [ ... ] }` |

#### Errors

| Code | Content                                          |
| ---- | ------------------------------------------------ |
| 401  | `{ error: "Unauthorized" }`                      |
| 500  | `{ error: "Joined societies retrieval failed" }` |

> Note: A valid session token is required for this operation. The session token should be included in the `Cookie` header of the HTTP request.

---

## Get Created Societies

| Description  |                                     |
| ------------ | ----------------------------------- |
| **Endpoint** | `api/v1/users/me/societies/created` |
| **Method**   | `GET`                               |

### Parameters

No parameters are required for this endpoint.

### Responses

#### Success

| Code | Content                                                                       |
| ---- | ----------------------------------------------------------------------------- |
| 200  | `{ message: "Created societies retrieved successfully", societies: [ ... ] }` |

#### Errors

| Code | Content                                           |
| ---- | ------------------------------------------------- |
| 401  | `{ error: "Unauthorized" }`                       |
| 500  | `{ error: "Created societies retrieval failed" }` |

> Note: A valid session token is required for this operation. The session token should be included in the `Cookie` header of the HTTP request.

---

## Get Joined Communities

| Description  |                                      |
| ------------ | ------------------------------------ |
| **Endpoint** | `api/v1/users/me/communities/joined` |
| **Method**   | `GET`                                |

### Parameters

No parameters are required for this endpoint.

### Responses

#### Success

| Code | Content                                                                          |
| ---- | -------------------------------------------------------------------------------- |
| 200  | `{ message: "Joined communities retrieved successfully", communities: [ ... ] }` |

#### Errors

| Code | Content                                            |
| ---- | -------------------------------------------------- |
| 401  | `{ error: "Unauthorized" }`                        |
| 500  | `{ error: "Joined communities retrieval failed" }` |

> Note: A valid session token is required for this operation. The session token should be included in the `Cookie` header of the HTTP request.

---

## Get Created Communities

| Description  |                                       |
| ------------ | ------------------------------------- |
| **Endpoint** | `api/v1/users/me/communities/created` |
| **Method**   | `GET`                                 |

### Parameters

No parameters are required for this endpoint.

### Responses

#### Success

| Code | Content                                                                           |
| ---- | --------------------------------------------------------------------------------- |
| 200  | `{ message: "Created communities retrieved successfully", communities: [ ... ] }` |

#### Errors

| Code | Content                                             |
| ---- | --------------------------------------------------- |
| 401  | `{ error: "Unauthorized" }`                         |
| 500  | `{ error: "Created communities retrieval failed" }` |

> Note: A valid session token is required for this operation. The session token should be included in the `Cookie` header of the HTTP request.

## Club API Usage Documentation

## Register Club

| Description  |                |
| ------------ | -------------- |
| **Endpoint** | `api/v1/club/` |
| **Method**   | `POST`         |

### Body Parameters

| Name              | Type   | Required | Description                       |
| ----------------- | ------ | -------- | --------------------------------- |
| `clubName`        | String | Yes      | The name of the club              |
| `clubDescription` | String | Yes      | The description of the club       |
| `clubLogo`        | String | Yes      | The logo of the club              |
| `clubTags`        | String | Yes      | The tags associated with the club |

---

## Get Club Details

| Description  |                   |
| ------------ | ----------------- |
| **Endpoint** | `api/v1/club/:id` |
| **Method**   | `GET`             |

### URL Parameters

| Name | Type   | Required | Description        |
| ---- | ------ | -------- | ------------------ |
| `id` | String | Yes      | The ID of the club |

---

## Get All Clubs

| Description  |                |
| ------------ | -------------- |
| **Endpoint** | `api/v1/club/` |
| **Method**   | `GET`          |

No parameters are required for this endpoint.

---

## Update Club Details

| Description  |                   |
| ------------ | ----------------- |
| **Endpoint** | `api/v1/club/:id` |
| **Method**   | `PATCH`           |

### URL Parameters

| Name | Type   | Required | Description        |
| ---- | ------ | -------- | ------------------ |
| `id` | String | Yes      | The ID of the club |

### Body Parameters

| Name              | Type   | Required | Description                           |
| ----------------- | ------ | -------- | ------------------------------------- |
| `clubName`        | String | Yes      | The new name of the club              |
| `clubDescription` | String | Yes      | The new description of the club       |
| `clubLogo`        | String | Yes      | The new logo of the club              |
| `clubTags`        | String | Yes      | The new tags associated with the club |

---

## Add Club Admin

| Description  |                            |
| ------------ | -------------------------- |
| **Endpoint** | `api/v1/club/:id/addAdmin` |
| **Method**   | `POST`                     |

### URL Parameters

| Name | Type   | Required | Description        |
| ---- | ------ | -------- | ------------------ |
| `id` | String | Yes      | The ID of the club |

### Body Parameters

| Name      | Type   | Required | Description                                |
| --------- | ------ | -------- | ------------------------------------------ |
| `adminId` | String | Yes      | The ID of the user to be added as an admin |

---

## Remove Club Admin

| Description  |                               |
| ------------ | ----------------------------- |
| **Endpoint** | `api/v1/club/:id/removeAdmin` |
| **Method**   | `POST`                        |

### URL Parameters

| Name | Type   | Required | Description        |
| ---- | ------ | -------- | ------------------ |
| `id` | String | Yes      | The ID of the club |

### Body Parameters

| Name      | Type   | Required | Description                                  |
| --------- | ------ | -------- | -------------------------------------------- |
| `adminId` | String | Yes      | The ID of the user to be removed as an admin |

---

## Add Club Member

| Description  |                             |
| ------------ | --------------------------- |
| **Endpoint** | `api/v1/club/:id/addMember` |
| **Method**   | `POST`                      |

### URL Parameters

| Name | Type   | Required | Description        |
| ---- | ------ | -------- | ------------------ |
| `id` | String | Yes      | The ID of the club |

### Body Parameters

| Name     | Type   | Required | Description                                |
| -------- | ------ | -------- | ------------------------------------------ |
| `userId` | String | Yes      | The ID of the user to be added as a member |

---

## Remove Club Member

| Description  |                                |
| ------------ | ------------------------------ |
| **Endpoint** | `api/v1/club/:id/removeMember` |
| **Method**   | `POST`                         |

### URL Parameters

| Name | Type   | Required | Description        |
| ---- | ------ | -------- | ------------------ |
| `id` | String | Yes      | The ID of the club |

### Body Parameters

| Name     | Type   | Required | Description                                  |
| -------- | ------ | -------- | -------------------------------------------- |
| `userId` | String | Yes      | The ID of the user to be removed as a member |

## Community API Usage Documentation

## Register Community

| Description  |                     |
| ------------ | ------------------- |
| **Endpoint** | `api/v1/community/` |
| **Method**   | `POST`              |

### Body Parameters

| Name                   | Type   | Required | Description                            |
| ---------------------- | ------ | -------- | -------------------------------------- |
| `communityName`        | String | Yes      | The name of the community              |
| `communityDescription` | String | Yes      | The description of the community       |
| `communityLogo`        | String | Yes      | The logo of the community              |
| `communityTags`        | String | Yes      | The tags associated with the community |

---

## Get Community Details

| Description  |                        |
| ------------ | ---------------------- |
| **Endpoint** | `api/v1/community/:id` |
| **Method**   | `GET`                  |

### URL Parameters

| Name | Type   | Required | Description             |
| ---- | ------ | -------- | ----------------------- |
| `id` | String | Yes      | The ID of the community |

---

## Get All Communities

| Description  |                     |
| ------------ | ------------------- |
| **Endpoint** | `api/v1/community/` |
| **Method**   | `GET`               |

No parameters are required for this endpoint.

---

## Update Community Details

| Description  |                        |
| ------------ | ---------------------- |
| **Endpoint** | `api/v1/community/:id` |
| **Method**   | `PATCH`                |

### URL Parameters

| Name | Type   | Required | Description             |
| ---- | ------ | -------- | ----------------------- |
| `id` | String | Yes      | The ID of the community |

### Body Parameters

| Name                   | Type   | Required | Description                                |
| ---------------------- | ------ | -------- | ------------------------------------------ |
| `communityName`        | String | Yes      | The new name of the community              |
| `communityDescription` | String | Yes      | The new description of the community       |
| `communityLogo`        | String | Yes      | The new logo of the community              |
| `communityTags`        | String | Yes      | The new tags associated with the community |

---

## Add Community Admin

| Description  |                                 |
| ------------ | ------------------------------- |
| **Endpoint** | `api/v1/community/:id/addAdmin` |
| **Method**   | `POST`                          |

### URL Parameters

| Name | Type   | Required | Description             |
| ---- | ------ | -------- | ----------------------- |
| `id` | String | Yes      | The ID of the community |

### Body Parameters

| Name      | Type   | Required | Description                                |
| --------- | ------ | -------- | ------------------------------------------ |
| `adminId` | String | Yes      | The ID of the user to be added as an admin |

---

## Remove Community Admin

| Description  |                                    |
| ------------ | ---------------------------------- |
| **Endpoint** | `api/v1/community/:id/removeAdmin` |
| **Method**   | `POST`                             |

### URL Parameters

| Name | Type   | Required | Description             |
| ---- | ------ | -------- | ----------------------- |
| `id` | String | Yes      | The ID of the community |

### Body Parameters

| Name      | Type   | Required | Description                                  |
| --------- | ------ | -------- | -------------------------------------------- |
| `adminId` | String | Yes      | The ID of the user to be removed as an admin |

---

## Add Community Member

| Description  |                                  |
| ------------ | -------------------------------- |
| **Endpoint** | `api/v1/community/:id/addMember` |
| **Method**   | `POST`                           |

### URL Parameters

| Name | Type   | Required | Description             |
| ---- | ------ | -------- | ----------------------- |
| `id` | String | Yes      | The ID of the community |

### Body Parameters

| Name     | Type   | Required | Description                                |
| -------- | ------ | -------- | ------------------------------------------ |
| `userId` | String | Yes      | The ID of the user to be added as a member |

---

## Remove Community Member

| Description  |                                     |
| ------------ | ----------------------------------- |
| **Endpoint** | `api/v1/community/:id/removeMember` |
| **Method**   | `POST`                              |

### URL Parameters

| Name | Type   | Required | Description             |
| ---- | ------ | -------- | ----------------------- |
| `id` | String | Yes      | The ID of the community |

### Body Parameters

| Name     | Type   | Required | Description                                  |
| -------- | ------ | -------- | -------------------------------------------- |
| `userId` | String | Yes      | The ID of the user to be removed as a member |

## Society API Documentation

# Society API Usage Documentation

## Register Society

| Description    |                   |
| -------------- | ----------------- |
| **Endpoint**   | `api/v1/society/` |
| **Method**     | `POST`            |
| **Controller** | `registerSociety` |

### Body Parameters

| Name                 | Type             | Required | Description                          |
| -------------------- | ---------------- | -------- | ------------------------------------ |
| `societyName`        | String           | Yes      | The name of the society              |
| `societyDescription` | String           | Yes      | The description of the society       |
| `societyLogo`        | String           | Yes      | The logo of the society              |
| `societyTags`        | Array of Strings | Yes      | The tags associated with the society |

### Response

| Name      | Type   | Description          |
| --------- | ------ | -------------------- |
| `Message` | String | "Society Registered" |

---

## Get Society Details

| Description    |                      |
| -------------- | -------------------- |
| **Endpoint**   | `api/v1/society/:id` |
| **Method**     | `GET`                |
| **Controller** | `getSocietyDetails`  |

### URL Parameters

| Name | Type   | Required | Description           |
| ---- | ------ | -------- | --------------------- |
| `id` | String | Yes      | The ID of the society |

### Response

| Name           | Type   | Description                |
| -------------- | ------ | -------------------------- |
| Society object | Object | The details of the society |

---

## Get All Societies

| Description    |                   |
| -------------- | ----------------- |
| **Endpoint**   | `api/v1/society/` |
| **Method**     | `GET`             |
| **Controller** | `getAllSocieties` |

### Response

| Name                     | Type  | Description               |
| ------------------------ | ----- | ------------------------- |
| Array of Society objects | Array | The list of all societies |

---

## Update Society Details

| Description    |                        |
| -------------- | ---------------------- |
| **Endpoint**   | `api/v1/society/:id`   |
| **Method**     | `PATCH`                |
| **Controller** | `updateSocietyDetails` |

### URL Parameters

| Name | Type   | Required | Description           |
| ---- | ------ | -------- | --------------------- |
| `id` | String | Yes      | The ID of the society |

### Body Parameters

| Name                 | Type             | Required | Description                              |
| -------------------- | ---------------- | -------- | ---------------------------------------- |
| `societyName`        | String           | Yes      | The new name of the society              |
| `societyDescription` | String           | Yes      | The new description of the society       |
| `societyLogo`        | String           | Yes      | The new logo of the society              |
| `societyTags`        | Array of Strings | Yes      | The new tags associated with the society |

### Response

| Name      | Type   | Description       |
| --------- | ------ | ----------------- |
| `Message` | String | "Society Updated" |

---

## Add Society Member

| Description    |                                |
| -------------- | ------------------------------ |
| **Endpoint**   | `api/v1/society/:id/addMember` |
| **Method**     | `POST`                         |
| **Controller** | `addSocietyMember`             |

### URL Parameters

| Name | Type   | Required | Description           |
| ---- | ------ | -------- | --------------------- |
| `id` | String | Yes      | The ID of the society |

### Body Parameters

| Name     | Type   | Required | Description                                |
| -------- | ------ | -------- | ------------------------------------------ |
| `userId` | String | Yes      | The ID of the user to be added as a member |

### Response

| Name      | Type   | Description    |
| --------- | ------ | -------------- |
| `Message` | String | "Member Added" |

## Remove Society Admin

| Description    |                                  |
| -------------- | -------------------------------- |
| **Endpoint**   | `api/v1/society/:id/removeAdmin` |
| **Method**     | `POST`                           |
| **Controller** | `removeSocietyAdmin`             |

### URL Parameters

| Name | Type   | Required | Description           |
| ---- | ------ | -------- | --------------------- |
| `id` | String | Yes      | The ID of the society |

### Body Parameters

| Name      | Type   | Required | Description                       |
| --------- | ------ | -------- | --------------------------------- |
| `adminId` | String | Yes      | The ID of the admin to be removed |

### Response

| Name      | Type   | Description     |
| --------- | ------ | --------------- |
| `Message` | String | "Admin Removed" |

## Join Request API Documentation

## Create Join Request

| Description    |                                          |
| -------------- | ---------------------------------------- |
| **Endpoint**   | `api/v1/joinRequest/:groupType/:groupId` |
| **Method**     | `POST`                                   |
| **Controller** | `createJoinRequest`                      |

### URL Parameters

| Name        | Type   | Required | Description           |
| ----------- | ------ | -------- | --------------------- |
| `groupType` | String | Yes      | The type of the group |
| `groupId`   | String | Yes      | The ID of the group   |

---

## Get Join Requests

| Description    |                                              |
| -------------- | -------------------------------------------- |
| **Endpoint**   | `api/v1/getJoinRequests/:groupType/:groupId` |
| **Method**     | `GET`                                        |
| **Controller** | `getJoinRequests`                            |

### URL Parameters

| Name        | Type   | Required | Description           |
| ----------- | ------ | -------- | --------------------- |
| `groupType` | String | Yes      | The type of the group |
| `groupId`   | String | Yes      | The ID of the group   |

---

## Respond to Join Request

| Description    |                               |
| -------------- | ----------------------------- |
| **Endpoint**   | `api/v1/respondToRequest/:id` |
| **Method**     | `POST`                        |
| **Controller** | `respondToJoinRequest`        |

### URL Parameters

| Name | Type   | Required | Description                |
| ---- | ------ | -------- | -------------------------- |
| `id` | String | Yes      | The ID of the join request |

### Body Parameters

| Name     | Type   | Required | Description                                                              |
| -------- | ------ | -------- | ------------------------------------------------------------------------ |
| `action` | String | Yes      | The action to be taken on the join request, either "approve" or "reject" |

### Event creation

## POST api/v1/event/:groupType/:groupId/

Creates a new event.

### Parameters

- `groupType`: The type of the group. This can be "club", "society", or "community".
- `groupId`: The ID of the group.

### Request Body

- `title`: The title of the event.
- `description`: The description of the event.
- `date`: The date of the event.
- `location`: The location of the event.
- `eventTags`: The tags associated with the event.
- `eventImage`: An image for the event. This should be a file.

### Responses

- `201 Created`: The event was successfully created. The response body contains the created event.
- `400 Bad Request`: The request was invalid.
- `500 Internal Server Error`: Event creation failed.

## PATCH api/v1/event/:eventId/

Updates an event.

### Parameters

- `eventId`: The ID of the event.

### Request Body

- `title`: The title of the event.
- `description`: The description of the event.
- `date`: The date of the event.
- `location`: The location of the event.
- `eventTags`: The tags associated with the event.
- `eventImage`: An image for the event. This should be a file.

### Responses

- `201 Created`: The event was successfully updated. The response body contains the updated event.
- `400 Bad Request`: The request was invalid.
- `500 Internal Server Error`: Event updation failed.

## GET api/v1/event/:groupType/:groupId/

Gets all events for a group.

### Parameters

- `groupType`: The type of the group. This can be "club", "society", or "community".
- `groupId`: The ID of the group.

### Responses

- `200 OK`: The request was successful. The response body contains the events.
- `500 Internal Server Error`: Failed to fetch events.
