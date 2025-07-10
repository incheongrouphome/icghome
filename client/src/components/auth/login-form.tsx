import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = "/api/login";
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-dark-gray mb-4 flex items-center">
        <LogIn className="text-primary mr-2" size={20} />
        로그인
      </h3>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-dark-gray">아이디</Label>
          <Input 
            type="text" 
            placeholder="ID"
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-dark-gray">비밀번호</Label>
          <Input 
            type="password" 
            placeholder="Password"
            className="mt-1"
            disabled
          />
        </div>
        <Button 
          onClick={handleLogin}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>
      </div>
      <div className="flex justify-between mt-3">
        <button 
          onClick={handleLogin}
          className="text-sm text-medium-gray hover:text-primary transition-colors"
        >
          ID/PW 찾기
        </button>
        <button 
          onClick={handleLogin}
          className="text-sm text-medium-gray hover:text-primary transition-colors"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
