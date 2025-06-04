// Массив статей
const articles = [
  {
    id: 1,
    title: "Как создать эффективный лендинг за 5 шагов",
    category: "web",
    tags: ["howto", "case"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80",
    excerpt: "Пошаговая инструкция по созданию продающего лендинга с нуля. Разбираем все этапы от планирования до запуска.",
    date: "2024-03-15",
    readTime: "8 мин"
  },
  {
    id: 2,
    title: "Тренды веб-дизайна 2024: что будет популярно",
    category: "design",
    tags: ["trend", "design"],
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80",
    excerpt: "Обзор главных трендов в веб-дизайне на 2024 год. От неоморфизма до минимализма - что будет актуально.",
    date: "2024-03-10",
    readTime: "6 мин"
  },
  {
    id: 3,
    title: "SEO-оптимизация: базовые принципы для начинающих",
    category: "seo",
    tags: ["seo", "howto"],
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80",
    excerpt: "Базовые принципы SEO-оптимизации сайта. Разбираем ключевые факторы ранжирования и методы продвижения.",
    date: "2024-03-05",
    readTime: "10 мин"
  },
  {
    id: 4,
    title: "Искусственный интеллект в веб-разработке",
    category: "ai",
    tags: ["ai", "trend"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80",
    excerpt: "Как ИИ меняет веб-разработку. От автоматизации до создания контента - обзор современных инструментов.",
    date: "2024-03-01",
    readTime: "7 мин"
  },
  {
    id: 5,
    title: "SMM-стратегия для малого бизнеса",
    category: "smm",
    tags: ["smm", "howto"],
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400&q=80",
    excerpt: "Пошаговое руководство по созданию эффективной SMM-стратегии для малого бизнеса с минимальным бюджетом.",
    date: "2024-02-25",
    readTime: "9 мин"
  }
];

// Функция для отображения статей
function displayArticles(articlesToShow = articles) {
  const blogList = document.getElementById('blogList');
  blogList.innerHTML = '';

  articlesToShow.forEach(article => {
    const articleCard = document.createElement('div');
    articleCard.className = 'card';
    articleCard.innerHTML = `
      <img src="${article.image}" alt="${article.title}" style="width:100%; height:200px; object-fit:cover; border-radius:12px; margin-bottom:20px;">
      <div style="display:flex; gap:12px; margin-bottom:12px;">
        <span style="background:#f0f7fa; color:var(--accent-color); padding:4px 12px; border-radius:20px; font-size:0.9em;">${article.category}</span>
        <span style="color:#666; font-size:0.9em;">${article.readTime}</span>
      </div>
      <h3 style="margin:0 0 12px 0; font-size:1.4em;">${article.title}</h3>
      <p style="color:#666; margin-bottom:20px;">${article.excerpt}</p>
      <button class="cta-button" onclick="openArticle(${article.id})" style="width:100%;">Читать статью</button>
    `;
    blogList.appendChild(articleCard);
  });
}

// Функция для открытия статьи
function openArticle(id) {
  const article = articles.find(a => a.id === id);
  if (!article) return;

  const modal = document.getElementById('articleModal');
  const content = document.getElementById('articleModalContent');
  
  content.innerHTML = `
    <h2 style="font-size:2em; margin-bottom:20px;">${article.title}</h2>
    <div style="display:flex; gap:12px; margin-bottom:20px;">
      <span style="background:#f0f7fa; color:var(--accent-color); padding:4px 12px; border-radius:20px;">${article.category}</span>
      <span style="color:#666;">${article.date}</span>
      <span style="color:#666;">${article.readTime}</span>
    </div>
    <img src="${article.image}" alt="${article.title}" style="width:100%; max-height:400px; object-fit:cover; border-radius:12px; margin-bottom:30px;">
    <div style="line-height:1.6; font-size:1.1em;">
      ${article.excerpt}
      <p style="margin-top:20px;">Здесь будет полный текст статьи...</p>
    </div>
  `;
  
  modal.style.display = 'flex';
  document.body.classList.add('modal-open');
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
  // Отображаем статьи при загрузке
  displayArticles();

  // Закрытие модального окна
  document.getElementById('closeArticleModal').addEventListener('click', () => {
    document.getElementById('articleModal').style.display = 'none';
    document.body.classList.remove('modal-open');
  });

  // Поиск по статьям
  document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredArticles = articles.filter(article => 
      article.title.toLowerCase().includes(searchTerm) || 
      article.excerpt.toLowerCase().includes(searchTerm)
    );
    displayArticles(filteredArticles);
  });

  // Фильтрация по категории
  document.getElementById('categoryFilter').addEventListener('change', (e) => {
    const category = e.target.value;
    const filteredArticles = category 
      ? articles.filter(article => article.category === category)
      : articles;
    displayArticles(filteredArticles);
  });

  // Фильтрация по тегам
  document.getElementById('tagFilter').addEventListener('change', (e) => {
    const tag = e.target.value;
    const filteredArticles = tag 
      ? articles.filter(article => article.tags.includes(tag))
      : articles;
    displayArticles(filteredArticles);
  });
}); 