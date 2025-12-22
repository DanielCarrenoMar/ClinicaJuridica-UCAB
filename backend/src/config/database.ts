// Base de datos mock para desarrollo
console.log('🔧 Usando base de datos mock para desarrollo');

const mockDB = {
  case: {
    findMany: async () => {
      console.log('📦 findMany: Devolviendo casos mock');
      return [
        {
          idCase: 1,
          description: "Caso de prueba - Asesoría legal familiar",
          observations: "Cliente necesita orientación sobre custodia",
          tramitType: 15,
          idLegalArea: 1,
          idCourt: null,
          idApplicant: 1,
          idNucleus: 1,
          semesterIdSemester: null,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          idCase: 2,
          description: "Caso laboral - Despido injustificado",
          observations: "Trabajador despedido sin causa justa",
          tramitType: 25,
          idLegalArea: 8,
          idCourt: 1,
          idApplicant: 2,
          idNucleus: 2,
          semesterIdSemester: 1,
          createdAt: new Date('2024-02-20'),
          updatedAt: new Date('2024-02-20')
        }
      ];
    },
    
    findUnique: async ({ where }: any) => {
      console.log(`📦 findUnique: Buscando caso ID ${where.idCase}`);
      const cases = [
        {
          idCase: 1,
          description: "Caso de prueba - Asesoría legal familiar",
          observations: "Cliente necesita orientación sobre custodia",
          tramitType: 15,
          idLegalArea: 1,
          idCourt: null,
          idApplicant: 1,
          idNucleus: 1,
          semesterIdSemester: null,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          idCase: 2,
          description: "Caso laboral - Despido injustificado",
          observations: "Trabajador despedido sin causa justa",
          tramitType: 25,
          idLegalArea: 8,
          idCourt: 1,
          idApplicant: 2,
          idNucleus: 2,
          semesterIdSemester: 1,
          createdAt: new Date('2024-02-20'),
          updatedAt: new Date('2024-02-20')
        }
      ];
      
      return cases.find(c => c.idCase === where.idCase) || null;
    },
    
    create: async (data: any) => {
      console.log('📦 create: Creando nuevo caso', data.data);
      const newId = Math.floor(Math.random() * 9000) + 1000;
      return {
        idCase: newId,
        ...data.data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  },
  
  $connect: async () => {
    console.log('✅ Conectado a base de datos mock');
  },
  
  $disconnect: async () => {
    console.log('👋 Desconectado de base de datos mock');
  }
};

export default mockDB;