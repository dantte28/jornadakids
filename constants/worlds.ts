export interface LessonData {
  id: number;
  title: string;
  type: 'story' | 'quiz' | 'interaction';
  content: string;
  question?: string;
  options?: string[];
  correctAnswerIndex?: number;
}

export interface WorldData {
  id: string;
  name: string;
  themeColor: string;
  nodeColor: string;
  lessons: LessonData[];
}

export const WORLDS: WorldData[] = [
  {
    id: 'world_david',
    name: 'Jornada de Davi',
    themeColor: '#86EFAC', // Light grass green
    nodeColor: '#FACC15', // Yellow
    lessons: [
      {
        id: 1,
        title: 'O Pequeno Pastor',
        type: 'story',
        content: 'Davi era um menino que cuidava das ovelhas de seu pai. Mesmo pequeno, ele era muito corajoso e confiava em Deus para proteger o rebanho de qualquer perigo!'
      },
      {
        id: 2,
        title: 'Ovelha Perdida',
        type: 'interaction',
        content: 'Uma ovelhinha se perdeu! Toque nela 3 vezes para ajudá-la a voltar para perto de Davi.',
      },
      {
        id: 3,
        title: 'O Desafio',
        type: 'quiz',
        content: '',
        question: 'O que Davi usou para derrotar o gigante Golias e proteger seu povo?',
        options: ['Uma Espada de Ouro', 'Uma Funda com 5 Pedrinhas', 'Um Escudo Gigante'],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: 'world_moses',
    name: 'Jornada de Moisés',
    themeColor: '#BAE6FD', // Light sky blue
    nodeColor: '#F97316', // Orange
    lessons: [
      {
        id: 4,
        title: 'O Bebê no Rio',
        type: 'story',
        content: 'A mamãe de Moisés queria protegê-lo, então o colocou em um cesto de junco no rio Nilo. A princesa do Egito o encontrou e cuidou dele com muito amor!'
      },
      {
        id: 5,
        title: 'O Mar se Abre!',
        type: 'interaction',
        content: 'Deus deu poder a Moisés para abrir o Mar Vermelho e salvar as pessoas. Toque na água 3 vezes para abrir o caminho!',
      }
    ]
  }
];
