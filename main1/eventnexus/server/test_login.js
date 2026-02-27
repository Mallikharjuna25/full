async function testLogin() {
    try {
        const res = await fetch('http://localhost:5000/api/auth/coordinator/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                collegeName: 'srkr',
                email: 'adaptivecoding24@gmail.com',
                password: 'M123456'
            })
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', data);
    } catch (err) {
        console.error('Network Error:', err.message);
    }
}
testLogin();
