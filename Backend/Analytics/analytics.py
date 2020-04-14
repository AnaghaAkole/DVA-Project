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
    path = os.getcwd() + "/analytics/state_abbr_fullname.json"
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
    path = os.getcwd() + "/analytics/abbr_state_name.json"
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
