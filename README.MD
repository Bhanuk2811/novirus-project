# NoVirus - Cybersecurity Dashboard

NoVirus is a modern cybersecurity application with antivirus and VPN capabilities, built with Next.js and React.

![NoVirus Dashboard](image.svg?height=400&width=800)

## Features

- 🛡️ **Antivirus Protection**: Scan files and folders for malware using multiple detection methods
- 🔒 **VPN Service**: Secure your internet connection with simulated VPN functionality
- 📊 **Modern Dashboard**: Clean, intuitive interface with real-time status monitoring
- 🌓 **Dark/Light Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🔔 **Notifications**: Toast notifications for important events

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) (v8 or newer) or [yarn](https://yarnpkg.com/) (v1.22 or newer)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

## Running in Visual Studio Code

### Setting Up VS Code

1. **Install VS Code Extensions** (recommended):
   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
   - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
   - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
   - [ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)

2. **Open the Project in VS Code**:
   \`\`\`bash
   # Clone the repository
   git clone https://github.com/yourusername/novirus.git
   
   # Navigate to the project directory
   cd novirus
   
   # Open in VS Code
   code .
   \`\`\`

3. **Using VS Code Integrated Terminal**:
   - Open the terminal in VS Code by pressing `` Ctrl+` `` (or `Terminal > New Terminal` from the menu)
   - Run the installation and start commands from this terminal

### Installation

1. In the VS Code terminal, install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

2. Set up environment variables:
   - Create a new file in the root directory named `.env.local`
   - Add the following variables:
   \`\`\`
   OPENVPN_API_HOST=https://your-openvpn-server.com
   OPENVPN_API_USERNAME=your_openvpn_username
   OPENVPN_API_PASSWORD=your_openvpn_password
   \`\`\`
   Note: For testing purposes, you can leave these values as placeholders. The application will use simulated VPN functionality.

### Running the Project

1. Start the development server using the VS Code terminal:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

2. VS Code may prompt you to open the application in a browser, or you can manually navigate to:
   \`\`\`
   http://localhost:3000
   \`\`\`

### Debugging in VS Code

1. Set breakpoints by clicking in the gutter next to line numbers
2. Press F5 or go to Run > Start Debugging
3. Select "Node.js" as the environment if prompted
4. The application will start and break at your breakpoints

## Running on Your Device

### Windows

1. Install [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) for Windows
2. Open Command Prompt or PowerShell:
   \`\`\`
   git clone https://github.com/yourusername/novirus.git
   cd novirus
   npm install
   npm run dev
   \`\`\`
3. Open `http://localhost:3000` in your browser

### macOS

1. Install Node.js and Git (using [Homebrew](https://brew.sh/) is recommended):
   \`\`\`bash
   brew install node git
   \`\`\`
2. Open Terminal:
   \`\`\`bash
   git clone https://github.com/yourusername/novirus.git
   cd novirus
   npm install
   npm run dev
   \`\`\`
3. Open `http://localhost:3000` in your browser

### Linux

1. Install Node.js and Git using your distribution's package manager:
   \`\`\`bash
   # For Ubuntu/Debian
   sudo apt update
   sudo apt install nodejs npm git
   
   # For Fedora
   sudo dnf install nodejs npm git
   \`\`\`
2. Open Terminal:
   \`\`\`bash
   git clone https://github.com/yourusername/novirus.git
   cd novirus
   npm install
   npm run dev
   \`\`\`
3. Open `http://localhost:3000` in your browser

## Building for Production

1. Build the application:
   \`\`\`bash
   npm run build
   # or
   yarn build
   \`\`\`

2. Start the production server:
   \`\`\`bash
   npm start
   # or
   yarn start
   \`\`\`

## Project Structure

\`\`\`
novirus/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── dashboard.tsx     # Main dashboard
│   ├── antivirus-panel.tsx # Antivirus functionality
│   ├── vpn-panel.tsx     # VPN functionality
│   └── ...
├── lib/                  # Utility functions
│   ├── antivirus.ts      # Antivirus functionality
│   ├── vpn.ts            # VPN functionality
│   └── utils.ts          # Helper functions
├── public/               # Static assets
└── ...
\`\`\`

## Troubleshooting

### Common Issues

1. **Port 3000 is already in use**:
   \`\`\`bash
   # Kill the process using port 3000
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -i :3000
   kill -9 <PID>
   
   # Or start on a different port
   npm run dev -- -p 3001
   \`\`\`

2. **Node.js version issues**:
   - Use [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) to install and use the correct Node.js version:
   \`\`\`bash
   nvm install 18
   nvm use 18
   \`\`\`

3. **Missing dependencies**:
   \`\`\`bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules
   npm install
   \`\`\`

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Lucide React](https://lucide.dev/) - Icon library
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management

## Limitations

- The antivirus functionality is limited to browser capabilities and can only scan files that you explicitly select
- VPN functionality is simulated for demonstration purposes
- File system access is limited by browser security restrictions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the icon set
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
