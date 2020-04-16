DESCRIPTION
The package 'DVA-Project' contains three major modules. The 'Backend' module contains the REST-API logic which will fetch data from different sources and feed it to the model. We are using the dark sky API to fetch weather details, geopy library to fetch address details and overpass python API to fetch the topology details for the given co-ordinates. Once all the data is retreived, it is fed to the ML model to get the predicted accident severity. On the model side , we are using random forest classifier to predict the accident severity using the given features. We are using FastAPI framework to run queries and fetch data from sqlite database which is required for visulaization purposes.
The 'Database' module contains code to connect to sqlite3 database to retreive data.
The 'Frontend' module contains all the client side code which uses d3.js to render all different kinds of visualizations.
Link to the dataset: https://drive.google.com/drive/folders/1rmV3UbXcqnyv3CBIltTVmZ_FIlrGjGQ-

INSTALLATION
1. We have used python 3.7 to implement our code. Download the following python libraries using pip install.
os, json, joblib, datetime, requests, geopy, urllib3, sqlite3, uvicorn, fastapi, starlette
2. For setting up the database, download the pythonsqlite.db file from https://drive.google.com/open?id=1rmV3UbXcqnyv3CBIltTVmZ_FIlrGjGQ- and place it under Database/ folder
3. Download the trained model (ML_model_updated.zip) from https://drive.google.com/file/d/1Y-3kqyuqU55FQFgTzvmxt4s8ISU832-E/view?usp=sharing . Unzip it and place the ML_model_updated.sav file inside Backend/ML/ folder

EXECUTION
1. For running the Backend application go to DVA-Project/ folder and run the command uvicorn main:app --reload.
   Confirm if the application has started correctly by hitting the URL http://localhost:8000/. 
   {"Hello":"World"} should get displayed.
2. Once the backend application starts correctly, go to the Frontend/ directory to start the client. Use the command 
	python3 -m http.server 8080 
   to run the client.
3. Once the client is up, go to the url http://localhost:8080. You should see the home page is loaded showing the google map on left side and a list menu on the right.
4. In the Start and End boxes, select the start and destination cities respectively. (Only city names are accepted as source/destination. Once you type more than 3 words you should see a list suggesting different city names.) e.g. Start: Los Angeles, End: Chicago
5. Click on 'Find' button. The request will take 30-60 seconds to complete. Once it completes, safest route is shown on the google map in green color. The most accident prone route is shown in grey color. If there is a single route between two places, only one route is shown as the result.
6. You can use the list menu to see other statistics like monthly, yearly and, day wise accident stats, road topology wise stats and accident hotspots in USA.

