'This file includes functions for analytical processing of data'
from Database.databaseConnectivity import Database
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator
import numpy as np
from PIL import Image

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
