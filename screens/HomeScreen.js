import { SafeAreaView, StyleSheet, View, Image,Text} from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames';
import NavOptions from '../components/NavOptions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from 'react-redux';
import { setOrigin, setDestination } from '../slices/navSlice';

// GOOGLE_MAPS_APIKEY = "AIzaSyC_8W89yRgVkunmWOpiBQk7jYsc4yqX7OE";
GOOGLE_MAPS_APIKEY = "AIzaSyBHSuonafqMq1U368eSJ8sGnEi_ISbxdr8";
const HomeScreen = () => {
    const dispatch = useDispatch();
    return (
        <SafeAreaView style={tw`bg-white`}>
            {/* <View style={tw`p-5`}>
                <Text >Herway</Text>
                <Image
                    style={
                        {
                            width: 100,
                            height: 100,
                            resizeMode: "contain"
                        }
                    }
                    source={{
                        uri: "https://links.papareact.com/gzs",
                    }}
                />
            </View>
            <View>
                <Image source={require('../assets/herwaylogo.png')}>

                </Image>
            </View> */}


            <View style={tw`py-10`}>
                {/* <Text >Herway</Text> */}
                <Image
                    style={
                        {
                            width: 300,
                            height: 100,
                            resizeMode: "contain"
                        }
                    }
                    source={require('../assets/herwaylogo.png')}
                />
            </View>


            <GooglePlacesAutocomplete
                styles={{
                    container: {
                        flex: 0,
                    },
                    textInput: {
                        fontSize: 18,
                    },
                }}
                minLength={2}
                enablePoweredByContainer={false}
                onPress={(data, details = null) => {
                    dispatch(setOrigin({
                        location: details.geometry.location,
                        description: data.description,
                    }));
                    dispatch(setDestination(null));
                }}
                fetchDetails={true}
                placeholder='Where from?'
                query={{
                    key: GOOGLE_MAPS_APIKEY,
                    language: "en",
                }}
                nearbyPlacesAPI='GooglePlacesSearch'
                debounce={400}
            />
            
            <NavOptions />
        </SafeAreaView >
    )
}

export default HomeScreen;

const styles = StyleSheet.create({});