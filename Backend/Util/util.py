'This file includes helper functions that are useful for ML model'
import requests, json, datetime
from geopy.geocoders import Nominatim
import time


def get_weather_info(lattitude=None, longitude=None, date=None, time=None):
    '''expected date syntax: yyyy-mm-dd, time syntax: HH:MM:SS'''
    final_time = str(date) + "T" + str(time)
    lat = str(lattitude)
    longi = str(longitude)

    filtered_data = dict()
    query = 'https://api.darksky.net/forecast/b299af3ff2d76cdfd211d92bc24374da/' + lat + ',' + longi + ',' + final_time
    r = requests.get(
        query,
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


def predict_input_format_wrapper(attrs_dict):
    """
        This method parses attributes from dict to a list,
        returned list can be use to predict Severity for an instance
        Argument  : dict of input attributes with same naming as in the dataset
        Return    : list of attributes to be passed to model.predict method
    """

    feature_list = [attrs_dict['Start_Lng'],
                    attrs_dict['Start_Lat'],
                    attrs_dict['Temperature(F)'],
                    attrs_dict['Humidity(%)'],
                    attrs_dict['Pressure(in)'],
                    attrs_dict['Visibility(mi)'],
                    float(attrs_dict['Crossing']),
                    float(attrs_dict['Give_way']),
                    float(attrs_dict['Railway']),
                    float(attrs_dict['Station']),
                    float(attrs_dict['Traffic_Calming']),
                    float(attrs_dict['Traffic_Signal'])]
    return feature_list


def get_address_info(data):
    geolocator = Nominatim(user_agent='DVA-project')
    route_obj = data[0]['route']
    for obj in data:
        route = obj['route']
        duration = obj['duration']
        obj['start_time'] = time.time()
        obj['end_time'] = obj['start_time'] + duration
        for r in route:
            location = geolocator.reverse(', '.join([str(r['latitude']), str(r['longitude'])]), timeout=600000)
            if 'address' in location.raw:
                r['county'] = '' if 'county' not in location.raw['address'] else location.raw['address']['county']
                r['postcode'] = '' if 'postcode' not in location.raw['address'] else location.raw['address']['postcode']
                r['street'] = '' if 'road' not in location.raw['address'] else location.raw['address']['road']
                r['city'] = '' if 'city' not in location.raw['address'] else location.raw['address']['city']
                r['state'] = '' if 'state' not in location.raw['address'] else location.raw['address']['state']
    result = {
        'start_lat': route_obj[0]['latitude'],
        'start_long': route_obj[0]['longitude'],
        'data': data
    }
    return result


def form_query(feature, bbox):
    overpass_query = """
    [out:json][timeout:50000];
    node
    """ + feature + bbox + """; 
    out body;
    """
    return overpass_query


def get_topology_info(latitude, longitude):

    """

    :param latitude:
    :param longitude:
    :return:dict: {"traffic_calming":True ......}
    """
    overpass_url = "http://overpass-api.de/api/interpreter"
    overpass_query = ""
    feature = None
    # use bbox coordinates in query . Currently giving dummy coordinates
    bbox = "(50.6,7.0,50.8,7.3)"
    if feature == 'traffic_calming':
        overpass_query = form_query("""["traffic_calming"="yes"]""", bbox)
    elif feature == 'crossing':
        overpass_query = form_query("""["highway"="crossing"]""", bbox)
    elif feature == 'give_way':
        overpass_query = form_query("""["highway"="give_way"]""", bbox)
    elif feature == 'station':
        # bus stop or railway station
        overpass_query = form_query("""["public_transport"="station"]""", bbox)
    elif feature == 'railway':
        overpass_query = form_query("""["railway"="level_crossing"]""", bbox)
    elif feature == 'traffic_signals':
        overpass_query = form_query("""["crossing"="traffic_signals"]""", bbox)

    response = requests.get(overpass_url,
                            params={'data': overpass_query})
    data = response.json()
    if data and 'elements' in data and len(data['elements']) > 0:
        return True
    else:
        return False


def merge(dict1, dict2):
    return dict2.update(dict1)
