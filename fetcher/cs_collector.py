import re
import requests
import base64
from bs4 import BeautifulSoup
from difflib import get_close_matches

ROOT_URL = 'https://www.cinemascore.com/publicsearch/ajax/title/'

class CSCollector:

    def get_score(movie_name):
        print("Finding CinemaScore for", movie_name)
        html = get_html(movie_name)
        if html:
            return find_score(html, movie_name)
        return None

def get_html(movie_name):
    """
    Make a request to cinemascore endpoint
    """
    encoded_name =  base64.b64encode(movie_name.encode('utf-8'))
    response = requests.get(ROOT_URL + encoded_name.decode('utf-8'))
    if response.status_code == 200:
        return response.text
    print('Got error code %d', response.status_code)
    return None

def find_score(html, movie_name):
    """
    Finds score from the html page
    """
    soup = BeautifulSoup(html, 'html.parser')
    results = {}
    entries = soup.find_all('tr')
    for entry in soup.find_all('tr'):
        if not entry.find('td'):
            print('Failed to get any entries for ', movie)
            return None
        movie_name = entry.find('td',{'class': 'movie'}).get_text()
        movie_grade = entry.find('td',{'class': 'grade'}).find('img')['alt']
        results[movie_name] = movie_grade

    best_match = get_close_matches(movie_name, list(results.keys()), n=1)[0]
    return results[best_match]



# if __name__ == '__main__':
#     print(CSCollector.get_score('Ant-Man'))
