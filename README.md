> 🚨 **This is the Server Repo!**  
> Please **click the badge below** to access the backend source code and all server-related files.  
> This is important for understanding the server setup and development.

[![🚨 Hey! Here is the Server Repo! 🚨](https://img.shields.io/badge/%F0%9F%9A%A8-Hey%21%20Here%20is%20the%20Server%20Repo%21%20%F0%9F%9A%A8-brightgreen?logo=github&style=flat-square)](https://github.com/MykiellDeovennPagayonan/ithink-hackathon-sentralians-server)


# Numerus

> **Decentralized Collaborative AI Math Learning Platform**

Numerus is a decentralized platform where students enhance their math skills through AI-powered practice and community collaboration. Users can access a catalog of publicly submitted problems across advanced topics like **calculus**, **linear algebra**, **differential equations**, and **engineering economics**—solve them, and receive **AI-driven validation and feedback**.

Built on the **Internet Computer Protocol (ICP)**, Numerus is not just another educational platform—it's a community-owned ecosystem. It empowers learners, educators, and contributors through:

- **Decentralized content creation**
- **Mathematical AI tutoring with LaTeX support**
- **Teacher-managed classrooms with real-time tracking**
- **Permanent and secure educational content via blockchain**

---

## 1. Project Name

**Numerus**

---

## 2. Project Description

Numerus is a decentralized platform where students can improve their math skills through practice. Users can view a catalog of publicly created math problems and attempt to solve them. An AI system validates the solution and provides step-by-step feedback to reach the correct answer.

The platform addresses a gap in education by covering advanced math topics like:

- Calculus
- Linear Algebra
- Differential Equations
- Engineering Economics

Numerus is built on the Internet Computer Protocol (ICP) blockchain, making it truly decentralized. Any user can contribute problems to the shared repository, enhancing platform resilience and democratizing access to math education.

Educators can create custom classrooms, assign problems, and track student progress in real time.

---

## 3. Tech Stack

### Web Interface (Next.js)

- Responsive UI for students, teachers, and contributors
- LaTeX math editor
- Problem catalog and classroom manager

### ICP Frontend Canister

- Decentralized static asset hosting

### Backend API (Express.js on Render)

- Handles API integrations and business logic
- Communicates between frontend and blockchain

### ICP Motoko Backend Canister

- Smart contracts for authentication, storage, and classroom logic

### RxMoDB

- Blockchain-based database for problems, classrooms, and analytics

### OpenAI Integration

- AI feedback and validation of math solutions

### Wolfram API

- Advanced math computations and symbolic processing

### UploadThing

- File/image uploads for problem and solution submissions

---

## 4. Prerequisites

Make sure the following tools are installed:

- **WSL 2** (Windows Subsystem for Linux)
- **Node.js** (v18+ recommended)
- **npm**
- **dfx** (DFINITY SDK)
- **mops** (Motoko package manager)

> 💡 Run all commands inside the WSL terminal if you're on Windows.

---

## 5. Local Development Setup

### 1. Launch WSL (for Windows)

```bash
wsl
```

### 2. Install dependencies

```bash
npm install
mops install
```

### 3. Start the local replica

```bash
dfx start --background
```

### 4. Create the backend canister

```bash
dfx canister create backend
```

### 5. Retrieve the canister ID

```bash
dfx canister id backend
```

### 6. Set up environment variables in `.env` file

```env
NEXT_PUBLIC_CANISTER_ID_BACKEND=your_canister_id_here
CANISTER_ID_BACKEND=your_canister_id_here
NEXT_PUBLIC_SERVER_URL=http://localhost:8000 #this is for the server
```

### 7. Run the development server

```bash
# Start the Next.js frontend
npm run dev

# Navigate to the backend repo
# Start Express.js server (backend)
npm run dev
```

This will launch:

- The frontend at `http://localhost:3000`
- The backend API at `http://localhost:8000`

---

## 6. Usage

- Visit `http://localhost:3000`
- Browse problems or join/create a classroom
- Submit a solution and receive AI feedback
- Teachers can assign problems and track progress

---

## 7. Deployment

### Local Deployment for testing

```bash
dfx deploy
```

### Web Deployment to ICP

```bash
dfx deploy --network ic
```

Ensure your wallet and identity are properly set up for Internet Computer deployment.

---

## 8. Contributing

> This project was developed as part of a **hackathon** initiative.  
> Community involvement and feedback are welcome, but external code contributions are restricted for now.

---

## 9. Third-Party Attributions

This project uses various third-party assets and libraries.

### Notable Attributions

- **SVG Icons**: Some icons sourced from [SVGRepo](https://www.svgrepo.com) under CC0 License
- **UI Components**: Built with [Radix UI](https://www.radix-ui.com/) and [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Camera**: [react-webcam](https://github.com/mozmorris/react-webcam)
- **Math Typesetting**: [KaTeX](https://katex.org/) for beautiful mathematical equations


---

## Acknowledgments

- Special thanks to the iThink Hackathon organizers
