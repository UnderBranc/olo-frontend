import './App.scss';
import { Navbar, Nav, Container, Row, Card, Col, Button, Table, ProgressBar } from 'react-bootstrap'
import MapWidget from './components/MapWidget/MapWidget';
import NotificationWidget from './components/NotificationWidget/NotificationWidget';
import { useEffect } from 'react';
import React from 'react';

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function App() {
  const [districts, setDistricts] = React.useState([
    { 'name': 'Devín', 'lat': 48.17576940000001, 'lng': 16.9822035 },
    { 'name': 'Devínska Nová Ves', 'lat': 48.2124272, 'lng': 16.977857450000002 },
    { 'name': 'Dúbravka', 'lat': 48.18664769999999, 'lng': 17.0307259 },
    { 'name': 'Jarovce', 'lat': 48.0656973, 'lng': 17.1130712 },
    { 'name': 'Karlova Ves', 'lat': 48.1586236, 'lng': 17.0567608 },
    { 'name': 'Nové Mesto', 'lat': 48.1698824, 'lng': 17.1151527 },
    { 'name': 'Petržalka', 'lat': 48.1264994, 'lng': 17.093808 },
    { 'name': 'Podunajské Biskupice', 'lat': 48.12717869999999, 'lng': 17.2129755 },
    { 'name': 'Rača', 'lat': 48.2089267, 'lng': 17.1526131 },
    { 'name': 'Rusovce', 'lat': 48.0482758, 'lng': 17.1482599 },
    { 'name': 'Ružinov', 'lat': 48.14632169999999, 'lng': 17.1686429 },
    { 'name': 'Staré Mesto', 'lat': 48.1527568, 'lng': 17.0916014 },
    { 'name': 'Vajnory', 'lat': 48.1985806, 'lng': 17.201461 },
    { 'name': 'Vrakuňa', 'lat': 48.1448249, 'lng': 17.2028947 },
    { 'name': 'Záhorská Bystrica', 'lat': 48.24226059999999, 'lng': 17.0543847 },
    { 'name': 'Čunovo', 'lat': 48.0303903, 'lng': 17.194552350000002 }
  ])
  const [mapCenter, setMapCenter] = React.useState({
    lat: 48.148598,
    lng: 17.107748
  })
  const [mapZoom, setMapZoom] = React.useState(12)

  useEffect(() => {
    let enhanced = districts.map(
      d => { return { ...d, percentage: randomIntFromInterval(0, 100), zoom:14 } }
    )
    setDistricts(enhanced)
  }, [])

  const barColor = (p) => {
    console.log(p, Math.ceil(p / 20))
    switch (Math.ceil(p / 33)) {
      case 1:
        return 'success';
      case 2:
        return 'warning';
      default:
        return 'danger';
    }
  }

  const handleSelectDistrict = (d) => {
    setMapCenter({
      lat: d.lat,
      lng: d.lng
    })
    setMapZoom(d.zoom)
  }

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">UnderBranc</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link active href="#home">Dashboard</Nav.Link>
            {/* <Nav.Link href="#features">Features</Nav.Link> */}
            <Nav.Link href="#pricing">About</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <div className="body" style={{ width: '95%', margin: 'auto', height: '100vh' }}>
        <br />
        <div style={{ width: '100%', margin: 'auto', height: '150px', textAlign: 'center', marginBottom: '40px' }}>
          <h3>Overview</h3>
          {
            districts.map(d =>
              <Button onClick={e=>handleSelectDistrict(d)} variant="light" style={{ width: '190px', padding: '5px', margin: '6px' }}>
                {d.name}
                <ProgressBar label={`${d.percentage}%`} variant={barColor(d.percentage)} animated now={d.percentage} />
              </Button>
            )
          }
        </div>
        <div>
          <div style={{ float: 'left', width: '60%' }}>
            <MapWidget center={mapCenter} zoom={mapZoom} districts={districts}/>
          </div>
          <div style={{ float: 'left', width: '40%' }}>
            <NotificationWidget />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
