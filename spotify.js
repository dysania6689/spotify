// api/spotify.js
export default async function handler(req, res) {
    // 💡 핵심: 진짜 키를 코드에 적지 않고, Vercel 환경 변수(process.env)에서 몰래 꺼내 옵니다!
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    // 스포티파이가 요구하는 방식으로 키를 암호화 (Base64)
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        // 스포티파이 공식 진짜 주소로 직접 요청!
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
        });

        const data = await response.json();
        
        // 브라우저(app.js)에게 발급받은 토큰을 안전하게 전달해 줍니다.
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: '스포티파이 토큰 발급 중 서버 에러 발생' });
    }
}