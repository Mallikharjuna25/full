async function testOptions() {
    try {
        const res = await fetch('http://localhost:5000/api/auth/student/register', {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type, Authorization'
            }
        });
        console.log('OPTIONS Status:', res.status);
        console.log('OPTIONS Headers:');
        for (let [key, value] of res.headers.entries()) {
            console.log(key, ':', value);
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}
testOptions();
