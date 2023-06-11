import mysql.connector
from datetime import datetime, timedelta
import random


# Connect to the database
db = mysql.connector.connect(
    host="localhost",
    user="luthfipratamaps",
    password="Alsin12354!",
    database="loraiot"
)
cursor = db.cursor()

# Generate the data
start_time = datetime.strptime('00:00:00', '%H:%M:%S')
end_time = datetime.strptime('23:59:59', '%H:%M:%S')
delta_time = timedelta(minutes=1)
current_time = start_time

today = datetime.now()
days = []
for i in range(7, 0, -1):
    date = today - timedelta(days=i)
    date_string = date.strftime('%Y-%m-%d')
    days.append(date_string)

for day in days:
    while current_time <= end_time:
        # Generate random values for Suhu, RH, and IC
        Suhu1 = round(random.uniform(20, 30), 2)
        Suhu2 = round(random.uniform(20, 30), 2)
        Suhu3 = round(random.uniform(20, 30), 2)
        Suhu4 = round(random.uniform(20, 30), 2)
        RH1 = round(random.uniform(40, 60), 2)
        RH2 = round(random.uniform(40, 60), 2)
        RH3 = round(random.uniform(40, 60), 2)
        RH4 = round(random.uniform(40, 60), 2)
        SH1 = round(random.uniform(40, 60), 2)
        SH2 = round(random.uniform(40, 60), 2)
        SH3 = round(random.uniform(40, 60), 2)
        SH4 = round(random.uniform(40, 60), 2)
        IC1 = round(random.uniform(100, 1000), 2)
        IC2 = round(random.uniform(100, 1000), 2)
        IC3 = round(random.uniform(100, 1000), 2)
        IC4 = round(random.uniform(100, 1000), 2)
        
        # Format the date and time strings
        date_string = day
        time_string = current_time.strftime('%H:%M:%S')

        # Insert the data into the table
        sql = "INSERT INTO monitoring_data (Tanggal, Waktu, Suhu1, Suhu2, Suhu3, Suhu4, RH1, RH2, RH3, RH4, SH1, SH2, SH3, SH4, IC1, IC2, IC3, IC4) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        val = (date_string, time_string, Suhu1, Suhu2, Suhu3, Suhu4, RH1, RH2, RH3, RH4, SH1, SH2, SH3, SH4, IC1, IC2, IC3, IC4)
        print(val)
        cursor.execute(sql, val)
        
        # Increment the time by delta_time
        current_time += delta_time

    current_time = datetime.strptime('00:00:00', '%H:%M:%S')

# Insert data nodes
for i in range(1, 5):
    sql = "INSERT INTO nodes (Node_Id, Longitude, Latitude, Is_Need_Shade) VALUES (%s, %s, %s, %s)"
    val = (i, -6.914744, 107.609810, 0)
    cursor.execute(sql, val)

# Commit the changes and close the connection
db.commit()
db.close()
