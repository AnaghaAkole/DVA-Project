'This file includes helper functions that are useful for ML model'
import requests, datetime
from geopy.geocoders import Nominatim
from Backend.Util.lookup_json import side_map, county_map, sunrise_sunset_map, wind_dir_map, state_map, state_abbrev_map
from joblib import Parallel, delayed
import urllib3

def get_weather_info(lattitude=None, longitude=None, date=None, t=None):
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    '''expected date syntax: yyyy-mm-dd, time syntax: HH:MM:SS'''
    final_time = str(date) + "T" + str(t)
    lat = str(lattitude)
    longi = str(longitude)

    filtered_data = dict()
    query = 'https://api.darksky.net/forecast/b299af3ff2d76cdfd211d92bc24374da/' + lat + ',' + longi + ',' + final_time
    r = requests.get(
        query,
        verify=False)
    data = r.json()
    filtered_data['Temperature(F)'] = data['currently']['temperature']
    filtered_data['Pressure(in)'] = data['currently']['pressure']
    filtered_data['Humidity(%)'] = data['currently']['humidity']
    filtered_data['Wind_Direction'] = wind_deg_to_str2(data['currently']['windBearing'])
    filtered_data['Wind_Speed(mph)'] = data['currently']['windSpeed']
    filtered_data['Visibility(mi)'] = data['currently']['visibility']
    date = datetime.datetime.fromtimestamp(data['currently']['time']).strftime('%H:%M:%S')
    date = date.split(':')
    if int(date[0]) <= 7 or int(date[0]) >= 19:
        filtered_data['Sunrise_Sunset'] = 'Night'
    else:
        filtered_data['Sunrise_Sunset'] = 'Day'
    return filtered_data


def wind_deg_to_str2(deg):
    arr = ['NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N']
    return arr[int(abs((deg - 11.25) % 360) / 22.5)]


def get_address_info(lat, longi):
    geolocator = Nominatim(user_agent='DVA-project')
    location = geolocator.reverse(', '.join([str(lat), str(longi)]), timeout=100)
    result = {}
    if 'address' in location.raw:
        result['County'] = '' if 'county' not in location.raw['address'] else location.raw['address']['county'].replace("County","")
        result['Side'] = 'R'
        state_full = '' if 'state' not in location.raw['address'] else location.raw['address']['state']
        result['State'] = state_abbrev_map[state_full]
    return result


def form_query(feature, bbox):
    overpass_query = """
    [out:json][timeout:1];
    node
    """ + feature + bbox + """; 
    out body;
    """
    return overpass_query


def get_topology_info(latitude, longitude):
    # bbox = "(50.6,7.0,50.8,7.3)"
    bbox = "("+str(latitude-0.2)+","+str(longitude-0.2)+","+str(latitude+0.2)+","+str(longitude+0.2)+")"
    features = ['Traffic_Calming', 'Crossing', 'Give_Way', 'Station', 'Railway', 'Traffic_Signal']
    overpass_queries = [form_query("""["traffic_calming"="yes"]""", bbox),
                        form_query("""["highway"="crossing"]""", bbox),
                        form_query("""["highway"="give_way"]""", bbox),
                        form_query("""["public_transport"="station"]""", bbox),
                        form_query("""["railway"="level_crossing"]""", bbox),
                        form_query("""["crossing"="traffic_signals"]""", bbox) ]
    result = Parallel(n_jobs=6)(delayed(is_present)(overpass_queries, features, i) for i in range(6))
    final_result = {}
    for i in result:
        final_result.update(i)
    return final_result


def is_present(overpass_queries, features, i):
    overpass_url = "http://overpass-api.de/api/interpreter"
    try:
        response = requests.get(overpass_url,
                                params={'data': overpass_queries[i]}, timeout=1)
        data = response.json()
    except:
        return { features[i]: False }
    if data and 'elements' in data and len(data['elements']) > 0:
        return { features[i]: True }
    else:
        return { features[i]: False}


def merge(dict1, dict2):
    dict2.update(dict1)
    return dict2

def predict_input_format_wrapper(attrs_dict):
    """
        This method parses attributes from dict to a list,
        returned list can be use to predict Severity for an instance
        Argument  : dict of input attributes with same naming as in the dataset
        Return    : list of attributes to be passed to model.predict method
    """
    feature_lst = [attrs_dict['longitude'],
             attrs_dict['latitude'],
             side_map[attrs_dict['Side']],
             0 if attrs_dict['County'] not in county_map else county_map[attrs_dict['County']],
             state_map[attrs_dict['State']],
             attrs_dict['Temperature(F)'],
             attrs_dict['Humidity(%)'],
             attrs_dict['Pressure(in)'],
             wind_dir_map[attrs_dict['Wind_Direction'].upper()],
             attrs_dict['Wind_Speed(mph)'],
             attrs_dict['Visibility(mi)'],
             sunrise_sunset_map[attrs_dict['Sunrise_Sunset']],
             attrs_dict['Crossing'],
             attrs_dict['Give_Way'],
             attrs_dict['Railway'],
             attrs_dict['Station'],
             attrs_dict['Traffic_Calming'],
             attrs_dict['Traffic_Signal'],
             attrs_dict['Weekday'],
             attrs_dict['Month'],
             attrs_dict['Year']]
    return feature_lst
