import axios from 'axios';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

function App() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const getOrders = async () => {
            setLoading(true)
            const response = await axios.get('http://localhost:5000/orders')
            console.log(response.data)
            setOrders(response.data)
            setLoading(false)
        }
        getOrders()
    }, []);


    useEffect(() => {
        const socket = io('ws://localhost:5000')

        socket.on('connection', () => {
            console.log("Connected to server");
        })

        socket.on('order added', (orders) => {
            setOrders(orders)
        })

        socket.on('message', (message) => {
            console.log(message)
        })

        socket.on('disconnect', () => {
            console.log("Socket disconnecting...")
        })
    }, [])

    const mapOrders = orders => {
        return orders.map((order, index) => {
            return (
                <div key={index} className="p-6 m-5 text-center rounded ring-2 ring-offset-2 ring-indigo-600">
                    <p className="text-lg antialiased font-semibold">{order.customer}</p>
                    <p className="text-gray-500 italic text-sm">Price: {order.price}</p>
                    <p>Deliver to {order.address}</p>
                </div>
            )
        })
    }

    return (
        <div className="container mx-auto flex flex-wrap">
            {loading ? <p>Loading</p> : mapOrders(orders)}
        </div>
    );
}

export default App;
