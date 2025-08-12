export const FINNY_MESSAGES = {
  GREETINGS: {
    morning: [
      "Bom dia! Pronto para conquistar suas metas hoje? 🌅",
      "Olá! Um novo dia, novas oportunidades de economizar! ☀️",
      "Bom dia! Que tal começarmos organizando as finanças? 🦊"
    ],
    afternoon: [
      "Boa tarde! Como estão os gastos hoje? 🌤️",
      "Olá! Já conferiu seu saldo hoje? 🦊",
      "Boa tarde! Vamos manter o foco nas economias! 💪"
    ],
    evening: [
      "Boa noite! Hora de revisar o dia financeiro! 🌙",
      "Olá! Que tal planejar o orçamento de amanhã? ⭐",
      "Boa noite! Você está indo muito bem! 🦊"
    ]
  },
  
  SPENDING_FEEDBACK: {
    excellent: [
      "Uau! Você está arrasando no controle financeiro! 🎉",
      "Parabéns! Suas economias estão incríveis! 💚",
      "Que orgulho! Você é um mestre das finanças! ⭐"
    ],
    good: [
      "Muito bem! Você está no caminho certo! 👏",
      "Ótimo trabalho! Continue assim! 💪",
      "Excelente! Suas finanças estão organizadas! 🦊"
    ],
    warning: [
      "Atenção! Você está gastando um pouco mais... 🤔",
      "Cuidado! Que tal revisar os gastos? ⚠️",
      "Ops! Talvez seja hora de economizar mais! 💭"
    ],
    danger: [
      "Alerta! Seus gastos estão acima do limite! 🚨",
      "Cuidado! Você ultrapassou seu orçamento! ⛔",
      "Socorro! Precisamos controlar esses gastos! 😰"
    ]
  },

  ACHIEVEMENTS: [
    "🎉 Parabéns! Você economizou R$500 este mês!",
    "🏆 Conquista desbloqueada: Mestre da Economia!",
    "⭐ Incrível! 30 dias sem estourar o orçamento!",
    "🎯 Meta alcançada! Você é demais!",
    "💎 Nível Expert desbloqueado!",
    "🦊 Finny está muito orgulhoso de você!"
  ],

  MOTIVATIONAL: [
    "Cada centavo economizado é um passo rumo aos seus sonhos! 💫",
    "Você tem o poder de transformar sua vida financeira! 💪",
    "Pequenas economias, grandes resultados! 🌱",
    "Acredite em você! Suas metas são possíveis! ⭐",
    "O futuro financeiro brilhante começa hoje! 🌟",
    "Você é mais forte que qualquer tentação de gasto! 🦊"
  ],

  TIPS: [
    "💡 Dica: Anote todos os gastos, por menores que sejam!",
    "💡 Dica: Defina metas mensais realistas!",
    "💡 Dica: Reserve sempre 10% da renda para emergências!",
    "💡 Dica: Compare preços antes de comprar!",
    "💡 Dica: Evite compras por impulso, pense duas vezes!",
    "💡 Dica: Acompanhe seus gastos semanalmente!"
  ]
};

export const getRandomMessage = (category) => {
  const messages = FINNY_MESSAGES[category];
  if (!messages || messages.length === 0) return "Olá! 🦊";
  
  return messages[Math.floor(Math.random() * messages.length)];
};

export const getGreetingByTime = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return getRandomMessage('GREETINGS.morning');
  } else if (hour >= 12 && hour < 18) {
    return getRandomMessage('GREETINGS.afternoon');
  } else {
    return getRandomMessage('GREETINGS.evening');
  }
};

export const getSpendingFeedback = (percentage) => {
  if (percentage <= 50) {
    return getRandomMessage('SPENDING_FEEDBACK.excellent');
  } else if (percentage <= 80) {
    return getRandomMessage('SPENDING_FEEDBACK.good');
  } else if (percentage <= 100) {
    return getRandomMessage('SPENDING_FEEDBACK.warning');
  } else {
    return getRandomMessage('SPENDING_FEEDBACK.danger');
  }
};