#!/usr/bin/env python3
# Help script for converting file structure to training on database
# Proper use is:
# ./load_training.py [folder of module]
# Make sure the backend is running prior to execution
# If all goes well, this should be the end of the output:
# Logged in: <Response [200]>
# Quiz Addition: <Response [200]>
# Training Addition: <Response [200]>

from sys import argv
import json
import requests

training_name = ""
description = ""
quiz_file = ""
page_files = []

with open(argv[1] + "/info.json", "r") as info_file:
    json_contents = json.loads(info_file.read())
    training_name = json_contents["name"]
    description = json_contents["description"]
    quiz_file = json_contents["quiz_file"]
    page_files = json_contents["page_files"]
print("Info loaded")


# Load page file contents
pages = []
for page in page_files:
    with open(argv[1] + "/" + page, "r") as page_file:
        pages.append(page_file.read())
print(f"Pages loaded: {pages}")


# Load quiz contents
quiz = {}
with open(argv[1] + "/" + quiz_file, "r") as quiz_contents:
    quiz = json.loads(quiz_contents.read())
print(f"Quiz loaded: {quiz}")

session = requests.Session()

response = session.post(
    "http://localhost:5005/auth/login",
    json={"email": "root@root.com", "password": "Root12345"},
)
print(f"Logged in: {response}")
response1 = session.post(
    "http://localhost:5005/quiz/add_quiz",
    cookies=session.cookies.get_dict(),
    json=quiz,
    timeout=5,
)
print(f"Quiz Addition: {response1}")
response2 = session.post(
    "http://localhost:5005/trainings/create_training",
    json={
        "title": training_name,
        "description": description,
        "quiz": quiz["title"],
        "pages": pages,
    },
    cookies=session.cookies.get_dict(),
)
print(f"Training Addition: {response2}")
