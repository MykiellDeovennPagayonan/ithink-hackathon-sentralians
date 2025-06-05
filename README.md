# iThink Hackathon - AI Teaching Platform

An AI-powered platform for mathematical problem solving and education, built for the iThink Hackathon.

## Features

- Interactive problem solving interface
- Camera capture for handwritten solutions using react-webcam
- LaTeX equation rendering with MathJax
- Classroom management system
- Real-time collaboration tools
- Responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15.1.8 with React 19
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: Radix UI primitives
- **Camera**: react-webcam 7.2.0
- **Icons**: Lucide React 0.511.0
- **Math Rendering**: MathJax 3
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
   \`\`\`bash
   git clone https://github.com/MykiellDeovennPagayonan/ithink-hackathon-sentralians.git
   cd ithink-hackathon
   \`\`\`

2. Install dependencies
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
ithink-hackathon/
├── app/ # Next.js 15 App Router
│ ├── explore/ # Problem exploration page
│ ├── classroom/ # Classroom management
│ ├── problem/ # Individual problem pages
│ └── layout.tsx # Root layout with MathJax
├── components/ # Reusable UI components
│ ├── ui/ # shadcn/ui components
│ ├── navbar.tsx # Navigation component
│ └── camera-capture.tsx # Camera functionality
├── mockdata/ # Mock data for development
└── public/ # Static assets
\`\`\`

## Third-Party Attributions

This project uses various third-party assets and libraries. See [LICENSES.md](LICENSES.md) for complete attribution and licensing information.

### Notable Attributions

- **SVG Icons**: Some icons sourced from [SVGRepo](https://www.svgrepo.com) under CC0 License
- **UI Components**: Built with [Radix UI](https://www.radix-ui.com/) and [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/) for iconography
- **Camera**: [react-webcam](https://github.com/mozmorris/react-webcam) for camera functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Hackathon Notes

This project was developed for the iThink Hackathon, focusing on innovative AI-powered educational tools. The platform demonstrates:

- Modern web development practices with Next.js 15
- Accessible UI design with Radix UI
- Real-time camera integration for solution capture
- Mathematical equation rendering
- Responsive design for all devices

## Acknowledgments

- Thanks to SVGRepo for providing high-quality SVG assets
- Built with Next.js 15 and React 19
- Styled with Tailwind CSS
- UI components from Radix UI
- Camera functionality powered by react-webcam
- Special thanks to the iThink Hackathon organizers
