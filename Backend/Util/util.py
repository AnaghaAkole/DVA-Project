'This file includes helper functions that are useful for ML model'
import requests, json, datetime
def get_weather_info(lattitude, longitude, time):
    filtered_data = dict()
    r = requests.get(
        'https://api.darksky.net/forecast/b299af3ff2d76cdfd211d92bc24374da/42.3601,-71.0589,2020-03-25T04:08:30',
        verify=False)
    data = r.json()
    filtered_data['temperature'] = data['currently']['temperature']
    filtered_data['pressure'] = data['currently']['pressure']
    filtered_data['humidity'] = data['currently']['humidity']
    filtered_data['windBearing'] = data['currently']['windBearing']
    filtered_data['windSpeed'] = data['currently']['windSpeed']
    filtered_data['visibility'] = data['currently']['visibility']
    date = datetime.datetime.fromtimestamp(data['currently']['time']).strftime('%H:%M:%S')
    date = date.split(':')
    if int(date[0]) <= 7 or int(date[0]) >= 19:
        filtered_data['day_night'] = 'Night'
    else:
        filtered_data['day_night'] = 'Day'
    print(filtered_data)
    return filtered_data
