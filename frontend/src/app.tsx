import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { VoluntarioCadastroPage } from '@/pages/voluntario-cadastro-page';
import { VoluntarioDetalhePage } from '@/pages/voluntario-detalhe-page';
import { VoluntariosListagemPage } from '@/pages/voluntarios-listagem-page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/voluntarios" replace />} />
        <Route path="/voluntarios" element={<VoluntariosListagemPage />} />
        <Route path="/voluntarios/novo" element={<VoluntarioCadastroPage />} />
        <Route path="/voluntarios/:id" element={<VoluntarioDetalhePage />} />
      </Routes>
    </BrowserRouter>
  );
}
