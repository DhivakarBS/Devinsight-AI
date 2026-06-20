import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="gitsense_ai",
    user="postgres",
    password="dhiva@0607",
    port="5432"
)

cur = conn.cursor()

cur.execute("SELECT * FROM users")
rows = cur.fetchall()

for row in rows:
    print(row)

cur.close()
conn.close()