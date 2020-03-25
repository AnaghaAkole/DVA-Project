'This file includes Machine Learning model for predicting accidents'
from sklearn.externals import joblib


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

    def find_safest_path(self, routes):

        for route in routes:
            # call google map api
            # call dark sky API
            # call open street maps API
            pass
