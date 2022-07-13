import demoCategories from './demo-data.mjs';
import fullCategories from './full-data.mjs';

const categories = fullCategories;

export default {
  categories,
  categoryCount: categories.length,
  questionCount: categories.reduce((a, b) => a.questions.length < b.questions.length ? a : b).questions.length,
};
