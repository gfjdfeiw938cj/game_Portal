    const TOTAL_PAIRS = 8;
      const TEXT_WINN = "Победа!";
      const TEXT_LOSS = "Вы проиграли!";

      let time = 60;
      let timerInterval = null; 
      let isTimerRunning = false;

      let openCards = []; 
      let isComparing = false; 
      let matchedPairs = 0;

      const allCards = []; 

      const elementPage = {
        pauseButton: document.querySelector('.stop'),
        modalBackground: document.querySelector('.modal-background'),
        modalMenu: document.querySelector('.modal-menu'),
        resumeButton: document.querySelector('.modal-menu-resume'),
        exitButton: document.querySelector('.modal-menu-exit'),
        exitMenu1: document.querySelector('#exit-1'),
        exitMenu2: document.querySelector('#exit-2'),
        restartButton: document.querySelector('.modal-menu-remove'),
        loseMessage: document.querySelector('.modal-menu-failed'),
        timerElement: document.getElementById('timer'),
        cardContainer: document.getElementById('card-container'),
        titleModel: document.querySelector('.title-moodle'),
        modalMenuButton : document.querySelector(".modal-menu-stop")
      };

      const cardColor = [
        "#FF0000",
        "#FF69B4",
        "#FF7F50",
        "#FFFF00",
        "#9400D3",
        "#32CD32",
        "#1E90FF",
        "#20B2AA",
      ];
      
      

      cardColor.forEach((color) => {
          allCards.push(color);
          allCards.push(color);
      });

      function renderCards() {

        const container = document.getElementById("card-container");
        container.innerHTML = "";

        const mixedIndexes = getShuffledArray(TOTAL_PAIRS * 2);        

        mixedIndexes.forEach((numberColor) => {
          const card = createCard(allCards[numberColor]);
          elementPage.cardContainer.appendChild(card);
        });
      }

       function createCard(data) {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.isOpen = "false";
        card.dataset.color = data; 

        const front = document.createElement("div");
        front.className = "front";

        const back = document.createElement("div");
        back.className = "back";
        back.style.backgroundColor = data;

        card.appendChild(front);
        card.appendChild(back);

        card.addEventListener("click", () => cardClick(card));

        return card;
      }

      function cardClick(card){
        if (
            card.dataset.isOpen === "true" ||
            isComparing ||
            openCards.length >= 2
          ) {
            return;
          }

          card.style.transform = "rotateY(180deg)";
          card.dataset.isOpen = "true";
          openCards.push(card);

          if (openCards.length === 2) {
            isComparing = true;
            const cardOpen = openCards[0];
            const cardNewOpen = openCards[1];
            const colorOpen = cardOpen.dataset.color;
            const colorNewOpen = cardNewOpen.dataset.color;

            if (colorOpen === colorNewOpen) {
              openCards = [];
              isComparing = false;
              matchedPairs++;
              checkWinCondition();
            } else {
              setTimeout(() => {
                cardOpen.style.transform = "rotateY(0deg)";
                cardOpen.dataset.isOpen = "false";
                cardNewOpen.style.transform = "rotateY(0deg)";
                cardNewOpen.dataset.isOpen = "false";
                openCards = [];
                isComparing = false;
              }, 1000); 
            }
          }
      }

      function checkWinCondition() {
        if (matchedPairs === TOTAL_PAIRS) {
         openModal(TEXT_WINN);
          stopTimer();
        }
      }

      function getShuffledArray(count) {
         const arr = [];
          for (let i = 0; i < count; i++) {
            arr.push(i);
          }
          
         for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          
          return arr;
      }

      function startTimer() {
        if (isTimerRunning) return;

        isTimerRunning = true;
        timerInterval = setInterval(updateTime, 1000);
      }

      function stopTimer() {
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
          isTimerRunning = false;
        }
      }

      function updateTime() {
        const minutes = Math.floor(time / 60);
        const seconds = time - minutes * 60;
        elementPage.timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        if (time === 0) {
          stopTimer();
          openModal(TEXT_LOSS);
        }
        time--;
      }


      function openModal(message){
        elementPage.modalBackground.classList.add('show');
        elementPage.modalMenu.classList.add('show'); 
        
        if (message) {
          elementPage.loseMessage.style.display = 'flex'; 
          elementPage.modalMenuButton.style.display = 'none';
        } else {
          elementPage.loseMessage.style.display = 'none';
          elementPage.modalMenuButton.style.display = 'flex'; 
        }
        
        document.querySelector('.title-moodle').textContent = message;
      }

      elementPage.pauseButton.addEventListener("click", () => {
        openModal();
        stopTimer();
      });

      elementPage.resumeButton.addEventListener("click", () => {
        elementPage.modalBackground.classList.remove("show");
         elementPage.modalMenu.classList.remove("show"); 
        startTimer();
      });

      elementPage.exitButton.addEventListener("click", () => {
        document.location = "HomePage.html";
      });

      elementPage.exitMenu2.addEventListener("click", () => {
        document.location = "HomePage.html";
      });

      elementPage.exitMenu1.addEventListener("click", () => {
        document.location = "HomePage.html";
      });
        
      elementPage.restartButton.addEventListener("click", () => {
        location.reload();
      });

      document.addEventListener("DOMContentLoaded", () => {
        startTimer();
        renderCards();
      });