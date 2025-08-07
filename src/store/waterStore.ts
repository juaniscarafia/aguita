import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Registro {
  hora: string;
  mililitros: number;
}

interface WaterState {
  totalDiario: number;
  registros: Registro[];
  fecha: string;
  agregarRegistro: (ml: number) => void;
  reiniciarDia: () => void;
}

export const useWaterStore = create<WaterState>()(
  persist(
    (set, get) => ({
      totalDiario: 0,
      registros: [],
      fecha: new Date().toISOString().slice(0, 10),

      agregarRegistro: (ml) => {
        const ahora = new Date();
        const hora = ahora.toTimeString().slice(0, 5);
        const nuevoRegistro = { hora, mililitros: ml };

        set((state) => ({
          totalDiario: state.totalDiario + ml,
          registros: [...state.registros, nuevoRegistro],
        }));
      },

      reiniciarDia: () => {
        const hoy = new Date().toISOString().slice(0, 10);
        const { registros, fecha } = get();

        // Guardar el historial anterior
        localStorage.setItem(
          `agua-historial-${fecha}`,
          JSON.stringify(registros)
        );

        // Reiniciar estado
        set({
          totalDiario: 0,
          registros: [],
          fecha: hoy,
        });
      },
    }),
    {
      name: "agua-tracker",
    }
  )
);