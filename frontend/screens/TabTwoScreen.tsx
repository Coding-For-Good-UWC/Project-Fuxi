import {Button, StyleSheet} from 'react-native';
import { Text, View } from '../components/Themed';
import { useEffect, useState } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

var preferences = [];
var currentlyPlaying = -1;

type NominalSetState = React.Dispatch<React.SetStateAction<TState>> &
  { readonly __brand_setState__: unique symbol }

function useNominalState(init: TState) {
    return useState<TState>(init) as [TState, NominalSetState]
}

const token = "BQBtsNJVgwLrYW4rUTQQwV22HecsJd5YewnE40ikoWFByOmorGTVeRriXePfpa-ll4JlhJFO1yO02eOO5lR6MiitOuvR_IOX0x4nTsqvAoItB5BeJaijDZ1hmd1pnhMR_SqoW3d0WFxSsPEgMghVqTrytVVVO4tTpiDDR3TPNLrdnrzzo71bkTe9OaipmKXvZV1xNhrVg60T59ziVCpa_ELRrU-QK4NbQoegPoIZ-2llBegTHA"
const initSpotify =  (set) => {
    console.log(set);
    return async () => {
        console.log(set);
        //Load preferences for user
        const result = await fetch('http://localhost:8080/v1/user_preferences/info', {
          method: 'GET',
          credentials: 'include',
        }).then(res => res.json())
        if (result.status !== 'ok'){
          alert(result.error_message)
        } else {
            preferences=result.data
        }
        //Get a weighted random song
        getWeightedRandomSpotifyURI(0, set)();
    }
}
const getWeightedRandomSpotifyURI = (pscore, setURI) => {
    return async () => { 
        console.log("Updated score " + pscore);
        //Test with database with 5 songs
        //Choose random from 0-4, add extra chances proportional to score beyond from 4+
        let random = Math.floor(Math.random()*(5 + (preferences.length > 0 ? preferences.reduce((total, track) => total+track.score):0)))

        //Calculate backwards to the song_id --> if >=5 then work backwards from preference. 
        //Note that order doesn't matter here (even if the tracks are in a random order, we get the song_id)
        let track = random<5 ? random: preferences.find(track => { random -= track.score; random <= 0 }).song_id;

        if (pscore != 0){
            const res = await fetch('http://localhost:8080/v1/user_preferences/update', {
                method: 'POST',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                  "song_id": currentlyPlaying,
                  "score": pscore
                })
            }).then(res => res.json())
            if (res.status !== 'ok'){
                alert(res.error_message)
            }
        }
        //Get track's spotify URI from our database
        let uri = await fetch('http://localhost:8080/v1/song/info/'+track, {
          method: 'GET',
          credentials: 'include',
        }).then(res => res.json())
        if (uri.status == 'ok'){
            currentlyPlaying = uri.data.id;
            console.log(setURI);
            setURI(["spotify:track:"+setURI.data.spotify_uri])
        } else {
            alert(uri.error_message)
        }
    }
}

export default function TabTwoScreen() {

    const [URIs, setURIs] = useNominalState([]);
    useEffect(initSpotify(), []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Player</Text>
            <SpotifyPlayer loaded={initSpotify(setURIs)} token={token} uris={[URIs]}/>
            <Button title={"Like"} onPress={getWeightedRandomSpotifyURI(1, setURIs)} id="like-button"/>
            <Button title={"Dislike"} onPress={getWeightedRandomSpotifyURI(-1, setURIs)} id="dislike-button"/>
            <Button title={"Skip"} onPress={getWeightedRandomSpotifyURI(0, setURIs)} id="skip-button"/>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});