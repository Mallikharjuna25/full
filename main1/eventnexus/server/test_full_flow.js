async function testFullFlow() {
    try {
        console.log("1. Registering new coordinator...");
        const regRes = await fetch('http://localhost:5000/api/auth/coordinator/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                collegeName: 'MSRIT',
                name: 'Final Test',
                email: 'final.test@gmail.com',
                password: 'M123456@',
                confirmPassword: 'M123456@'
            })
        });
        const regData = await regRes.json();
        console.log('Register Status:', regRes.status, regData.success ? 'Success' : `Failed: ${JSON.stringify(regData)}`);

        console.log("\n2. Logging in with same credentials...");
        const loginRes = await fetch('http://localhost:5000/api/auth/coordinator/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                collegeName: 'MSRIT',
                email: 'final.test@gmail.com',
                password: 'M123456@'
            })
        });
        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status, loginData.success ? 'Success' : `Failed: ${JSON.stringify(loginData)}`);

    } catch (err) {
        console.error('Network Error:', err.message);
    }
}
testFullFlow();
