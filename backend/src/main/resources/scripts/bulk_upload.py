import psycopg2
from typing import List, Tuple

def read_questions_from_file(filepath: str) -> List[Tuple[str, List[str]]]:
    questions = []
    with open(filepath, 'r') as file:
        lines = file.readlines()

        i = 0
        while i < len(lines):
            question_text = lines[i].strip()
            options = [lines[j].strip() for j in range(i + 1, i + 5)]
            questions.append((question_text, options))
            i += 5

    return questions

def insert_questions(conn, questions: List[Tuple[str, List[str]]]):
    try:
        cursor = conn.cursor()

        for question_text, options in questions:
            # Insert question
            cursor.execute(
                "INSERT INTO questions (text) VALUES (%s) RETURNING id",
                (question_text,)
            )
            question_id = cursor.fetchone()[0]

            # Insert options
            for i, option_text in enumerate(options):
                cursor.execute(
                    "INSERT INTO options (text, is_correct, question_id) VALUES (%s, %s, %s)",
                    (option_text, i == 0, question_id)
                )

        conn.commit()
        cursor.close()
        print(f"Successfully uploaded {len(questions)} questions with their options")

    except Exception as e:
        conn.rollback()
        print(f"Error occurred: {str(e)}")

def main():
    # Database connection parameters - adjust these as needed
    db_params = {
        "dbname": "quiz",
        "user": "postgres",
        "password": "pgroot",
        "host": "localhost",
        "port": "5432"
    }

    try:
        # Connect to database
        conn = psycopg2.connect(**db_params)

        # Read questions from file
        questions = read_questions_from_file("questions.txt")

        # Insert questions and options
        insert_questions(conn, questions)

        conn.close()

    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()