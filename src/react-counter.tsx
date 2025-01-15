// Implement a Counter component with two buttons:
// “Increase” and “Decrease”, which displays the current counter value.
import React, { useState } from 'react'

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <h1>Counter: {count}</h1>
            <button onClick={() => setCount(count + 1)} style={{ margin: '5px' }}>
                Increase
            </button>
            <button onClick={() => setCount(count - 1)} style={{ margin: '5px' }}>
                Decrease
            </button>
        </div>
    );
}

export default Counter