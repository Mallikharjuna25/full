async function testStudentRegister() {
    try {
        const res = await fetch('http://localhost:5000/api/auth/student/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'malli',
                email: 'test@gmail.com',
                college: 'ss',
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
testStudentRegister();
