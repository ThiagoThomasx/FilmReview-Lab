import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { HomePage } from "./pages/HomePage";
import { WriteReviewPage } from "./pages/WriteReviewPage";
import { LibraryPage } from "./pages/LibraryPage";
import { InsightsPage } from "./pages/InsightsPage";
import { SettingsPage } from "./pages/SettingsPage";

export function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/escrever" element={<WriteReviewPage />} />
          <Route path="/escrever/:reviewId" element={<WriteReviewPage />} />
          <Route path="/biblioteca" element={<LibraryPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
