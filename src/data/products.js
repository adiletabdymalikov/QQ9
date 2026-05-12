export const categories = [
  { id: 1, name: 'Бургеры' },
  { id: 2, name: 'Картофель' },
  { id: 3, name: 'Напитки' },
  { id: 4, name: 'Спецпредложения' }
];

export const products = [
  {
    id: 1,
    name: 'Классический Бургер',
    price: 350,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format',
    category_id: 1,
    description: 'Сочная говяжья котлета, свежие овощи и фирменный соус на пышной булке.',
    brand: 'Burger Master',
    stock: 50
  },
  {
    id: 2,
    name: 'Чизбургер Deluxe',
    price: 390,
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&auto=format',
    category_id: 1,
    description: 'Двойная порция сыра чеддер и карамелизованный лук.',
    brand: 'Burger Master',
    stock: 30
  },
  {
    id: 3,
    name: 'Картофель Фри',
    price: 150,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format',
    category_id: 2,
    description: 'Хрустящий картофель с морской солью.',
    brand: 'Farm Fresh',
    stock: 100
  },
  {
    id: 4,
    name: 'Картофель по-деревенски',
    price: 180,
    image: 'https://images.unsplash.com/photo-1518013045958-e11717d4490e?w=500&auto=format',
    category_id: 2,
    description: 'Крупные дольки картофеля со специями и чесноком.',
    brand: 'Farm Fresh',
    stock: 80
  },
  {
    id: 5,
    name: 'Кока-Кола 0.5',
    price: 90,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format',
    category_id: 3,
    description: 'Классический освежающий напиток.',
    brand: 'Coca-Cola',
    stock: 200
  },
  {
    id: 6,
    name: 'Куриные Наггетсы',
    price: 220,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format',
    category_id: 4,
    description: '6 штук нежного куриного филе в золотистой панировке.',
    brand: 'Chicken Joy',
    stock: 60
  },
];