from flask import Flask, jsonify, render_template, redirect, url_for, request, make_response
from ytmusicapi import YTMusic
import json

app = Flask(__name__)

ytmusic = YTMusic("oauth.json") 

@app.route('/api/search/<query>')
def search(query):
    print(query)
    results = { 
        'tracks': [
            {
                'title': x['title'],
                'vid': x['videoId'],
                'thumb': x['thumbnails'][len(x['thumbnails'])-1]['url'],
                'author': x['artists'][0]['name'],
                'year': x['year']
            } 
            for x in ytmusic.search(query, filter="songs", limit=2)
            # if x['videoDetails']['lengthSeconds'] < 600
        ]
    }
    print("RESULTS: ", results)
    return jsonify(results)

@app.route('/api/song/<id>')
def song(id):
    return jsonify(ytmusic.get_song(id))
