// import GlobalStyles from "./styles/GlobalStyles";
// import styled from "styled-components";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useState } from "react";
// import WaterTracker from "./components/WaterTracker";
// import SettingsPage from "./pages/SettingsPage";

// const Wrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100%;
// `;

// const Content = styled.div`
//   text-align: center;
//   max-width: 400px;
//   width: 100%;
//   padding: 2rem;
// `;

// function App() {
//   const [page, setPage] = useState<'home' | 'settings'>('home');

//   return (
//     <>
//       <GlobalStyles />
//       <Wrapper>
//         <Content>
//           {page === 'home' ? (
//             <WaterTracker onNavigateSettings={() => setPage('settings')} />
//           ) : (
//             <SettingsPage onBack={() => setPage('home')} />
//           )}
//         </Content>
//       </Wrapper>
//       <ToastContainer
//         position="top-center"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         pauseOnHover
//         theme="colored"
//       />
//     </>
//   );
// }

// export default App;

import GlobalStyles from "./styles/GlobalStyles";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import WaterTracker from "./components/WaterTracker";
import SettingsPage from "./pages/SettingsPage";
import HistorialPage from "./pages/HistorialPage"; // nueva página

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Content = styled.div`
  text-align: center;
  max-width: 400px;
  width: 100%;
  padding: 2rem;
`;

function AppRoutes() {
  return (
    <Wrapper>
      <Content>
        <Routes>
          <Route path="/" element={<WaterTracker />} />
          <Route path="/config" element={<SettingsPage />} />
          <Route path="/historial" element={<HistorialPage />} />
        </Routes>
      </Content>
    </Wrapper>
  );
}

function App() {
  return (
    <>
      <GlobalStyles />
      <Router>
        <AppRoutes />
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
