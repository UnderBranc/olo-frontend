import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Card, Image } from 'react-bootstrap';
import axios from 'axios';
import BinMarker from './BinMarker';
import { CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { wasteColors, wasteTags } from '../NotificationWidget/NotificationWidget';

const API_KEY = 'AIzaSyCp5_r8YXqn1XFa589X1hpumAogDcJ7I4Q'

class MapWidget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            garbageBins: []
        };
    }

    render() {
        return (
            <Card style={{ textAlign: 'left', margin: '20px', padding: '10px', height: '80vh' }}>
                <Card.Title>Garbage Bin Map{this.props.part? ` - ${this.props.part}` : ''}</Card.Title>
                <div style={{ height: '80vh', width: '100%' }}>
                    <GoogleMapReact
                        center={this.props.center}
                        zoom={this.props.zoom}
                        bootstrapURLKeys={{ key: API_KEY }}
                        defaultCenter={this.props.center}
                        defaultZoom={this.props.zoom}
                    >
                        {
                            this.props.part ? this.props.bins.map((bin, i) =>
                                <BinMarker bin={bin} type={wasteTags[bin.waste_type]} color={wasteColors[bin.waste_type]} lat={bin.lat} lng={bin.lng} size={25}/>
                            ) : this.props.districts.map((mark, i) =>
                                <div lat={mark.lat} lng={mark.lng} style={{
                                    width: `${100*mark.total/600 + 50}px`,
                                    height: `${100*mark.total/600 + 50}px`,
                                    textAlign:'center',
                                    paddingTop:`${(100*mark.total/600 + 50)/2-15}px`,
                                    borderRadius: '50%',
                                    backgroundColor: 'darkblue',
                                    opacity: mark.percentage/100,
                                    color:'white',
                                    transform: 'translate(-50% -50%)'
                                }}>
                                    <div>
                                        <b style={{display:'block'}}>{mark.name}</b>
                                        <span>{mark.alertCount} alerts</span>
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

export default MapWidget