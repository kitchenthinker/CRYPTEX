// --- КОНФИГУРАЦИЯ ЗАГАДКИ ---
const CORRECT_PHRASE_WORDS = [
  "WU9V",
  "QVJF",
  "REVBUg==",
  "VE8=",
  "TVk=",
  "SEVBUlQ=",
];
const CORRECT_INITIALISM_LETTERS = [
  "WQ==",
  "QQ==",
  "RA==",
  "VA==",
  "TQ==",
  "SA==",
];
const CORRECT_SCRAMBLED = "QURJUlRT";
const CORRECT_FINAL_WORD = "VEFSRElT";
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const clickSound = new Audio("rotate.mp3");
const backgroundMusic = new Audio("background_music.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.1;

incorrectAttemptsCount = 0;

// --- ЭЛЕМЕНТЫ И СОСТОЯНИЕ ---
const container = document.querySelector(".container");
const feedback1 = document.getElementById("feedback1");
const feedback2 = document.getElementById("feedback2");
const feedback3 = document.getElementById("feedback3");

// --- ОБЩИЕ ФУНКЦИИ ---
function handleIncorrectAnswer(feedbackElement) {
  container.classList.add("shake");
  incorrectAttemptsCount++;
  // Вызываем нашу функцию
  onIncorrectAttempt(incorrectAttemptsCount);
  setTimeout(() => {
    container.classList.remove("shake");
  }, 500);
  feedbackElement.textContent = "Нет, здесь что-то не так.";
  setTimeout(() => {
    feedbackElement.textContent = "";
  }, 5000);
}

// --- ЛОГИКА УПРАВЛЕНИЯ МУЗЫКОЙ ---
function saveMusicState() {
  localStorage.setItem("musicTime", backgroundMusic.currentTime);
  localStorage.setItem("musicIsPlaying", !backgroundMusic.paused);
}

function restoreMusicState() {
  const savedTime = localStorage.getItem("musicTime");
  const isPlaying = localStorage.getItem("musicIsPlaying") === "true";

  if (savedTime && isPlaying) {
    backgroundMusic.currentTime = parseFloat(savedTime);
    backgroundMusic.play();
  }
}

// --- ЛОГИКА ЭТАПА 1 ---
async function loadPhase1FinalContent() {
  try {
    const response = await fetch("asdqlx.html");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    document.getElementById("phase-1-final").innerHTML = content;

    const yesButton = document.getElementById("yes-button");
    const noButton = document.getElementById("no-button");
    if (yesButton && noButton) {
      yesButton.addEventListener("mouseover", () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const buttonRect = yesButton.getBoundingClientRect();

        const newX = Math.random() * (viewportWidth - buttonRect.width);
        const newY = Math.random() * (viewportHeight - buttonRect.height);

        yesButton.style.position = "fixed";
        yesButton.style.left = `${newX}px`;
        yesButton.style.top = `${newY}px`;
      });

      noButton.addEventListener("click", () => {
        saveMusicState();
        localStorage.setItem("phase1Completed", "true");
        window.location.href = "jsdkrrow.html";
      });
    }
  } catch (error) {
    console.error("Failed to load phase 1 final content:", error);
  }
}

// function checkPhase1() {
//   let inputs = document.querySelectorAll(".word-input");
//   let userAnswer = [];

//   for (let input of inputs) {
//     let value = input.value.toUpperCase().trim();
//     if (!/^[A-Z]+$/.test(value)) {
//       handleIncorrectAnswer(feedback1);
//       feedback1.textContent = "Ошибка: Только латинские буквы.";
//       return;
//     }
//     userAnswer.push(value);
//   }

//   // Расшифровываем правильные ответы для сравнения
//   const decodedCorrectWords = CORRECT_PHRASE_WORDS.map((word) => atob(word));

//   if (JSON.stringify(userAnswer) === JSON.stringify(decodedCorrectWords)) {
//     incorrectAttemptsCount = 0;
//     document.getElementById("phase-1").style.display = "none";
//     document.getElementById("phase-1-final").style.display = "block";

//     loadPhase1FinalContent().then(() => {
//       const fullPhrase = document.getElementById("full-phrase");
//       const initialism = document.getElementById("initialism");
//       fullPhrase.style.animation = "fadeOutUp 1s ease-out forwards";
//       setTimeout(() => {
//         fullPhrase.style.display = "none";
//         initialism.style.display = "block";
//         initialism.style.animation = "fadeIn 1.5s ease-in forwards";
//       }, 1000);
//     });
//   } else {
//     handleIncorrectAnswer(feedback1);
//   }
// }

function checkPhase1() {
  const inputs = document.querySelectorAll(".word-input");
  let userAnswer = [];

  // Расшифровываем правильные ответы заранее
  const decodedCorrectWords = CORRECT_PHRASE_WORDS.map((word) => atob(word));
  let correctCount = 0;

  // 1. Сначала проверяем валидность символов (чтобы не красить, если введен мусор)
  for (let input of inputs) {
    let value = input.value.toUpperCase().trim();
    if (!/^[A-Z]+$/.test(value)) {
      handleIncorrectAnswer(feedback1);
      feedback1.textContent = "Ошибка: Только латинские буквы.";
      return;
    }
  }

  // 2. Проходим по полям, собираем ответ и красим инпуты
  inputs.forEach((input, index) => {
    let value = input.value.toUpperCase().trim();
    userAnswer.push(value);

    if (value === decodedCorrectWords[index]) {
      // --- ВЕРНО (ЗЕЛЕНЫЙ) ---
      correctCount++;
      input.style.border = "2px solid #4CAF50"; // Зеленая рамка
      input.style.backgroundColor = "rgba(76, 175, 80, 0.2)"; // Светло-зеленый фон
      input.style.color = "#1b5e20"; // Темно-зеленый текст
    } else {
      // --- НЕВЕРНО (КРАСНЫЙ) ---
      input.style.border = "2px solid #F44336"; // Красная рамка
      input.style.backgroundColor = "rgba(244, 67, 54, 0.2)"; // Светло-красный фон
      input.style.color = "#b71c1c"; // Темно-красный текст
    }
  });

  // 3. Финальная проверка
  if (correctCount === decodedCorrectWords.length) {
    // УСПЕХ
    incorrectAttemptsCount = 0;
    document.getElementById("phase-1").style.display = "none";
    document.getElementById("phase-1-final").style.display = "block";

    loadPhase1FinalContent().then(() => {
      const fullPhrase = document.getElementById("full-phrase");
      const initialism = document.getElementById("initialism");
      fullPhrase.style.animation = "fadeOutUp 1s ease-out forwards";
      setTimeout(() => {
        fullPhrase.style.display = "none";
        initialism.style.display = "block";
        initialism.style.animation = "fadeIn 1.5s ease-in forwards";
      }, 1000);
    });
  } else {
    // НЕУДАЧА
    handleIncorrectAnswer(feedback1);
    feedback1.textContent = `Верно слов: ${correctCount} из ${decodedCorrectWords.length}.`;
  }
}

// --- ЛОГИКА ЭТАПА 2 (КРИПТЕКС) ---
function rotateCryptex(element, direction) {
  const letterSpan = element.parentElement.querySelector(
    "span:not(.cryptex-arrow)"
  );
  clickSound.currentTime = 0;
  clickSound.play();

  letterSpan.classList.add("fade-out-down");

  setTimeout(() => {
    let currentChar = letterSpan.textContent;
    let currentIndex = ALPHABET.indexOf(currentChar);
    let newIndex =
      (currentIndex + direction + ALPHABET.length) % ALPHABET.length;
    letterSpan.textContent = ALPHABET[newIndex];

    letterSpan.classList.remove("fade-out-down");
    letterSpan.classList.add("fade-in-up");

    setTimeout(() => {
      letterSpan.classList.remove("fade-in-up");
    }, 200);
  }, 200);
}

function resetCryptex() {
  const cryptexWheels = document.querySelectorAll(".cryptex-wheel");
  // Расшифровываем правильные инициалы для сброса
  const decodedInitialLetters = CORRECT_INITIALISM_LETTERS.map((letter) =>
    atob(letter)
  );

  cryptexWheels.forEach((wheel, index) => {
    const letterSpan = wheel.querySelector("span:not(.cryptex-arrow)");
    letterSpan.textContent = decodedInitialLetters[index];
  });
  clickSound.currentTime = 0;
  clickSound.play();
}

function checkPhase2() {
  let userAnswer = "";
  const cryptexWheels = document.querySelectorAll(".cryptex-wheel");
  cryptexWheels.forEach((wheel) => {
    const letterSpan = wheel.querySelector("span:not(.cryptex-arrow)");
    userAnswer += letterSpan.textContent;
  });

  // Расшифровываем правильный ответ для сравнения
  const decodedScrambled = atob(CORRECT_SCRAMBLED);

  if (userAnswer === decodedScrambled) {
    saveMusicState();
    incorrectAttemptsCount = 0;
    localStorage.setItem("phase2Completed", "true");
    window.location.href = "iqwemxk.html";
  } else {
    handleIncorrectAnswer(feedback2);
  }
}

// --- ЛОГИКА ЭТАПА 3 (DRAG-AND-DROP) ---
let draggedItem = null;
let dragSourceContainer = null;

function setupDragAndDrop() {
  document.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("draggable-letter")) {
      draggedItem = e.target;
      dragSourceContainer = draggedItem.parentElement;
      setTimeout(() => {
        e.target.style.opacity = "0.5";
      }, 0);
    }
  });

  document.addEventListener("dragend", (e) => {
    if (draggedItem) {
      setTimeout(() => {
        draggedItem.style.opacity = "1";
      }, 0);
      draggedItem = null;
      dragSourceContainer = null;
    }
  });

  document.addEventListener("dragover", (e) => {
    e.preventDefault();
    let target = e.target;
    if (
      target.classList.contains("final-letter-slot") &&
      !target.querySelector(".draggable-letter")
    ) {
      target.style.border = "2px solid #8b4513";
    } else if (
      target.classList.contains("draggable-letter") ||
      target.id === "draggable-letters"
    ) {
      target.style.border = "2px solid #8b4513";
    }
  });

  document.addEventListener("dragleave", (e) => {
    let target = e.target;
    if (
      target.classList.contains("final-letter-slot") &&
      !target.querySelector(".draggable-letter")
    ) {
      target.style.border = "";
    } else if (
      target.classList.contains("draggable-letter") ||
      target.id === "draggable-letters"
    ) {
      target.style.border = "";
    }
  });

  document.addEventListener("drop", (e) => {
    e.preventDefault();
    let target = e.target;

    if (
      target.classList.contains("final-letter-slot") &&
      !target.querySelector(".draggable-letter")
    ) {
      target.appendChild(draggedItem);
      draggedItem.classList.add("in-slot");
      target.classList.add("filled");
      target.style.border = "";
    } else if (
      target.classList.contains("draggable-letter") &&
      target.parentElement.classList.contains("final-letter-slot")
    ) {
      const targetSlot = target.parentElement;
      const tempParent = draggedItem.parentElement;
      targetSlot.appendChild(draggedItem);
      tempParent.appendChild(target);
      targetSlot.style.border = "";
    } else if (target.id === "draggable-letters") {
      target.appendChild(draggedItem);
      draggedItem.classList.remove("in-slot");
      if (
        dragSourceContainer &&
        dragSourceContainer.classList.contains("final-letter-slot")
      ) {
        dragSourceContainer.classList.remove("filled");
      }
      target.style.border = "";
    }

    if (draggedItem) {
      draggedItem.style.opacity = "1";
    }
  });
}

function checkPhase3() {
  let finalAnswer = "";
  const finalLetterSlots = document.querySelectorAll(".final-letter-slot");
  finalLetterSlots.forEach((slot) => {
    const letter = slot.querySelector(".draggable-letter");
    if (letter) {
      finalAnswer += letter.textContent;
    }
  });

  // Расшифровываем правильный ответ для сравнения
  const decodedFinalWord = atob(CORRECT_FINAL_WORD);

  if (finalAnswer === decodedFinalWord) {
    incorrectAttemptsCount = 0;
    saveMusicState();
    localStorage.clear();
    window.location.href = "asdmqwle.html";
  } else {
    handleIncorrectAnswer(feedback3);
  }
}

// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener("DOMContentLoaded", () => {
  createCarrots();
  document.body.addEventListener(
    "click",
    () => {
      if (backgroundMusic.paused) {
        backgroundMusic.play();
      }
    },
    { once: true }
  );

  restoreMusicState();

  // Этап 1
  if (document.getElementById("phase-1")) {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabIndex = button.dataset.tab;
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        tabContents.forEach((content) => content.classList.remove("active"));
        tabContents[tabIndex].classList.add("active");
      });
    });
    document
      .getElementById("check-phase-1-button")
      .addEventListener("click", checkPhase1);
  }

  // Этап 2
  if (document.getElementById("phase-2")) {
    if (!localStorage.getItem("phase1Completed")) {
      window.location.href = "index.html";
      return;
    }

    const cryptexWheels = document.querySelectorAll(".cryptex-wheel");
    // Расшифровываем инициалы для начального состояния
    const decodedInitialLetters = CORRECT_INITIALISM_LETTERS.map((letter) =>
      atob(letter)
    );

    cryptexWheels.forEach((wheel, index) => {
      const letterSpan = wheel.querySelector("span:not(.cryptex-arrow)");
      letterSpan.textContent = decodedInitialLetters[index];
      wheel
        .querySelector(".cryptex-arrow.up")
        .addEventListener("click", () =>
          rotateCryptex(wheel.querySelector(".cryptex-arrow.up"), 1)
        );
      wheel
        .querySelector(".cryptex-arrow.down")
        .addEventListener("click", () =>
          rotateCryptex(wheel.querySelector(".cryptex-arrow.down"), -1)
        );
    });
    document
      .getElementById("check-phase-2-button")
      .addEventListener("click", checkPhase2);
    document
      .getElementById("reset-phase-2-button")
      .addEventListener("click", resetCryptex);
  }

  // Этап 3
  if (document.getElementById("phase-3")) {
    if (!localStorage.getItem("phase2Completed")) {
      window.location.href = "index.html";
      return;
    }

    setupDragAndDrop();
    document
      .getElementById("check-phase-3-button")
      .addEventListener("click", checkPhase3);
  }
});

window.addEventListener("beforeunload", saveMusicState);

// --- НОВАЯ ЛОГИКА ДЛЯ МОРКОВОК ---
function createCarrots() {
  const carrotContainer = document.getElementById("carrot-container");
  const numCarrots = 30; // Количество морковок

  for (let i = 0; i < numCarrots; i++) {
    const carrot = document.createElement("div");
    carrot.classList.add("carrot");

    // Случайные значения для начального положения и скорости
    const leftPosition = Math.random() * 100;
    const animationDuration = Math.random() * 10 + 10; // от 10 до 20 секунд
    const animationDelay = Math.random() * 20; // от 0 до 20 секунд

    carrot.style.left = `${leftPosition}vw`;
    carrot.style.animationDuration = `${animationDuration}s`;
    carrot.style.animationDelay = `${animationDelay}s`;

    carrotContainer.appendChild(carrot);
  }
}

// Определяем массив стикеров
const stickers = [
  {
    name: "kt-sticker",
    image: "kt_sticker.png",
  },
  {
    name: "fet-sticker",
    image: "fet_sticker.png",
  },
];

// Определяем массив фраз
const phrases = [
  "Заяц, я в тебя верю!",
  "Ира, я в тебя верю!",
  "Ира, ты справишься!",
  "Я с тобой до конца!",
  "...название моего домашнего видео!",
  "Не в ту сторону, женщина! :)",
  "Упёрлась в... загадку? :)",
  "... так сказали профурсетки :)",
  "Да, загадки в Сайлент Хилл и то легче были...",
];

// Функция для получения случайного элемента из массива
function getRandomElement(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function onIncorrectAttempt(attemptNumber) {
  if (attemptNumber > 0 && attemptNumber % 3 === 0) {
    const selectedSticker = getRandomElement(stickers);
    const selectedPhrase = getRandomElement(phrases);

    showPopup(selectedSticker.image, selectedPhrase);
  }
}

function showPopup(stickerImage, phraseText) {
  const popupContainer = document.getElementById("popup-container");
  const popupSticker = document.getElementById("popup-sticker");
  const popupPhrase = document.getElementById("popup-phrase");

  // Устанавливаем src для изображения и текст для фразы
  popupSticker.src = stickerImage;
  popupPhrase.textContent = phraseText;

  // Сначала убеждаемся, что элемент находится в начальном состоянии (скрыт)
  popupContainer.classList.remove("show");

  // Используем requestAnimationFrame для плавного появления
  requestAnimationFrame(() => {
    popupContainer.classList.add("show");
  });

  // Устанавливаем таймер для скрытия
  setTimeout(() => {
    popupContainer.classList.remove("show");
  }, 3000);
}
