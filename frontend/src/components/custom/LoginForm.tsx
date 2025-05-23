import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

export default function LoginForm({ onSubmit, loading }: Props) {
  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <Input name="email" placeholder="Email" type="email" required />
          <Input name="password" placeholder="Password" type="password" required />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
