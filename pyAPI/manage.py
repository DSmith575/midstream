# Python cmd line tool to manage the project
# Usage: python manage.py <command>

import os
import sys

# source .venv/Scripts/activate
# python -m pip install -r requirements.txt
# python -m pip list

# py -3.12 -m venv .venv
# .venv\Scripts\activate
# pip install -r requirements.txt

def create_virtualenv():
    os.system("python -m venv .venv")
    print("Virtual environment created.")

def start_virtualenv():
    os.system(".venv\\Scripts\\activate")

def install_requirements():
    os.system("pip install -r requirements.txt")
    print("Requirements installed.")

def start_server():
    os.system("uvicorn app.main:app --reload")

def freeze_requirements():
    os.system("pip freeze > requirements.txt")
    print("Requirements file updated.")


def main():
    commands = {
        "freeze": freeze_requirements,
        "install": install_requirements,
        "venv": create_virtualenv,
        "start_venv": start_virtualenv,
        "start": start_server,
    }
    if len(sys.argv) < 2 or sys.argv[1] not in commands:
        print("Available commands: freeze, start")
        return
    commands[sys.argv[1]]()

if __name__ == "__main__":
    main()