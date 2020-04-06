'This file includes Machine Learning model for predicting accidents'
from sklearn.externals import joblib
from datetime import datetime,date
from Backend.Util.util import get_weather_info, predict_input_format_wrapper, merge, get_address_info, get_topology_info


class Model:

    def __init__(self):
        self.model = self.load_model()

    def load_model(self):
        return joblib.load('ML_model.sav')

    def predict(self, input):
        return self.model.predict(input)


class Inference:

    def __init__(self):
        self.model = Model()
        self.model.load_model()

    def find_safest_path(self, routes):
        # yyyy-mm-dd HH:MM:SS
        travel_time = routes['timeOfTravel']
        date_ui = travel_time.split(" ")[0]
        time = travel_time.split(" ")[1]
        year = date_ui.split("-")[0]
        month = date_ui.split("-")[1]
        day = date_ui.split("-")[2]
        date_obj = date(int(year), int(month), int(day))
        data = get_address_info(routes)
        routes = data['data']
        for route in routes:
            route = route["route"]
            severity = 0
            count = 0
            for stops in route:
                latitude = stops["latitude"]
                longitude = stops["longitude"]
                weather_data = get_weather_info(latitude, longitude, date, time)
                stops = merge(weather_data, stops)
                topology_info = get_topology_info(latitude, longitude)
                stops = merge(topology_info, stops)
                stops['Weekday'] = date_obj.isoweekday()
                stops['Year'] = date_obj.year
                stops['Month'] = date_obj.month
                model_features = predict_input_format_wrapper(stops)
                severity += self.model.predict(model_features)
                count += 1
            route["severity"] = severity / count
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