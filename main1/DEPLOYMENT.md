# EventNexus Deployment Guide

This guide will walk you through successfully deploying your complete MERN stack application for free using **Render** (for the backend) and **Vercel** (for the frontend).

## Prerequisites
1.  Your code must be pushed to a GitHub repository. (You have already done this!)
2.  Your MongoDB Atlas database is already set up and running in the cloud.

---

## Part 1: Deploying the Backend on Render
Render will host your Node.js/Express server and the API endpoints.

### 1. Create a Render Web Service
1. Go to [https://render.com](https://render.com) and sign in/create a free account.
2. Click **New +** in the top right and select **Web Service**.
3. Connect your GitHub account and select your repository (`prajwalan2k26` or `full`).

### 2. Configure the Backend Service
Fill out the configuration fields exactly like this:
*   **Name:** `eventnexus-backend` (or similar)
*   **Region:** Select whichever is closest to you.
*   **Branch:** `main`
*   **Root Directory:** `main1/eventnexus/server` 
*   **Environment:** `Node`
*   **Build Command:** `npm install`
*   **Start Command:** `npm start`

### 3. Add Environment Variables
Scroll down, select **Advanced**, and click **Add Environment Variables**. You must securely copy all the variables from your local `server/.env` file. Add each one row by row:

*   `PORT`= `5000`
*   `MONGO_URI` = `mongodb+srv://mallikharjuna:prajwalan2k26@cluster0.qkgkwyq.mongodb.net/?appName=Cluster0`
*   `JWT_SECRET` = `prajwalan2k26hackthon`
*   `ADMIN_SECRET_KEY` = `hackthon@1234`
*   `CLOUDINARY_CLOUD_NAME` = `dk3h1fowv`
*   `CLOUDINARY_API_KEY` = `359949395966579`
*   `CLOUDINARY_API_SECRET` = `EB5Q8xqPsiSm6pxPndu9h-41LcU`
*   `EMAIL_HOST` = `smtp.gmail.com`
*   `EMAIL_PORT` = `587`
*   `EMAIL_USER` = `mallikharjuna244466666@gmail.com`
*   `EMAIL_PASS` = `zavzamdtgemfhxfz`
*   `ADMIN_EMAIL` = `admin@eventnexus.com`
*   `CLIENT_URL` = leave this completely blank for now (we will come back to it in Part 3!).

### 4. Deploy Backend
Click the **Create Web Service** button. Wait a few minutes for Render to build and start your server. 
Once you see "Live" in green, copy the URL provided near the top left (it will look like `https://eventnexus-backend-xyz.onrender.com`).

---

## Part 2: Deploying the Frontend on Vercel
Vercel is the easiest and fastest way to host your React application.

### 1. Create a Vercel Project
1. Go to [https://vercel.com](https://vercel.com) and log in.
2. Choose **Add New** -> **Project**.
3. Import your GitHub repository (`full` or `prajwalan2k26`).

### 2. Configure the Frontend Application
Configure the build settings as follows:
*   **Project Name:** `eventnexus`
*   **Framework Preset:** `Create React App`
*   **Root Directory:** Click "Edit", navigate into `main1`, then `eventnexus`, then select `client`. Save it so the path is `main1/eventnexus/client`.

### 3. Link Backend to Frontend
Before deploying, open the "Environment Variables" dropdown. We must tell React where your new backend API is located!
*   **Name:** `REACT_APP_API_URL`
*   **Value:** `https://your-backend-url-from-render.onrender.com/api` *(Paste your exact Render URL here, and make sure you add `/api` to the end! Do not put a trailing slash).*

### 4. Deploy Frontend
Click the **Deploy** button. Vercel will build your React code and provide you with a live website link (e.g. `https://eventnexus.vercel.app`).

---

## Part 3: The Final Security Handshake (Fixing CORS)
Right now, your frontend can find your backend, but your backend rejects the traffic because of security configurations (CORS). We need to explicitly allow traffic from your new Vercel URL.

1. Copy your new live Vercel URL (`https://eventnexus.vercel.app`). Do not include a slash at the end.
2. Go back to your **Render** dashboard and click on your Backend Web Service.
3. Click on the **Environment** tab on the left side menu.
4. Add or edit your `CLIENT_URL` environment variable.
5. Set `CLIENT_URL` = `https://eventnexus.vercel.app`
6. Save the changes. Render will automatically restart your backend.

## Success! 🎉
Your full MERN stack application is now completely deployed and accessible to everyone on the internet!
