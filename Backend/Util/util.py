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
