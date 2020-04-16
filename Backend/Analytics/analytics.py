'This file includes functions for analytical processing of data'
from Database.databaseConnectivity import Database
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator
import numpy as np
from PIL import Image
import os
import json

db = Database()


def fetch_city_and_accident_counts():
    query = "select city, count(*) from us_accident_data group by city order by count(*) desc"
    cursor = db.execute(query)
    return cursor.fetchmany(20)


def fetch_cities():
    query = "select distinct(City) from us_accident_data;"
    cursor = db.execute(query)
    return cursor.fetchall()


def fetch_day_wise_count():
    query = "SELECT strftime('%w', ('20'||substr(Start_Time,7,2) || '-' || substr(Start_Time,4,2) || '-' || substr(Start_Time,0,3))) as Day, count(*) from us_accident_data group by Day;"
    cursor = db.execute(query)
    return cursor.fetchall()


def fetch_Description():
    query = "Select Description from us_accident_data;"
    cursor = db.execute(query)
    return cursor.fetchall()


def generate_word_cloud():
    descriptions = fetch_Description()
    dsc = []
    for desc in descriptions:
        dsc.append(desc[0])

    text = " ".join(desc for desc in dsc)

    print("There are {} words in the combination of all description.".format(len(text)))
    more_stopwords = ["accident", "blocked", "Right", "hand", "delays", "due"]
    for more in more_stopwords:
        STOPWORDS.add(more)
    # Generate a word cloud image
    # lower max_font_size
    mask = np.array(Image.open("mask.jpg"))
    wordcloud = WordCloud(stopwords=STOPWORDS, max_font_size=50,max_words=1000, background_color="white", mask=mask).generate(text)

    # Save the image in the img folder:
    image_colors = ImageColorGenerator(mask)
    wordcloud.recolor(color_func=image_colors)
    wordcloud.to_file("us_accidents_description.png")
    return text

def convert_abbreviation_to_state_names(rows):
    path = os.getcwd() + "/Backend/Analytics/state_abbr_fullname.json"
    with open(path) as f:
        state_names_json = json.load(f)
    modified_rows = []
    for row in rows:
        row = list(row)
        row[0] = state_names_json[row[0]]
        modified_rows.append(row)
    return modified_rows


def fetch_states_accident_counts():
    query = "select state, count(*) from us_accident_data group by state order by count(*) desc"
    cursor = db.execute(query)
    rows = cursor.fetchall()
    rows = convert_abbreviation_to_state_names(rows)
    return rows


def fetch_city_hot_spots():
    path = os.getcwd() + "/Backend/Analytics/abbr_state_name.json"
    with open(path) as f:
        state_names_json = json.load(f)
    hotspots = {}
    rows = fetch_states_accident_counts()
    for row in rows:
        state = row[0]
        query = "select city, count(*) from us_accident_data where state=? group by city order by count(*) desc"
        cursor = db.execute_query_with_params(query, [state_names_json[state]])
        result = cursor.fetchmany(5)
        row.append(result)
        hotspots[state] = row
    return hotspots

def fetch_road_topology():
    data = []
    query = "SELECT Bump,COUNT(Bump) FROM us_accident_data GROUP BY Bump;"
    cursor = db.execute(query)
    res = cursor.fetchall()
    data.append(res[1][1])

    query = "SELECT Crossing,COUNT(Crossing) FROM us_accident_data GROUP BY Crossing;"
    cursor = db.execute(query)
    res = cursor.fetchall()
    data.append(res[1][1])

    query = "SELECT Give_Way,COUNT(Give_Way) FROM us_accident_data GROUP BY Give_Way;"
    cursor = db.execute(query)
    res = cursor.fetchall()
    data.append(res[1][1])

    query = "SELECT Junction,COUNT(Junction) FROM us_accident_data GROUP BY Junction;"
    cursor = db.execute(query)
    res = cursor.fetchall()
    data.append(res[1][1])

    query = "SELECT No_Exit,COUNT(No_Exit) FROM us_accident_data GROUP BY No_Exit;"
    cursor = db.execute(query)
    res = cursor.fetchall()
    data.append(res[1][1])

    query = "SELECT Railway,COUNT(Railway) FROM us_accident_data GROUP BY Railway;"
    cursor = db.execute(query)
    res = cursor.fetchall()
    data.append(res[1][1])

    query = "SELECT Roundabout,COUNT(Roundabout) FROM us_accident_data GROUP BY Roundabout;"
    cursor = db.execute(query)
    res = cursor.fetchall()
    data.append(res[1][1])

    query = "SELECT Station,COUNT(Station) FROM us_accident_data GROUP BY Station;"
    cursor = db.execute(query)
    res = cursor.fetchall()
    data.append(res[1][1])

    query = "SELECT Stop,COUNT(Stop) FROM us_accident_data GROUP BY Stop;"
    cursor = db.execute(query)
    res = cursor.fetchall()
    data.append(res[1][1])

    query = "SELECT Traffic_Calming,COUNT(Traffic_Calming) FROM us_accident_data GROUP BY Traffic_Calming;"
    cursor = db.execute(query)
    res = cursor.fetchall()
    data.append(res[1][1])

    query = "SELECT Traffic_Signal,COUNT(Traffic_Signal) FROM us_accident_data GROUP BY Traffic_Signal;"
    cursor = db.execute(query)
    res = cursor.fetchall()
    data.append(res[1][1])

    return data