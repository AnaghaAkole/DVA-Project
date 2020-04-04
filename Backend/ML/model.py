'This file includes Machine Learning model for predicting accidents'
from sklearn.externals import joblib
from datetime import datetime
from Backend.Util.util import get_weather_info, predict_input_format_wrapper,merge,get_address_info


class Model:

    def __init__(self):
        self.model = self.load_model()

    def load_model(self):
        return joblib.load('model.pkl')

    def predict(self, input):
        return self.model.predict(input)


class Inference:

    def __init__(self):
        self.model = Model()

    def get_current_timestamp(self):
        now = datetime.now()
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        return dt_string

    def find_safest_path(self, routes):
        current_date_time = self.get_current_timestamp()
        data = get_address_info(routes)
        routes = data['data']
        for route in routes:
            route = route["route"]
            severity = 0
            count = 0
            for stops in route:
                latitude = stops["latitude"]
                longitude = stops["longitude"]
                weather_data = get_weather_info(latitude, longitude, current_date_time)
                stops = merge(weather_data, stops)
                # call open street maps API
                model_features = predict_input_format_wrapper(stops)
                severity += self.model.predict(model_features)
                count += 1
            route["severity"] = severity / count
        return routes
