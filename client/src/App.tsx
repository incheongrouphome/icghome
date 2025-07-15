import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "@/components/auth/protected-route";

import Landing from "@/pages/landing";
import Home from "@/pages/home";
import About from "@/pages/about";
import Business from "@/pages/business";
import Admin from "@/pages/admin";

import Donation from "@/pages/donation";
import NotFound from "@/pages/not-found";
import VerifyEmailPage from "@/pages/verify-email";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// About submenu pages
import GroupHome from "@/pages/about/group-home";
import Association from "@/pages/about/association";
import Organization from "@/pages/about/organization";

// Members submenu pages
import Members from "@/pages/members";
import MemberNotices from "@/pages/members/notices";
import Communication from "@/pages/members/communication";
import Application from "@/pages/members/application";
// Announcements submenu pages
import Announcements from "@/pages/announcements";
import GeneralAnnouncements from "@/pages/announcements/general";
import JobPostings from "@/pages/announcements/jobs";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/landing" component={Landing} />
          <Route path="/about" component={About} />
          <Route path="/about/group-home" component={GroupHome} />
          <Route path="/about/association" component={Association} />
          <Route path="/about/organization" component={Organization} />
          <Route path="/business" component={Business} />
          
          {/* Protected Members Routes */}
          <Route path="/members">
            <ProtectedRoute>
              <Members />
            </ProtectedRoute>
          </Route>
          <Route path="/members/notices" component={MemberNotices} />
          <Route path="/members/notices/:id" component={MemberNotices} />
          <Route path="/members/communication" component={Communication} />
          <Route path="/members/communication/:id" component={Communication} />
          <Route path="/members/application" component={Application} />
          <Route path="/members/application/:id" component={Application} />
          
          <Route path="/announcements" component={Announcements} />
          <Route path="/announcements/general" component={GeneralAnnouncements} />
          <Route path="/announcements/general/:id" component={GeneralAnnouncements} />
          <Route path="/announcements/jobs" component={JobPostings} />
          <Route path="/announcements/jobs/:id" component={JobPostings} />
          <Route path="/admin" component={Admin} />
          <Route path="/donation" component={Donation} />
          <Route path="/verify-email" component={VerifyEmailPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
