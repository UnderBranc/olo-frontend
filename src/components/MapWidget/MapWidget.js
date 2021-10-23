import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Card, Image } from 'react-bootstrap';
import axios from 'axios';
import BinMarker from './BinMarker';
import { CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const API_KEY = 'AIzaSyCp5_r8YXqn1XFa589X1hpumAogDcJ7I4Q'

class MapWidget extends React.Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            garbageBins: []
        };
    }

    randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    getBinData() {
        axios.get(
            'http://20.105.168.42/api/dashboard/bins'
        ).then(res => {
            console.log(res)
            this.setState({
                garbageBins: res.data.map(e => {
                    return {
                        ...e,
                        severity: this.randomIntFromInterval(0, 2)
                    }
                })
            })
        }).catch(err => {
            console.error('Getting Bin Data Error:', err)
        })
    }

    componentDidMount() {
        this.getBinData()
    }

    render() {
        return (
            <Card style={{ textAlign: 'left', margin: '20px', padding: '10px', height: '80vh' }}>
                <Card.Title>Garbage Bin Map</Card.Title>
                <div style={{ height: '80vh', width: '100%' }}>
                    <GoogleMapReact
                        center={this.props.center}
                        zoom={this.props.zoom}
                        bootstrapURLKeys={{ key: API_KEY }}
                        defaultCenter={this.props.center}
                        defaultZoom={this.props.zoom}
                    >
                        {
                            this.props.districts.map((mark, i) =>
                                <div lat={mark.lat} lng={mark.lng} style={{
                                    width: `${mark.percentage + 50}px`,
                                    height: `${mark.percentage + 50}px`,
                                    textAlign:'center',
                                    paddingTop:`${(mark.percentage + 50)/2-10}px`,
                                    borderRadius: '50%',
                                    backgroundColor: 'darkblue',
                                    opacity: mark.percentage/100,
                                    color:'white'
                                }}>
                                    <div>
                                        <b style={{display:'block'}}>{mark.name}</b>
                                        <span>{mark.percentage}%</span>
                                    </div>
                                </div>
                            )
                        }
                    </GoogleMapReact>
                </div>
            </Card>
        );
    }
}

{/* <BinMarker key={i} severity={loc.severity} size={19} lat={loc.lat} lng={loc.lng} /> */ }

// import React from 'react'
// import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
// import { Marker } from '@react-google-maps/api';
// import BinMarker from './BinMarker';


// const API_KEY = 'AIzaSyCp5_r8YXqn1XFa589X1hpumAogDcJ7I4Q'

// const containerStyle = {
//     width: '400px',
//     height: '400px'
// };

// function MapWidget() {

//     const center = {
//         lat: 48.148598,
//         lng: 17.107748
//     };

//     const { isLoaded } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: API_KEY
//     })

//     const [map, setMap] = React.useState(null)

//     const onLoad = React.useCallback(function callback(map) {
//         const bounds = new window.google.maps.LatLngBounds();
//         map.fitBounds(bounds);
//         setMap(map)
//     }, [])

//     const onUnmount = React.useCallback(function callback(map) {
//         setMap(null)
//     }, [])

//     return isLoaded ? (
//         <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={center}
//             zoom={10}
//             onLoad={onLoad}
//             onUnmount={onUnmount}
//         >
//             { /* Child components, such as markers, info windows, etc. */}
//             <Marker position={center} icon={'./images/bin.svg'} />
//         </GoogleMap>
//     ) : <></>
// }

// export default React.memo(MapWidget)


export default MapWidget