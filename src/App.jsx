import { AuthProvider } from "./context/AuthContext"
import { useAuth } from "./context/useAuth"
import { FinanceProvider } from "./context/FinanceContext.jsx"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"

function AppShell() {
	const { isAuthenticated } = useAuth()

	if (!isAuthenticated) {
		return <Login />
	}

	return (
		<FinanceProvider>
			<Dashboard />
		</FinanceProvider>
	)
}

export default function App() {
	return (
		<AuthProvider>
			<AppShell />
		</AuthProvider>
	)
}
