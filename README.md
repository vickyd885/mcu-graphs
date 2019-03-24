# MCU Graphs

[View the graphs](https://vickyd885.github.io/mcu-graphs/site/)

## Motivations

The MCU is vast and with so many movies, it's always interesting to compare
them against each other, or compare phases or just to see the success over
the last 10 years in some visual way.

## The dataset

You can view the entire dataset used to create the graphs [here](https://vickyd885.github.io/mcu-graphs/site/datasets/mcu_data_locked.json)

It's free to use and share :)

## Gathering data

A bit of data scrapping fun, I (currently) scrape 3 main sources
- Box Office Mojo
- CinemaScore
- Rotten Tomatoes

Relevant pages are stored as rendered strings (not HTML) and regex is used to
extract the data I am after.

(Detour, skip this if you want: Apparently, people have tried to use HTML based
scrapping but the sites change their tags, but with regex on actual content,
it should be more resilient to change as they have to state the data for people
to view)

All the data is labelled and stored in a JSON file.

### Running the collectors

Requirements:
- Python3
- VirtualEnv

```bash
cd fetcher
virtualenv env
source env/bin/activate
pip install -r requirements.txt
cat movie_links.csv # This file holds all the metadata, e.g link to RT
python3 main.py
cat mcu_data.json # Collected results
```

### Running the website

```bash
cp fetcher/mcu_data.json site/datasets/mcu_data_locked.json
cd site
python3 -m http.server
```
