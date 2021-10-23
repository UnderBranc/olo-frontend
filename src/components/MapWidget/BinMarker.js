import React from 'react';
import { Card, Image } from 'react-bootstrap';

class BinMarker extends React.Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        severity: 1
    };

    severityColor() {
        return ['#969696', '#945c5c', '#751717'][this.props.severity]
    }

    render() {
        return (
            <div lat={this.props.lat} lng={this.props.lng} style={{
                borderStyle: 'solid',
                borderColor: 'white',
                borderWidth:'2px',
                display: 'block',
                width: `${this.props.size}px`,
                height: `${this.props.size}px`,
                background: this.severityColor(),
                borderRadius: '50%'
            }}>
                <Image style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    marginLeft: '2px',
                    marginTop: '2px'
                }}
                    src="./images/bin.svg"
                    width={this.props.size - 8}
                    height={this.props.size - 8}></Image>
            </div>
        )
    }
}

export default BinMarker