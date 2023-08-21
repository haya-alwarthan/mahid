from googleapiclient.discovery import build
from dotenv import load_dotenv
import os
from typing import List

from werkzeug.exceptions import HTTPException

load_dotenv()
YT_API_KEY = os.getenv('YOUTUBE_API_LEY')
youtube = build("youtube", "v3", developerKey=YT_API_KEY)


def get_vids(keywords: List[str]):
    q = "|".join([word for word in keywords])
    youtube = build("youtube", "v3", developerKey=YT_API_KEY)
    try:
        request = youtube.search().list(
            part="snippet",
            maxResults=3,
            type='video',
            q=q
        )
        response = request.execute()
        print("response {}".format(response))
        url = "https://www.youtube.com/embed/{}"
        for item in response["items"]:

            print( "vid id is {}".format(item['id']))

        videos = [url.format(item["id"]["videoId"]) for item in response["items"]]
        return videos
    except HTTPException as e:
        raise HTTPException(e) from e
    except KeyError as e:
        raise KeyError(e) from e
