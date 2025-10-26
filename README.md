# 🌤️ Weather App — Frontend (React + Vite)

This is the **frontend** of the Weather App, built with **React**, **TypeScript**, and **Vite**.  
It provides a clean, responsive UI for viewing live weather data from the Spring Boot backend and integrates **Auth0 authentication**.

---

## 🚀 Features

- ⚡ Built with **React + TypeScript + Vite**
- 🎨 Styled using **Tailwind CSS**
- 🔐 Login via **Auth0 / JWT**
- 🌍 Fetches secure data from Spring Boot API
- 📊 Displays current weather per city
- 🌆 Shows aggregated weather data
- 📱 Fully responsive UI

---

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── services/
│       └── weatherApi.ts
├── public/
├── package.json
├── vite.config.ts
└── .env
```

---

## ⚙️ Tech Stack

| Category | Technology |
|-----------|-------------|
| **Framework** | React 18 + Vite |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Auth** | Auth0 / JWT |
| **HTTP Client** | Axios / Fetch |
| **Build Tool** | npm / Vite |

---

## ⚙️ Setup Instructions

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file:
```bash
VITE_API_BASE_URL=http://localhost:8080/api/weather
VITE_AUTH0_DOMAIN=https://dev-xxxxxx.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id
VITE_AUTH0_AUDIENCE=https://api.weather-app
```

### 4. Run Development Server
```bash
npm run dev
```

Open your browser → [http://localhost:5173](http://localhost:5173)

---

## 🔐 Authentication Flow

1. User logs in via **Auth0** popup.
2. Auth0 issues a **JWT token**.
3. React app stores token in memory/localStorage.
4. Every API request includes:
   ```http
   Authorization: Bearer <token>
   ```
5. Spring Boot backend validates token before returning data.

---

## 🌦️ Example API Call

```typescript
const response = await axios.get(`${VITE_API_BASE_URL}/2988507`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 👨‍💻 Author

**Yasidu Pathiraja**  
Frontend Developer | React | Auth0 | REST APIs  
🌐 [LinkedIn](https://www.linkedin.com) | [GitHub](https://github.com/yasidu-pathiraja)

---

## 🧾 License

Licensed under the **MIT License** — you may freely use and modify it.
