import React from 'react';
import { Card, Image, OverlayTrigger, Popover } from 'react-bootstrap';
import { wasteColors } from '../NotificationWidget/NotificationWidget';

class BinMarker extends React.Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        severity: 1
    };

    render() {
        return (
            <OverlayTrigger
                trigger="hover"
                key={`${this.props.lat}-${this.props.lng}`}
                placement='top'
                overlay={
                    <Popover style={{width:'200px'}} id={`popover-positioned-top`}>
                        <Popover.Header as="h3" style={{ 
                            fontSize:'13px',
                            background: this.props.color,
                            color: this.props.color === '#1d1d1b' ? 'white' : 'black'
                        }}>
                            <span>{this.props.bin.street} {this.props.bin.orientation_number}</span>
                            <br />
                            <b style={{fontSize:'18px'}}>{this.props.type}</b> ({this.props.bin.volume_in_litres} l.)
                        </Popover.Header>
                        <Popover.Body>
                            {this.props.bin.severity} Alerts.
                        </Popover.Body>
                    </Popover>
                }>
                <div lat={this.props.lat} lng={this.props.lng} style={{
                    borderStyle: 'solid',
                    borderColor: 'white',
                    borderWidth: '2px',
                    display: 'block',
                    width: `${this.props.size}px`,
                    height: `${this.props.size}px`,
                    background: this.props.color,
                    borderRadius: '50%'
                }}>
                    <Image style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        marginLeft: '3px',
                        marginTop: '2px'
                    }}
                        src="./images/bin.svg"
                        width={this.props.size - 10}
                        height={this.props.size - 8}></Image>
                </div>
            </OverlayTrigger>
        )
    }
}

export default BinMarker