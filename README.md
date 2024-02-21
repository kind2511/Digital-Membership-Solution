# GNIST

Welcome to GNIST. This project is developed by Gruppe 208 for PROG2900 at NTNU.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Local Setup](#local-setup)
3. [Running the Application](#running-the-application)
4. [Credits](#credits)

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

## Credits

T
