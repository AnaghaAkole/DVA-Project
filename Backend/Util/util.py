'This file includes helper functions that are useful for ML model'
import asyncio
import darksky_async
from darksky.types import languages, units, weather
async def get_weather_info():
    client = darksky_async.Client("b299af3ff2d76cdfd211d92bc24374da")

    weather = await client.forecast(
        37.8267, # latitude
        -122.4233 ,# longitude

        # default `False`
        lang=languages.ENGLISH,  # default `ENGLISH`
        values_units=units.AUTO,  # default `auto`
        timezone='UTC'
    )
    print(weather.currently)
    print(weather.daily.data[0].timeLocal)
    print(weather.latitude)

loop = asyncio.get_event_loop()
loop.run_until_complete(get_weather_info())
loop.close()