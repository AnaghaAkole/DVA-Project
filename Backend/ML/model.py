'This file includes Machine Learning model for predicting accidents'
from sklearn.externals import joblib
from datetime import datetime,date
from Util.util import get_weather_info, predict_input_format_wrapper, merge, get_address_info, get_topology_info

class Model:

    def __init__(self):
        self.model = self.load_model()

    def load_model(self):
        return joblib.load('ML/ML_model.sav')

    def predict(self, input):
        return self.model.predict(input)[0]


class Inference:

    def __init__(self):
        self.model = Model()
        self.model.load_model()

    def find_safest_path(self, routes):
        # yyyy-mm-dd HH:MM:SS
        travel_time = routes['timeOfTravel']
        routes_arr = routes['routes']
        date_ui = travel_time.split(" ")[0]
        time = travel_time.split(" ")[1]
        year = date_ui.split("-")[0]
        month = date_ui.split("-")[1]
        day = date_ui.split("-")[2]
        date_obj = date(int(year), int(month), int(day))
        severity_scores = []
        for route in routes_arr:
            severity = 0
            count = 0
            for stop in route:
                latitude = stop["latitude"]
                longitude = stop["longitude"]
                data = stop
                address_data = get_address_info(latitude, longitude)
                data = merge(data, address_data)
                weather_data = get_weather_info(latitude, longitude, date_ui, time)
                data = merge(weather_data, data)
                topology_info = get_topology_info(latitude, longitude)
                data = merge(topology_info, data)
                data['Weekday'] = date_obj.isoweekday()
                data['Year'] = date_obj.year
                data['Month'] = date_obj.month
                model_features = predict_input_format_wrapper(data)
                severity += self.model.predict([model_features])
                count += 1
            severity_scores.append(severity / count)
        routes['severity_scores'] = severity_scores
        return routes



# if __name__ == '__main__':
#     data = {'Start_Lng': -84.058723, 'Start_Lat': 39.865147, 'Side': 'R', 'City': 'Dayton', 'County': 'Montgomery',
#             'State': 'OH', 'Temperature(F)': 36.9, 'Humidity(%)': 91.0, 'Pressure(in)': 29.67, 'Wind_Direction': 'Calm',
#             'Wind_Speed(mph)': 3.5, 'Visibility(mi)': 10.0, 'Sunrise_Sunset': 'Night', 'Crossing': 0.0, 'Give_Way': 0.0,
#             'Railway': 0.0, 'Station': 0.0, 'Traffic_Calming': 0.0, 'Traffic_Signal': 0.0, 'Weekday': 'Mon',
#             'Month': 'Feb', 'Year': 2016.0}
#
#     data = predict_input_format_wrapper(data)
#     model = Model()
#     model.load_model()
#     print(model.predict([data]))