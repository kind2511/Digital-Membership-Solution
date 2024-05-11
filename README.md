# GNIST

Welcome to GNIST. This project is developed by Gruppe 208 for PROG2900 at NTNU.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Local Setup](#local-setup)
3. [Running the Application](#running-the-application)
4. [API Documentation](#api-documentation)

## Project Structure

The GNIST project is organized into two main components:

- **FrontEnd/**: Contains the React application that serves as the user interface.
- **BackEnd/**: Houses the Django application responsible for server-side operations, including API and database management.

Root directory files:
- `.gitignore`: Specifies intentionally untracked files to ignore.
- `README.md`: Documentation that provides setup instructions and information.

## Getting Started

### Prerequisites

To get started, you'll need to install:
- Node.js and npm (Node Package Manager)
- Python and pip (Python Package Manager)
- A preferred IDE, such as Visual Studio Code

### Local Setup

1. **Clone the Repository**:
   Clone the repository to your local machine using the following command:
    ```
    git clone https://gitlab.stud.idi.ntnu.no/ahmadmm/gnist.git
    ```
    Then, navigate to the project directory:
    ```
    cd gnist
    ```

2. **FrontEnd Setup**:
    Navigate to the FrontEnd directory:
    ```
    cd FrontEnd
    ```
    Install the necessary npm packages:
    ```
    npm install
    ```

3. **BackEnd Setup**:
    Navigate to the BackEnd directory:
    ```
    cd ../BackEnd
    ```
    Set up a Python virtual environment:
    ```
    python -m venv venv
    ```
    Activate the virtual environment:
    For Windows:
    ```
    venv\Scripts\activate
    ```
    For macOS and Linux:
    ```
    source venv/bin/activate
    ```
    Install the required Python packages:
    ```
    pip install -r requirements.txt
    ```

## Running the Application

1. **Start the FrontEnd**:
   Inside the FrontEnd directory, start the React application:
    ```
    npm start
    ```
   Your default web browser will open to `http://localhost:3000`.

2. **Start the BackEnd**:
   In a new terminal window, ensure you're in the BackEnd directory and the virtual environment is activated, then start the Django server:
    ```
    python manage.py runserver
    ```
   The Django API will be available at `http://localhost:8000`.

## API Documentation

<details>
<summary><h4>Retrieve all future activities:</h4></summary>

```http
  GET /digital_medlemsordning/get_future_activities/
```

#### Response:

| Status Code  | Content-Type       |
|:-------------|:-------------------|
| `200 OK`     | `application/json` |

##### Example Response Body:
```json
[
    {
        "activityID": "81",
        "title": "Football night",
        "description": "Manchester United vs Liverpool 18:00",
        "image": "/media/activity_pics/football_image3.png",
        "date": "2025-05-29",
        "limit": 40,
        "signed_up_count": 2,
        "signed_up_members": [
            {
                "first_name": "Soso",
                "last_name": "Larote",
                "auth0ID": "auth0|661e47baf4c703e30aaee8fc"
            },
            {
                "first_name": "Howard",
                "last_name": "Linus",
                "auth0ID": "auth0|661a52a2cad534c6e30e3c37"
            }
        ]
    },
    {
        "activityID": 77,
        "title": "Skydive",
        "description": "Skydive lessons at 5 PM in Copenhagen.",
        "image": "/media/activity_pics/skydive.jpeg",
        "date": "2025-05-09",
        "limit": null,
        "signed_up_count": 2,
        "signed_up_members": [
            {
                "first_name": "Soso",
                "last_name": "Larote",
                "auth0ID": "auth0|661e47baf4c703e30aaee8fc"
            },
            {
                "first_name": "Howard",
                "last_name": "Linus",
                "auth0ID": "auth0|661a52a2cad534c6e30e3c37"
            }
        ]
    },
    ...
]
```

</details>

<details>
<summary><h4>Retrieve all past activities:</h4></summary>

```http
  GET /digital_medlemsordning/get_past_activities/
```

#### Response:

| Status Code  | Content-Type       |
|:-------------|:-------------------|
| `200 OK`     | `application/json` |

##### Example Response Body:
```json
[
    {
        "activityID": 77,
        "title": "Skydive",
        "description": "Skydive lessons at 5 PM in Copenhagen.",
        "image": "/media/activity_pics/skydive.jpeg",
        "date": "2024-05-09",
        "limit": null,
        "signed_up_count": 2,
        "signed_up_members": [
            {
                "first_name": "Soso",
                "last_name": "Larote",
                "auth0ID": "auth0|661e47baf4c703e30aaee8fc"
            },
            {
                "first_name": "Howard",
                "last_name": "Linus",
                "auth0ID": "auth0|661a52a2cad534c6e30e3c37"
            }
        ]
    },
    {
        "activityID": "81",
        "title": "Football night",
        "description": "Manchester United vs Liverpool 18:00",
        "image": "/media/activity_pics/football_image3.png",
        "date": "2023-05-29",
        "limit": 40,
        "signed_up_count": 2,
        "signed_up_members": [
            {
                "first_name": "Soso",
                "last_name": "Larote",
                "auth0ID": "auth0|661e47baf4c703e30aaee8fc"
            },
            {
                "first_name": "Howard",
                "last_name": "Linus",
                "auth0ID": "auth0|661a52a2cad534c6e30e3c37"
            }
        ]
    },
    ...
]
```

</details>

<details>
<summary><h4>Retrieve all curent date activites:</h4></summary>

```http
  GET /digital_medlemsordning/get_activity_today/
```

#### Response:

| Status Code  | Content-Type       |
|:-------------|:-------------------|
| `200 OK`     | `application/json` |

##### Example Response Body:
```json
[
    {
        "activityID": 77,
        "title": "Skydive",
        "description": "Skydive lessons at 5 PM in Copenhagen.",
        "image": "/media/activity_pics/skydive.jpeg",
        "date": "2024-05-10",
        "limit": null,
        "signed_up_count": 2,
        "signed_up_members": [
            {
                "first_name": "Soso",
                "last_name": "Larote",
                "auth0ID": "auth0|661e47baf4c703e30aaee8fc"
            },
            {
                "first_name": "Howard",
                "last_name": "Linus",
                "auth0ID": "auth0|661a52a2cad534c6e30e3c37"
            }
        ]
    },
    {
        "activityID": "81",
        "title": "Football night",
        "description": "Manchester United vs Liverpool 18:00",
        "image": "/media/activity_pics/football_image3.png",
        "date": "2024-05-10",
        "limit": 40,
        "signed_up_count": 2,
        "signed_up_members": [
            {
                "first_name": "Soso",
                "last_name": "Larote",
                "auth0ID": "auth0|661e47baf4c703e30aaee8fc"
            },
            {
                "first_name": "Howard",
                "last_name": "Linus",
                "auth0ID": "auth0|661a52a2cad534c6e30e3c37"
            }
        ]
    },
    ...
]
```

</details>

<details>
<summary><h4>Retrieve all activites:</h4></summary>

```http
  GET /digital_medlemsordning/get_all_activity/
```

#### Response:

| Status Code  | Content-Type       |
|:-------------|:-------------------|
| `200 OK`     | `application/json` |

##### Example Response Body:
```json
[
    {
        "activityID": 55,
        "title": "Yoga Retreat",
        "description": "Enjoy the tranquility of yoga in a serene setting, focusing on breath control, flexibility, and strength. Ideal for all levels, this session promotes mental clarity and physical wellness.",
        "image": "/media/activity_pics/YougaYogaSeaWall.jpg",
        "date": "2025-05-09",
        "limit": null,
        "signed_up_count": 0,
        "signed_up_members": []
    },
    {
        "activityID": 75,
        "title": "Hiking Adventure",
        "description": "Hiking Adventure",
        "image": "/media/activity_pics/Hiking_Adventure_zHouiE5.jpeg",
        "date": "2024-03-12",
        "limit": 20,
        "signed_up_count": 1,
        "signed_up_members": [
            {
                "first_name": "soso",
                "last_name": "Larote",
                "auth0ID": "auth0|661e47baf4c703e30aaee8fc"
            }
        ]
    },
    ...
]
```

</details>

<details>
<summary><h4>Retrieve specific activity:</h4></summary>

```http
  GET /digital_medlemsordning/get_activity_details/{activityID}/
```

| Parameter | Type     | Description                       |
|:----------|:---------|:----------------------------------|
| `ID`      | `string` | **Required**. The Activity ID     |

#### Response:

| Status Code  | Content-Type       |
|:-------------|:-------------------|
| `200 OK`     | `application/json` |

##### Example Response Body:
```json
{
    "activityID": 75,
    "title": "Hiking Adventure",
    "description": "Hiking Adventure",
    "image": "/media/activity_pics/Hiking_Adventure_zHouiE5.jpeg",
    "date": "2024-03-12",
    "limit": 20,
    "signed_up_count": 1,
    "signed_up_members": [
        {
            "first_name": "soso",
            "last_name": "Larote",
            "auth0ID": "auth0|661e47baf4c703e30aaee8fc"
        }
    ]
}
```

</details>

<details>
<summary><h4>Delete a specific activity:</h4></summary>

```http
  DELETE /digital_medlemsordning/delete_activity/{ID}/
```

| Parameter | Type     | Description                       |
|:----------|:---------|:----------------------------------|
| `ID`      | `string` | **Required**. The Activity ID     |

#### Response:

| Status Code   | `204 No Content`   |
|:--------------|:-------------------|

##### Example Response Body:
```json
{
    "message": "Activity deleted successfully"
}
```

</details>

<details>
<summary><h4>Delete a specific member:</h4></summary>

```http
  DELETE /digital_medlemsordning/delete_member/{auth0ID}/
```

| Parameter | Type     | Description                        |
|:----------|:---------|:-----------------------------------|
| `auth0ID` | `string` | **Required**. The Members Auth0ID  |

#### Response:

| Status Code   | `204 No Content`   |
|:--------------|:-------------------|

##### Example Response Body:
```json
{
    "message": "Member deleted successfully"
}
```

</details>

</details>

<details>
<summary><h4>Get Member attendence for specific date: </h4></summary>

```http
  GET /digital_medlemsordning/get_member_attendance/?date={date}
```

| Parameter    | Type     | Description          | Default value  |
|:-------------|:---------|:---------------------|:---------------| 
| `date`       | `string` | **Optional**. Date   | `Current Date` | 

#### Response:

| Status Code  | Content-Type       |
|:-------------|:-------------------|
| `200 OK`     | `application/json` |

##### Example Response Body:
```json
{
    "message": "Member attendance for 2024-04-06 retrieved successfully.",
    "members_present": [
        {
            "name": "Rodger Smith",
            "profile_pic": "/media/profile_pics/Default_Profile_Picture.jpg"
        },
        {
            "name": "Lisa Stevens",
            "profile_pic": "/media/profile_pics/Default_Profile_Picture.jpg"
        },
        {
            "name": "John Conway",
            "profile_pic": "/media/profile_pics/Default_Profile_Picture.jpg"
        },
        {
            "name": "Norm Sandington",
            "profile_pic": "/media/profile_pics/portofino_2464491k_qiVdymd.jpg"
        },
        {
            "name": "Samantha Pilkington",
            "profile_pic": "/media/profile_pics/81zm9tKLsxL._AC_SL1170__JIVQUhu.jpg"
        }
    ]
}
```

</details>

<details>
<summary><h4>Get member attendence statistics for a given time period:</h4></summary>

```http
  GET /digital_medlemsordning/member_attendance_stats/?start_date={start_date}&end_date={end_date}
```

| Parameter | Type        | Description                     | Default value  |
|:-------------|:---------|:--------------------------------|:---------------| 
| `start_date` | `string` | **Optional**. Starting date     | `Current Date` |
| `end_date`   | `string` | **Optional**. End date          | `Current Date` |             

#### Response:

| Status Code  | Content-Type       |
|:-------------|:-------------------|
| `200 OK`     | `application/json` |

##### Example Response Body:
```json
{
    "total_attendance": 19,
    "attendance_by_gender": {
        "vil ikke si": 3,
        "jente": 6,
        "gutt": 9,
        "ikke-binær": 1
    }
}
```

</details>

<details>
<summary><h4>Search for a member based on first or last name:</h4></summary>

```http
  GET /digital_medlemsordning/search_member/?name={name}
```

| Parameter | Type        | Description               |
|:----------|:---------|:-----------------------------|
| `name`    | `string` | **Required**. Name of member |

* Case insensitive. 
* Retrievs any member whos first or last name contains the required string paramater.

#### Response:

| Status Code  | Content-Type       |
|:-------------|:-------------------|
| `200 OK`     | `application/json` |

##### Example Response Body:
```json
[
    {
        "userID": 69,
        "auth0ID": "auth0|65e06e072cc8113ba2d5cdea",
        "first_name": "John",
        "last_name": "Smith",
        "birthdate": "2002-09-05",
        "profile_pic": "/media/profile_pics/Default_Profile_Picture.jpg",
        "gender": "gutt",
        "days_without_incident": 101,
        "phone_number": "12345678",
        "email": "testing@gmail.com",
        "guardian_name": null,
        "guardian_phone": null,
        "verified": true,
        "banned": true,
        "banned_from": "2024-05-10",
        "banned_until": "2024-05-12",
        "info": "",
        "role": "member"
    },
    {
        "userID": 119,
        "auth0ID": "auth0|65f9cb6b6b09e9bfdc447d30",
        "first_name": "Larry",
        "last_name": "Johnsen",
        "birthdate": "2006-03-06",
        "profile_pic": "/media/profile_pics/81zm9tKLsxL._AC_SL1170__JIVQUhu.jpg",
        "gender": "gutt",
        "days_without_incident": 5,
        "phone_number": "12345678",
        "email": "chrisa2511@gmail.com",
        "guardian_name": "",
        "guardian_phone": "",
        "verified": false,
        "banned": false,
        "banned_from": null,
        "banned_until": null,
        "info": "",
        "role": "member"
    },
    ...
]
```

</details>

<details>
<summary><h4>Unban a member:</h4></summary>

```http
  PUT /digital_medlemsordning/unban_member/{auth0ID}/
```

| Parameter | Type        | Description                  |
|:----------|:---------|:--------------------------------|
| `auth0ID` | `string` | **Required**. Auth0ID of member |

#### Response:

| Status Code  | Content-Type       |
|:-------------|:-------------------|
| `200 OK`     | `application/json` |

##### Example Response Body:
```json
{
    "message": "Member unbanned successfully"
}
```

</details>

<details>
<summary><h4>Add info to specific member:</h4></summary>

```http
  PUT /digital_medlemsordning/add_member_info/{auth0ID}/
```

| Parameter | Type        | Description                  |
|:----------|:---------|:--------------------------------|
| `auth0ID` | `string` | **Required**. Auth0ID of member |

##### Example PUT-Body:
```json
{
    "info": "Ability to acces club on saturdays"
}
```

#### Response:

| Status Code  | Content-Type       |
|:-------------|:-------------------|
| `200 OK`     | `application/json` |

##### Example Response Body:
```json
{
    "auth0ID": "auth0|661a52a2cad534c6e30e3c37",
    "info": "Ability to acces club on saturdays"
}
```

</details>

<details>
<summary><h4>Remove info from a specific memmber:</h4></summary>

```http
  PUT /digital_medlemsordning/remove_member_info/{auth0ID}/
```

| Parameter | Type        | Description                  |
|:----------|:---------|:--------------------------------|
| `auth0ID` | `string` | **Required**. Auth0ID of member |

#### Response:

| Status Code  | Content-Type       |
|:-------------|:-------------------|
| `200 OK`     | `application/json` |

##### Example Response Body:
```json
{
    "auth0ID": "auth0|661a52a2cad534c6e30e3c37",
    "info": ""
}
```

</details>

<details>
<summary><h4>Retrieve all members with info:</h4></summary>

```http
  GET /digital_medlemsordning/get_members_with_info/
```

#### Response:

| Status Code  | Content-Type       |
|:-------------|:-------------------|
| `200 OK`     | `application/json` |

##### Example Response Body:
```json
[
    {
        "auth0ID": "auth0|65ef275a34065d2b94cc1d8d",
        "info": "Key to clubhouse"
    },
    {
        "auth0ID": "auth0|661711a8bdf844868576402b",
        "info": "Allowed to access clubhouse on saturdays"
    },
    ...
]
```

</details>

<details>
<summary><h4>Retrieve all unverified members:</h4></summary>

```http
  GET /digital_medlemsordning/get_all_unverified_members/
```

#### Response:

| Status Code  | Content-Type       |
|:-------------|:-------------------|
| `200 OK`     | `application/json` |

##### Example Response Body:
```json
[
    {
        "auth0ID": "auth0|65ef275a34065d2b94cc1d8d",
        "birthdate": "2004-01-01",
        "first_name": "James",
        "last_name": " Kahn",
        "guardian_name": "",
        "guardian_phone": ""
    },
    {
        "auth0ID": "auth0|65ef289190350a753bf985ae",
        "birthdate": "2011-05-07",
        "first_name": "Lisa",
        "last_name": "Danilson",
        "guardian_name": "Laila Danilson",
        "guardian_phone": "43892312"
    },
    ...
]
```

</details>

<details>
<summary><h4>Verify a member:</h4></summary>

```http
  PUT /digital_medlemsordning/verify_member/{auth0ID}/
```

| Parameter | Type        | Description                  |
|:----------|:---------|:--------------------------------|
| `auth0ID` | `string` | **Required**. Auth0ID of member |

#### Response:

| Status Code  | Content-Type       |
|:-------------|:-------------------|
| `200 OK`     | `application/json` |

##### Example Response Body:
```json
{
    "message": "Member successfully verified"
}
```

</details>

<details>
<summary><h4>Create a new level:</h4></summary>

```http
  POST /digital_medlemsordning/create_level/
```

| Parameter | Type     | Description                       |
|:----------|:---------|:----------------------------------|
| `name`    | `string` | **Required**. Name of the level   |
| `points`  | `string` | **Required**. Points of the level |

##### Example POST-Body:
```json
{
    "name": "Invincible",
    "points": 120
}
```

#### Response:

| Status Code   | Content-Type       |
|:--------------|:-------------------|
| `201 Created` | `application/json` |

##### Example Response Body:
```json
{
    "message": "Level successfully created"
}
```

</details>

<details>
<summary><h4>Retrieve all levels:</h4></summary>

```http
  GET /digital_medlemsordning/get_all_levels/
```

#### Response:

| Status Code  | Content-Type       |
|:-------------|:-------------------|
| `200 OK`     | `application/json` |

##### Example Response Body:
```json
[
    {
        "levelID": 49,
        "name": "Legend",
        "points": 100
    },
    {
        "levelID": 50,
        "name": "Pro",
        "points": 80
    },
    {
        "levelID": 51,
        "name": "Intermediate",
        "points": 60
    },
    {
        "levelID": 52,
        "name": "Rookie",
        "points": 40
    },
    {
        "levelID": 53,
        "name": "Noob",
        "points": 20
    },
    {
        "levelID": 56,
        "name": "Invincible",
        "points": 120
    },
    ...
]
```

</details>

<details>
<summary><h4>Edit a specific level:</h4></summary>

```http
  PUT /digital_medlemsordning/edit_level/{levelID}/
```

| Parameter | Type        | Description                  |
|:----------|:------------|:-----------------------------|
| `levelID` | `string`    | **Required**. ID of a level  |

##### Example PUT-Body:
```json
{
    "name": "Invincible",
    "points": 110
}
```

#### Response:

| Status Code  | Content-Type       |
|:-------------|:-------------------|
| `200 OK`     | `application/json` |

##### Example Response Body:
```json
{
    "message": "Level updated successfully"
}
```

</details>

<details>
<summary><h4>Delete a specific level</h4></summary>

```http
  DELETE /digital_medlemsordning/delete_level/{levelID}/
```

| Parameter | Type        | Description                  |
|:----------|:------------|:-----------------------------|
| `levelID` | `string`    | **Required**. ID of a level  |

#### Response:

| Status Code   | `204 No Content`   |
|:--------------|:-------------------|

##### Example Response Body:
```json
{
    "message": "Level deleted successfully"
}
```

</details>

<details>
<summary><h4>Create a new suggestion:</h4></summary>

```http
  POST /digital_medlemsordning/create_suggestion/
```

| Parameter      | Type     | Description                              |
|:---------------|:---------|:-----------------------------------------|
| `title`        | `string` | **Required**. Ttile of suggestion        |
| `description`  | `string` | **Required**. Description of suggestion  |

##### Example POST-Body:
```json
{
    "title": "Trip to Tekninsk Museum",
    "description": "It would be great if we could go and visit Teknisk museum during the summer"
}
```

#### Response:

| Status Code   | Content-Type       |
|:--------------|:-------------------|
| `201 Created` | `application/json` |

##### Example Response Body:
```json
{
    "suggestionID": 56,
    "title": "Trip to Tekninsk Museum",
    "description": "It would be great if we could go and visit Teknisk museum during the summer"
}
```

</details>

<details>
<summary><h4>Retrieve all future suggestions:</h4></summary>

```http
  GET /digital_medlemsordning/get_all_suggestions/
```

#### Response:

| Status Code  | Content-Type       |
|:-------------|:-------------------|
| `200 OK`     | `application/json` |

##### Example Response Body:
```json
[
    {
        "suggestionID": 15,
        "title": "Celebrate birthday",
        "description": "Marcus has his birthay comming up. I want us to have a party for him."
    },
    {
        "suggestionID": 56,
        "title": "Trip to Tekninsk Museum",
        "description": "It would be great if we could go and visit Teknisk museum during the summer."
    }
    ...
]
```

</details>

<details>
<summary><h4>Delete a specific suggestion:</h4></summary>

```http
  DELETE /digital_medlemsordning/delete_suggestion/{ID}/
```

| Parameter | Type     | Description                       |
|:----------|:---------|:----------------------------------|
| `ID`      | `string` | **Required**. The Suggestion ID   |

#### Response:

| Status Code   | `204 No Content`   |
|:--------------|:-------------------|

##### Example Response Body:
```json
{
    "message": "Suggestion deleted successfully"
}
```

</details>