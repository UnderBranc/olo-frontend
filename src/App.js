import './App.scss';
import { Navbar, Nav, Container, Row, Card, Col, Button, ButtonGroup, ProgressBar, FloatingLabel, Form } from 'react-bootstrap'
import MapWidget from './components/MapWidget/MapWidget';
import NotificationWidget, { wasteColors, wasteTags } from './components/NotificationWidget/NotificationWidget';
import { useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';


const defaultZoom = 12
const defaultCenter = {
  lat: 48.148598,
  lng: 17.107748
}

const waste = [
  { 'tag': 'SKLO', 'color': '#008e5c', textColor: 'black' },
  { 'tag': 'PAPIER', 'color': '#0072bb', textColor: 'black' },
  { 'tag': 'PLAST', 'color': '#ffd413', textColor: 'black' },
  { 'tag': 'ZMES', 'color': '#1d1d1b', textColor: 'white' },
  { 'tag': 'GASTRO', 'color': '#f07e01', textColor: 'black' },
  { 'tag': 'BRO', 'color': '#7c4f25', textColor: 'black' },
  { 'tag': 'KOV', 'color': '#e30711', textColor: 'black' }
]

const COLORS = waste.map(w => {
  return w.color;
})

function App() {
  const [districts, setDistricts] = React.useState([
    { 'name': 'Devín', 'lat': 48.17576940000001, 'lng': 16.9822035, "total": 85, "percentage": 50 },
    { 'name': 'Devínska Nová Ves', 'lat': 48.2124272, 'lng': 16.977857450000002, "total": 252, "percentage": 50 },
    { 'name': 'Dúbravka', 'lat': 48.18664769999999, 'lng': 17.0307259, "total": 99, "percentage": 50 },
    { 'name': 'Jarovce', 'lat': 48.0656973, 'lng': 17.1130712, "total": 198, "percentage": 50 },
    { 'name': 'Karlova Ves', 'lat': 48.1586236, 'lng': 17.0567608, "total": 65, "percentage": 50 },
    { 'name': 'Nové Mesto', 'lat': 48.171957, 'lng': 17.1116032, "total": 496, "percentage": 50 },
    { 'name': 'Petržalka', 'lat': 48.1264994, 'lng': 17.093808, "total": 77, "percentage": 50 },
    { 'name': 'Podunajské Biskupice', 'lat': 48.12717869999999, 'lng': 17.2129755, "total": 362, "percentage": 50 },
    { 'name': 'Rača', 'lat': 48.2089267, 'lng': 17.1526131, "total": 5, "percentage": 50 },
    { 'name': 'Rusovce', 'lat': 48.0482758, 'lng': 17.1482599, "total": 131, "percentage": 50 },
    { 'name': 'Ružinov', 'lat': 48.14632169999999, 'lng': 17.1686429, "total": 129, "percentage": 50 },
    { 'name': 'Staré Mesto', 'lat': 48.1527568, 'lng': 17.0916014, "total": 502, "percentage": 50 },
    { 'name': 'Vajnory', 'lat': 48.1985806, 'lng': 17.201461, "total": 2, "percentage": 50 },
    { 'name': 'Vrakuňa', 'lat': 48.1448249, 'lng': 17.2028947, "total": 9, "percentage": 50 },
    { 'name': 'Záhorská Bystrica', 'lat': 48.24226059999999, 'lng': 17.0543847, "total": 2, "percentage": 50 },
    { 'name': 'Čunovo', 'lat': 48.0303903, 'lng': 17.194552350000002, "total": 94, "percentage": 50 }
  ])
  const [mapCenter, setMapCenter] = React.useState(defaultCenter)
  const [mapZoom, setMapZoom] = React.useState(defaultZoom)
  const [selected, setSelected] = React.useState('')
  const [alerts, setAlerts] = React.useState('')
  const [binTypes, setBinTypes] = React.useState(waste.map(w => w.tag))


  const getPieData = () => {
    let bins = getBins();
    if (!bins)
      return [];
    let bean = waste.map(w => {
      return {
        name: w.tag,
        value: bins.filter(bin =>
          wasteTags[bin.waste_type] === w.tag
        ).length
      }
    })
    console.log(bean);
    return bean;
  }

  const renderLabel = function(entry) {
    return entry.name;
  }

  const getBinData = () => {
    axios.get(
      'http://20.105.168.42/api/dashboard/notifications'
    ).then(res => {
      // console.log(res.data)
      setDistricts(
        districts.map(d => {
          let alertCount = res.data.filter(a => a.city_part.toLowerCase() === d.name.toLowerCase()).length
          return {
            ...d,
            alertCount: alertCount,
            percentage: Math.floor(
              alertCount / d.total * 100
            ),
            zoom: 14
          }
        })
      )

      setAlerts(res.data)
    }).catch(err => {
      console.error('Getting Bin Data Error:', err)
    })
  }

  useEffect(() => {
    getBinData()
  }, [])

  const barColor = (p) => {
    switch (Math.ceil(p / 33)) {
      case 1:
        return 'success';
      case 2:
        return 'warning';
      default:
        return 'danger';
    }
  }

  const resetMap = () => {
    setMapCenter(defaultCenter)
    setMapZoom(defaultZoom)
    setSelected('')
  }

  const handleSelectDistrict = (d) => {
    if (selected === d.name) {
      resetMap()
    } else {
      setMapCenter({
        lat: d.lat,
        lng: d.lng
      })
      setMapZoom(d.zoom)
      setSelected(d.name)
    }
  }

  const isChecked = (bin) => {
    if (binTypes.includes(wasteTags[bin.waste_type])) {
      return true
    }
    return false
  }

  const getBins = () => {
    if (selected) {
      return alerts.filter(isChecked).filter(a => a.city_part.toLowerCase() === selected.toLowerCase())
    }
    return alerts
  }

  const getAlerts = () => {
    if (selected) {
      return alerts.filter(isChecked).filter(a => a.city_part.toLowerCase() === selected.toLowerCase())
    }
    if (alerts) {
      return alerts.filter(isChecked)
    }
    return alerts
  }

  const handleCheck = (tag) => {
    if (binTypes.includes(tag)) {
      let updated = binTypes.filter(t => t !== tag)
      setBinTypes(
        updated
      )
    } else {
      let updated = [...binTypes, tag]
      setBinTypes(updated)
    }
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">UnderBranc</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link active href="#dashboard">Dashboard</Nav.Link>
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
              <Button active={selected === d.name} onClick={e => handleSelectDistrict(d)} variant="outline-secondary" style={{ border: 'none', width: '190px', padding: '5px', margin: '6px' }}>
                {d.name}
                <ProgressBar label={`${d.percentage}%`} variant={barColor(d.percentage)} animated now={d.percentage} />
              </Button>
            )
          }
        </div>
        <Card bg="light" style={{ padding: '10px', margin: 'auto', marginLeft: '20px', marginRight: '20px', height: '80px' }}>
          <Card.Title>
            Bin Filtering
          </Card.Title>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            {
              waste.map(w =>
                <Form.Check
                  checked={binTypes.includes(w.tag)}
                  onChange={e => { handleCheck(w.tag) }}
                  style={{ display: 'inline-block', marginLeft: '10px', borderBottomStyle: 'solid', borderBottomWidth: '2px', borderColor: w.color }}
                  type="checkbox"
                  label={w.tag} />
              )
            }
          </Form.Group>
        </Card>
        <div>
          <div style={{ float: 'left', width: '60%' }}>
            <MapWidget
              bins={getBins()}
              part={selected}
              center={mapCenter}
              zoom={mapZoom}
              districts={districts} />
          </div>
          <div style={{ float: 'left', width: '40%' }}>
            <NotificationWidget alerts={getAlerts()} part={selected} />
          </div>
          <div>
            <h2 style={{ textAlign: 'center' }}>Data visualization</h2>
            <Card bg="light" style={{ padding: '10px', margin: 'auto', marginLeft: '20px', marginRight: '20px'}}>
              <Card.Title>
                Waste Type Distribution
              </Card.Title>
              <PieChart width={400} height={400}>
                <Pie
                  data={getPieData()}
                  cx={200}
                  cy={200}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={renderLabel}
                >
                  {getPieData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;