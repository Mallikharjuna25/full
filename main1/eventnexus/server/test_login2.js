async function testLoginAgain() {
    try {
        const res = await fetch('http://localhost:5000/api/auth/coordinator/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                collegeName: 'MSRIT',
                email: 'rohit.msrit.test@gmail.com',
                password: 'M123456@'
            })
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', data);
    } catch (err) {
        console.error('Network Error:', err.message);
    }
}
testLoginAgain();
