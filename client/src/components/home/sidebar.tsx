import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/components/auth/login-form";
import { Phone, Printer, Mail, Clock } from "lucide-react";

export default function Sidebar() {
  return (
    <Card className="shadow-soft border border-gray-100 sticky top-24">
      <CardContent className="p-6">
        {/* Login Section */}
        <LoginForm />

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-bold text-dark-gray mb-4 flex items-center">
            <i className="fas fa-address-card text-accent mr-2"></i>
            연락처 정보
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                <Phone className="text-primary" size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-dark-gray">대표전화</p>
                <p className="text-sm text-medium-gray">032-364-1617</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                <Printer className="text-primary" size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-dark-gray">팩스</p>
                <p className="text-sm text-medium-gray">032-364-1611</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                <Mail className="text-primary" size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-dark-gray">이메일</p>
                <p className="text-sm text-medium-gray">grouphome@daum.net</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                <Clock className="text-primary" size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-dark-gray">운영시간</p>
                <p className="text-sm text-medium-gray">평일 09:00 ~ 18:00</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
