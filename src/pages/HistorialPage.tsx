import { useEffect, useState } from "react";
import styled from "styled-components";
import { FiChevronDown, FiChevronUp, FiDownload, FiUpload,  } from "react-icons/fi";
import { FaTint } from "react-icons/fa";

const PageWrapper = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #016BCD;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
`;

const HistoryContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  width: 100%;
  max-width: 400px;
  padding-right: 0.5rem;
`;

const AccordionCard = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  border-left: 5px solid #00bcd4;
  overflow: hidden;
`;

const AccordionHeader = styled.div`
  background-color: #e0f7fa;
  padding: 1rem;
  font-weight: bold;
  color: #016BCD;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const AccordionContent = styled.div`
  padding: 0.75rem 1.25rem;
`;

const EntryRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #555;
  svg {
    margin-right: 0.5rem;
    color: #00bcd4;
  }
`;

const BackButton = styled.button`
  background-color: #00bcd4;
  color: white;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
`;

const FloatingButtonsWrapper = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 100;
`;

const FloatingButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #00c4cc;
  border: none;
  color: white;
  font-size: 1.4rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0097a7;
  }

  input {
    display: none;
  }
`;

const HistorialPage = () => {
  const [historial, setHistorial] = useState<{ fecha: string; datos: any[] }[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const entries: { fecha: string; datos: any[] }[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("agua-historial-")) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            const datos = JSON.parse(value);
            const fecha = key.replace("agua-historial-", "");
            entries.push({ fecha, datos });
          } catch (e) {
            console.error("Error leyendo historial:", key);
          }
        }
      }
    }

    entries.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
    setHistorial(entries);
  }, []);

  const handleExport = () => {
    const exportData: Record<string, any> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("agua-historial-")) {
        const value = localStorage.getItem(key);
        if (value) exportData[key] = JSON.parse(value);
      }
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "historial-agua.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const data = JSON.parse(result);

        if (typeof data !== "object") throw new Error("Archivo inválido");

        Object.entries(data).forEach(([key, value]) => {
          if (key.startsWith("agua-historial-")) {
            localStorage.setItem(key, JSON.stringify(value));
          }
        });

        alert("Historial importado correctamente");
        window.location.reload(); // Refrescar para que se vea actualizado
      } catch (error) {
        alert("Error al importar historial");
        console.error(error);
      }
    };

    reader.readAsText(file);
  };

  const toggleExpand = (fecha: string) => {
    setExpanded((prev) => (prev === fecha ? null : fecha));
  };

  return (
    <PageWrapper>
      <Title>Historial de Agua</Title>
      <HistoryContainer>
        {historial.length === 0 && <p>No hay datos guardados.</p>}

        {historial.map(({ fecha, datos }) => (
          <AccordionCard key={fecha}>
            <AccordionHeader onClick={() => toggleExpand(fecha)}>
              {fecha}
              {expanded === fecha ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
            </AccordionHeader>
            {expanded === fecha && (
              <AccordionContent>
                {datos.map((r, i) => (
                  <EntryRow key={i}>
                    <FaTint />
                    {r.hora || r.time} - {r.mililitros || r.amount_ml} ml
                  </EntryRow>
                ))}
              </AccordionContent>
            )}
          </AccordionCard>
        ))}
      </HistoryContainer>

      <BackButton onClick={() => history.back()}>Volver</BackButton>
      <FloatingButtonsWrapper>
        <FloatingButton title="Exportar historial" onClick={handleExport}>
          <FiDownload />
        </FloatingButton>

        <FloatingButton as="label" title="Importar historial">
          <FiUpload />
          <input type="file" hidden onChange={handleImport} accept=".json" />
        </FloatingButton>
      </FloatingButtonsWrapper>
    </PageWrapper>
  );
};

export default HistorialPage;
