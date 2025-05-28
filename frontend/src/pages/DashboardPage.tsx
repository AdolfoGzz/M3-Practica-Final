import { useAuth } from '../lib/useAuth';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { UserManagement } from '../components/UserManagement';

export function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <div className="container mx-auto p-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Dashboard</CardTitle>
                    <CardDescription>Welcome back, {user?.username}!</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center">
                        <p>You are logged in as {user?.username}</p>
                        <Button 
                            variant="destructive" 
                            onClick={logout}
                        >
                            Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <UserManagement />
                </CardContent>
            </Card>
        </div>
    );
}