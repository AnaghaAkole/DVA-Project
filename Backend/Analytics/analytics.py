'This file includes functions for analytical processing of data'
from Database.databaseConnectivity import Database

db = Database()


def fetch_city_and_accident_counts():
    query = "select city, count(*) from us_accident_data group by city order by count(*) desc"
    cursor = db.execute(query)
    return cursor.fetchmany(20)
