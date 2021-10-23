import axios from 'axios';
import React from 'react';
import { Card, Table, Pagination } from 'react-bootstrap';

const wasteColors = {
    'sklo': '#008e5c',
    'papier': '#0072bb',
    'plasty': '#ffd413',
    'oleje': '#f36f24',
    'BRO': '#7c4f25',
    'zmes': '#1d1d1b',
    'kov': '#e30711',
    'napoje': '#f07e01'
}

class NotificationWidget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            maxPage: 5,
            perPage: 19,
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

        return <Pagination size='sm' style={{
            position: 'absolute',
            bottom: '10px',
            marginTop: '10px',
            left: '20%'
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
            <Card style={{ textAlign: 'left', margin: '20px', padding: '10px', height: '80vh', position: 'relative' }}>
                <Card.Title>WasteBin Alerts</Card.Title>
                <Table striped hover size="sm">
                    <thead>
                        <th>Type</th>
                        <th>ID</th>
                        <th>Severity</th>
                        <th>Part</th>
                        <th>Address</th>
                    </thead>
                    <tbody>
                        {
                            this.state.notifications.slice((this.state.page - 1) * this.state.perPage, (this.state.page - 1) * this.state.perPage + this.state.perPage).map(n =>
                                <tr style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    <td style={{ 
                                        backgroundColor: wasteColors[n.waste_type], 
                                        textAlign: 'center' }}>
                                            <b>{n.waste_type}</b>
                                        </td>
                                    <td>{n.bin_id}</td>
                                    <td>{n.severity}</td>
                                    <td>{n.city_part}</td>
                                    <td>{n.street}</td>
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