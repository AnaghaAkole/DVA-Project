import requests


def form_traffic_calming_query(bbox):
    overpass_query = """
    [out:json][timeout:50000];
    node
      ["traffic_calming"="yes"]"""+bbox+"""; 
    out body;
    """
    return overpass_query


def form_crossing_query(bbox):
    overpass_query = """
    [out:json][timeout:50000];
    node
      ["highway"="crossing"]"""+bbox+"""; 
    out body;
    """
    return overpass_query


def form_give_way_query(bbox):
    overpass_query = """
    [out:json][timeout:50000];
    node
      ["highway"="give_way"]"""+bbox+"""; 
    out body;
    """
    return overpass_query


def form_railway_station_query(bbox):
    overpass_query = """
    [out:json][timeout:50000];
    node
      ["railway"="station"]"""+bbox+"""; 
    out body;
    """
    return overpass_query


def form_traffic_signal_query(bbox):
    overpass_query = """
    [out:json][timeout:50000];
    node
      ["crossing"="traffic_signals"]"""+bbox+"""; 
    out body;
    """
    return overpass_query


def get_topology_info(feature,bbox):
    overpass_url = "http://overpass-api.de/api/interpreter"
    overpass_query = ""
    # use bbox coordinates in query . Currently giving dummy coordinates
    bbox = "(24.59, -125.37, 49.72, -60.24)"
    if feature == 'traffic_calming':
        overpass_query = form_traffic_calming_query(bbox)
    elif feature == 'crossing':
        overpass_query = form_crossing_query(bbox)
    elif feature == 'give_way':
        overpass_query = form_give_way_query(bbox)
    elif feature == 'station':
        overpass_query = form_railway_station_query(bbox)
    elif feature == 'traffic_signals':
        overpass_query = form_traffic_signal_query(bbox)

    response = requests.get(overpass_url,
                            params={'data': overpass_query})
    data = response.json()

    if data and 'elements' in data and len(data['elements']) > 0:
        return True
    else:
        return False