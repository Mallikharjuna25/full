async function test() {
    try {
        const res = await fetch('http://localhost:5000/api/auth/coordinator/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                collegeName: 'srkr',
                name: 'malli',
                email: 'adaptivecoding24@gmail.com',
                password: 'M123456',
                confirmPassword: 'M123456'
            })
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', data);
    } catch (err) {
        console.error('Network Error:', err.message);
    }
}
test();
