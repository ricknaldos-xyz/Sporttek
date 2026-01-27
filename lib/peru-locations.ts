export interface Department {
  code: string
  name: string
  cities: string[]
}

export const PERU_DEPARTMENTS: Department[] = [
  {
    code: 'LIM',
    name: 'Lima',
    cities: ['Lima', 'Miraflores', 'San Isidro', 'San Borja', 'Surco', 'La Molina', 'Barranco', 'Callao', 'Chorrillos', 'San Miguel', 'Magdalena', 'Lince', 'Jesus Maria', 'Pueblo Libre', 'Breña', 'Rimac', 'San Martin de Porres', 'Los Olivos', 'Independencia', 'Comas', 'Ate', 'Santa Anita', 'San Juan de Lurigancho', 'La Victoria', 'Huacho', 'Cañete'],
  },
  {
    code: 'ARE',
    name: 'Arequipa',
    cities: ['Arequipa', 'Cayma', 'Cerro Colorado', 'Yanahuara', 'Jose Luis Bustamante y Rivero', 'Sachaca', 'Mollendo', 'Camana'],
  },
  {
    code: 'CUS',
    name: 'Cusco',
    cities: ['Cusco', 'Wanchaq', 'Santiago', 'San Sebastian', 'San Jeronimo', 'Sicuani', 'Quillabamba'],
  },
  {
    code: 'LIB',
    name: 'La Libertad',
    cities: ['Trujillo', 'Victor Larco Herrera', 'Laredo', 'Huanchaco', 'Chepen', 'Pacasmayo'],
  },
  {
    code: 'PIU',
    name: 'Piura',
    cities: ['Piura', 'Castilla', 'Catacaos', 'Sullana', 'Talara', 'Paita'],
  },
  {
    code: 'LAM',
    name: 'Lambayeque',
    cities: ['Chiclayo', 'Lambayeque', 'Ferreñafe', 'Monsefú', 'Pimentel'],
  },
  {
    code: 'JUN',
    name: 'Junin',
    cities: ['Huancayo', 'El Tambo', 'Chilca', 'Tarma', 'La Oroya', 'Satipo'],
  },
  {
    code: 'CAJ',
    name: 'Cajamarca',
    cities: ['Cajamarca', 'Baños del Inca', 'Jaen', 'Chota'],
  },
  {
    code: 'PUN',
    name: 'Puno',
    cities: ['Puno', 'Juliaca', 'Ayaviri', 'Ilave'],
  },
  {
    code: 'ANC',
    name: 'Ancash',
    cities: ['Huaraz', 'Chimbote', 'Nuevo Chimbote', 'Caraz', 'Yungay'],
  },
  {
    code: 'LOR',
    name: 'Loreto',
    cities: ['Iquitos', 'Punchana', 'Belen', 'San Juan Bautista', 'Yurimaguas'],
  },
  {
    code: 'ICA',
    name: 'Ica',
    cities: ['Ica', 'Chincha Alta', 'Pisco', 'Nazca', 'Palpa'],
  },
  {
    code: 'SMA',
    name: 'San Martin',
    cities: ['Tarapoto', 'Moyobamba', 'Rioja', 'Juanjui', 'Lamas'],
  },
  {
    code: 'UCA',
    name: 'Ucayali',
    cities: ['Pucallpa', 'Calleria', 'Yarinacocha'],
  },
  {
    code: 'HUA',
    name: 'Huanuco',
    cities: ['Huanuco', 'Amarilis', 'Tingo Maria'],
  },
  {
    code: 'AYA',
    name: 'Ayacucho',
    cities: ['Ayacucho', 'San Juan Bautista', 'Jesus Nazareno', 'Huanta'],
  },
  {
    code: 'TAC',
    name: 'Tacna',
    cities: ['Tacna', 'Gregorio Albarracin', 'Ciudad Nueva', 'Pocollay'],
  },
  {
    code: 'MDD',
    name: 'Madre de Dios',
    cities: ['Puerto Maldonado', 'Tambopata'],
  },
  {
    code: 'APU',
    name: 'Apurimac',
    cities: ['Abancay', 'Andahuaylas', 'Talavera'],
  },
  {
    code: 'AMA',
    name: 'Amazonas',
    cities: ['Chachapoyas', 'Bagua', 'Utcubamba'],
  },
  {
    code: 'TUM',
    name: 'Tumbes',
    cities: ['Tumbes', 'Aguas Verdes', 'Zorritos'],
  },
  {
    code: 'MOQ',
    name: 'Moquegua',
    cities: ['Moquegua', 'Ilo', 'Samegua'],
  },
  {
    code: 'HUV',
    name: 'Huancavelica',
    cities: ['Huancavelica', 'Ascension', 'Acobamba'],
  },
  {
    code: 'PAS',
    name: 'Pasco',
    cities: ['Cerro de Pasco', 'Yanacancha', 'Oxapampa'],
  },
  {
    code: 'CAL',
    name: 'Callao',
    cities: ['Callao', 'Bellavista', 'La Perla', 'Ventanilla', 'La Punta'],
  },
]

export function getDepartmentNames(): string[] {
  return PERU_DEPARTMENTS.map((d) => d.name)
}

export function getCitiesByDepartment(departmentName: string): string[] {
  const dept = PERU_DEPARTMENTS.find((d) => d.name === departmentName)
  return dept?.cities ?? []
}

export function findDepartmentByCity(cityName: string): Department | undefined {
  return PERU_DEPARTMENTS.find((d) => d.cities.includes(cityName))
}
