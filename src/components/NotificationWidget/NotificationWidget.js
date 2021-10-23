import axios from 'axios';
import React from 'react';
import { Card, Table, Pagination } from 'react-bootstrap';

export const wasteColors = {
    'Sklo': '#008e5c',
    'Papier': '#0072bb',
    'Plast': '#ffd413',
    'oleje': '#f36f24',
    'Odpad z čistenia ulic': '#7c4f25',
    'BRO': '#7c4f25',
    'Odpad zo ZZ': '#1d1d1b',
    'Zmiešaný odpad': '#1d1d1b',
    'KBRO': '#e30711',
    'Gastro': '#f07e01'
}

export const wasteTags = {
    'Sklo': 'SKLO',
    'Papier': 'PAPIER',
    'Plast': 'PLAST',
    'Odpad zo ZZ': 'ZMES',
    'oleje': 'GASTRO',
    'Odpad z čistenia ulic': 'BRO',
    'BRO': 'BRO',
    'Zmiešaný odpad': 'ZMES',
    'KBRO': 'KOV',
    'Gastro': 'GASTRO'
}

class NotificationWidget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            maxPage: 5,
            perPage: 20,
            page: 1,
            notifications: []
        }
    }

    static defaultProps = {
        notifications: [
            {
                rfid: '19u301j0',
                address: 'Pri starej prachárni 2',
                volume: '250 l',
                date: `${new Date().toLocaleString("en-US")}`
            }
        ]
    }

    componentDidMount() {
        axios.get('http://20.105.168.42/api/dashboard/notifications'
        ).then(res => {
            console.log(res.data)
            this.setState({
                notifications: res.data,
                maxPage: Math.ceil(res.data.length / this.state.perPage)
            })
        }).catch(err => {
            console.error('Getting notifs error:', err)
        })
    }

    handlePageChange(e, i) {
        if (this.state.page !== i) {
            this.setState({
                page: i
            })
            // setLoadingCollection(true)
        }
    }

    handlePageNext(e) {
        if (this.state.page < this.state.maxPage) {
            let newPage = this.state.page + 1
            this.setState({
                page: newPage
            })
            // setLoadingCollection(true)
        }
    }

    handlePagePrev(e) {
        if (this.state.page > 1) {
            this.setState({
                page: this.state.page - 1
            })
            // setLoadingCollection(true)
        }
    }

    BetterPagination() {
        let numbers
        if (this.state.maxPage < 6)
            numbers = Array.from(Array(this.state.maxPage), (_, i) => i + 1)
        else if (this.state.page - 3 < 0)
            numbers = [1, 2, 3, 4, 5]
        else if (this.state.page + 3 - this.state.maxPage > 0)
            numbers = [this.state.maxPage - 4, this.state.maxPage - 3, this.state.maxPage - 2, this.state.maxPage - 1, this.state.maxPage]
        else
            numbers = [this.state.page - 2, this.state.page - 1, this.state.page, this.state.page + 1, this.state.page + 2]

        return <Pagination size='sm' variant='light' style={{
            justifyContent: 'center'
        }}>
            <Pagination.First disabled={this.state.page === 1} onClick={e => this.handlePageChange(e, 1)} />
            <Pagination.Prev disabled={this.state.page === 1} onClick={e => this.handlePagePrev(e)} />

            {
                numbers.map((n) =>
                    <Pagination.Item key={n} active={n === this.state.page} onClick={e => this.handlePageChange(e, n)}>{n}</Pagination.Item>
                )
            }

            <Pagination.Next disabled={this.state.page === this.state.maxPage} onClick={e => this.handlePageNext(e)} />
            <Pagination.Last disabled={this.state.page === this.state.maxPage} onClick={e => this.handlePageChange(e, this.state.maxPage)} />
        </Pagination>
    }

    render() {
        return (
            <Card style={{ textAlign: 'left', margin: '20px', padding: '10px', height: '80vh' }}>
                <Card.Title>WasteBin Alerts</Card.Title>
                <Table style={{tableLayout:'fixed'}} borderless striped hover size="sm">
                    <thead>
                        <th style={{ width: '15%' }}>Part</th>
                        <th style={{ width: '20%' }}>Address</th>
                        <th style={{ width: '10%' }}>Severity</th>
                        <th style={{ width: '10%' }}>Volume</th>
                        <th style={{ width: '10%' }}>Type</th>
                    </thead>
                    <tbody>
                        {
                            this.state.notifications.slice((this.state.page - 1) * this.state.perPage, (this.state.page - 1) * this.state.perPage + this.state.perPage).map(n =>
                                <tr>
                                    <td style={{width:'100px', whiteSpace:'nowrap', overflow:'hidden', textOverflow: 'ellipsis'}}>{n.city_part}</td>
                                    <td style={{width:'100px', whiteSpace:'nowrap', overflow:'hidden', textOverflow: 'ellipsis'}}>{n.street} {n.orientation_number}</td>
                                    <td>{n.severity}</td>
                                    <td>{n.volume_in_litres} l</td>
                                    <td style={{
                                        backgroundColor: wasteColors[n.waste_type],
                                        textAlign: 'center',
                                        color: wasteTags[n.waste_type] == 'ZMES' ? 'white' : 'black'
                                    }}>
                                        <b>{wasteTags[n.waste_type]?wasteTags[n.waste_type]:n.waste_type}</b>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
                {this.BetterPagination()}
            </Card>
        )
    }
}

export default NotificationWidget;