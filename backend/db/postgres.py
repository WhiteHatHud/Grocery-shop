import psycopg2

DB_HOST = "database-1.cfcqqw6e2meo.ap-southeast-2.rds.amazonaws.com"
DB_NAME = "wfhubby"
DB_USER = "postgres"
DB_PASS = "wfhubby123"
DB_PORT = 5432

try:
    conn = psycopg2.connect(
        host=DB_HOST,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        port=DB_PORT
    )
    print("PostgreSQL connection successful!")
    cursor = conn.cursor()
    # Example: cursor.execute("SELECT 1;")
except Exception as e:
    print(f"PostgreSQL connection failed: {e}")
