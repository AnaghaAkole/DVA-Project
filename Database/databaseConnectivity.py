'This file is for database connectivity'

import sqlite3


class Database:
    __instance = None

    def __new__(cls, *args, **kwargs):
        """
        Ensure that only one instance of the class is created because the class is intended
        to be a singleton class.
        """
        if Database.__instance is None:
            Database.__instance = super().__new__(cls)
            Database.__instance.connection = cls.create_connection()
        return Database.__instance

    @classmethod
    def create_connection(cls):
        return sqlite3.connect('Database/pythonsqlite.db', check_same_thread=False)

    def execute(self, query):
        return self.connection.execute(query)

    def execute_query_with_params(self, query, params):
        return self.connection.execute(query, params)