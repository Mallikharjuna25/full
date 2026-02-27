async function test() {
    try {
        const res = await fetch('http://localhost:5000/api/auth/student/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'test',
                email: 'mallikharjuna244466666@gmail.com',
                college: 'srkr',
                password: 'M147258',
                confirmPassword: 'M147258'
            })
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', data);
    } catch (err) {
        console.error('Error:', err.message);
    }
}
test();
