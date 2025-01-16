let current_url = 'D:///Flask_DsCorrespondence/frontend';

async function loginAndSaveToken(username, password) {
    const url = 'http://127.0.0.1:5000/login'; // URL endpoint login

    // Membuat headers untuk Basic Auth
    const headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa(username + ":" + password)); // Encode username dan password ke Base64

    try {
        // Melakukan request POST ke endpoint login
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error('Login failed: ' + response.statusText);
        }

        // Mengambil token dari response
        const data = await response.json();
        const token = data.token;

        // Menyimpan token ke localStorage
        localStorage.setItem('authToken', token);
        console.log('Token saved to localStorage:', token);

        return token;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

async function fetchProtectedData() {
    const url = 'http://127.0.0.1:5000/protected'; // URL endpoint yang dilindungi

    // Mengambil token dari localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.error('No token found in localStorage. Please login first.');
        window.location.href = `${current_url}/login.html`;
        return;
    }

    try {
        // Melakukan request GET ke endpoint yang dilindungi dengan token
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token, // Mengirim token di header Authorization
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch protected data: ' + response.statusText);
        }

        // Mengambil data dari response
        const data = await response.json();
        // console.log('Protected data:', data);

        return data;
    } catch (error) {
        console.error('Error fetching protected data:', error);
        throw error;
    }
}


function keluar() {
    // Menghapus token dari localStorage
    localStorage.removeItem('authToken');
    console.log('Token has been cleared from localStorage.');
    window.location.href = `${current_url}/login.html`;
}