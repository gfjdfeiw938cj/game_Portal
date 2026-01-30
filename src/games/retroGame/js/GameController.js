/* eslint-disable max-len */
import themes from './themes';
import cursors from './cursors';
import side from './side';
import GameState from './GameState';
import PositionedCharacter from './PositionedCharacter';
import Bowman from './Heroes/Bowman';
import Daemon from './Heroes/Daemon';
import Magician from './Heroes/Magician';
import Swordsman from './Heroes/Swordsman';
import Undead from './Heroes/Undead';
import Vampire from './Heroes/Vampire';
import {
  generateTeam,
  startFieldGenerator,
  getAvailableDistance,
  getAvailableAttack,
} from './generators';

// Типы персонажей пользователей
const userTypes = [Swordsman, Bowman, Magician];
const computerTypes = [Daemon, Undead, Vampire];

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = null; // Актуальное состояние игры
  }

  /**
   * Старт игры
   */
  init() {
    this.loadGame();
  }

  checkCell() {
    // События мыши на ячейке
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    // Сохранение игры
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    // Загрузка игры
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    // Новая игра
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
  }

  /**
   * Действие при клике
   * @param {*} index * индекс ячейки по которой произошел клик
   * @returns -
   */
  onCellClick(index) {
   // Находим из всех созданных obj инф. о персонажей игры записаный в (this.gameState.teams) того которого мы выбрали.
    const hero = this.gameState.teams.find((elem) => elem.position === index);
    if (hero && hero.character.player === side.USER) { // Проверяем если ли на ячейки герой и ходят герои игрока или компьютера 
      //Для игрока 
      if (this.gameState.selectedHero) this.gamePlay.deselectCell(this.gameState.selectedHero.position); // Проверяем выбран ли персонаж (подсвеченый желтым цветом) по нажатию на его мыши 
      this.gamePlay.selectCell(index); // Метод подсвечивает игрока желтым цветом на игровом поле 
      this.gameState.availableSteps = getAvailableDistance(index, hero.character.stepsRadius); // Определяется зона по которому игрок может ходить по игровому полю, за 1 ход. Возрашает номера ячеек зоны.
      this.gameState.availableAttack = getAvailableAttack(index, hero.character.attackRadius); // Определяется дистанция атаки игрока 
      this.gameState.selectedHero = hero; // Сохраняем или пересохраняем факт выбора героя (подсвеченый желтым цветом) при нажатии на него. 
      return;
    }

    // Ход. Клик в пустое поле
    if (this.gameState.selectedHero) {
      // Выбранная ячейка входит в допуск зоны перемешения героя и в нем нет героя
      if (this.gameState.availableSteps.includes(index) && !hero) {
        this.gamePlay.deselectCell(this.gameState.selectedHero.position); // Удаляем подсветку желтого цвета изображенную на игроке и подсветку зеленого цвета куда игрок будет ходить.
        this.gameState.selectedHero.position = index; // Меняем позицию игрока на игровом поле. Куда переместится иконка игрока на поле. 
        this.gamePlay.deselectCell(index);// Удаляем подсветку зеленного цвета.
        // Проверка окончания уровня и передача хода
        this.checkLevel();
      }
      // Если в поле есть противник атакуем
      if (hero && hero.character.player === side.COMP && this.gameState.availableAttack.includes(index)) {
        this.attack(hero, this.gameState.selectedHero, index);
      }
      // Сообщение
      if (hero && hero.character.player === side.COMP && !this.gameState.availableAttack.includes(index)) {
        this.gamePlay.showPopup('Нужно подойти ближе');
      }
      return;
    }
    // Сообщения об ошибке
    if (!this.gameState.selectedHero && hero && hero.character.player === side.COMP) {
      let { type } = hero.character;
      type = type[0].toUpperCase() + type.slice(1);
      this.gamePlay.showPopup(`Это ${type}! Он явно не из наших!`);
    }

    // if (!this.gameState.selectedHero && !hero) {
    //   // GamePlay.showError('Тут никого нет');
    //   this.gamePlay.showPopup('Тут никого нет');
    // }
  }

  /**
   * Действие при уходе с ячейки
   * @param {*} index - индекс ячейки
   */
  onCellLeave(index) {
    // Убираем сплывающие окно "пример(🎖 1 ⚔ 25 🛡 25 ❤ 100)
    this.gamePlay.hideCellTooltip(index);
    // Условие проверяет если выбраный герой (герой подсвеченный желтым цветом) не сходил то подсветка остается на своем месте до тех пор пока герой не сходит.
    if (this.gameState.selectedHero && (this.gameState.selectedHero.position !== index)) {
      this.gamePlay.deselectCell(index);
    }
  }

  /**
   * Действие при наведении на ячейку
   * @param {*} index - индекс ячейки
   */
  onCellEnter(index) {
    // Сравнивает из списка obj инф о героях их позицию с реальной позицией на игр. поле. Если есть на этой ячеки игр. поля героя то возрашем obj инф о герое
    const hero = this.gameState.teams.find((elem) => elem.position === index);
    
    if (hero) { //Если герой есть на ячейки то создаём всплывающее окно по наведению с информацией о персонаже "пример(🎖 1 ⚔ 25 🛡 25 ❤ 100)" и номер клетки игрового поля в showCellTooltip
      const toolTip = this.constructor.createToolTipTemplate.call(this, hero);
      this.gamePlay.showCellTooltip(toolTip, index);
    }
    // Меняем тип курсора,если нет выбранного персонажа
    this.activeCursor(hero);

    // Проверяем был ли выбран персонаж(выбранный персонаж обзн. желтым цветом) на игр. поле. Если да то возле героя по наведению на ячейку игр. поля посвечивается область дальнейшего его хода.  
    if (this.gameState.selectedHero) {
      this.activeCursorSelectedHero(index, hero);
    }
  }

  /**
   * Формирует шаблон всплывающей информации о персонаже
   * @param {*} hero - объект с характеристиками персонажа
   * @returns - шаблон (строка)
   */
  static createToolTipTemplate(hero) {
    const {
      level,
      health,
      attack,
      defence,
    } = hero.character;
    return `\u{1F396} ${level} \u{2694} ${attack} \u{1F6E1} ${defence} \u{2764} ${health}`;
  }

  /**
   * Устанавливает курсор, если нет выбранного персонажа
   * @param {*} hero - объект с характеристиками персонажа
   */
  activeCursor(hero) {
    if (hero) {
      const pointer = hero.character.player === side.USER ? cursors.pointer : cursors.notallowed; // Условие которое проверяет какой тип курсора нужно изменить, если навели на игрока то pointer, если на противника то notallowed
      this.gamePlay.setCursor(pointer); //Активация одного из игровых курсоров.
    } else {
      this.gamePlay.setCursor(cursors.auto); // Курсор остается без изменений (стандартный курсор)
    }
  }

  /**
   * Изменяет типа курсора и подсветку ячейки хода/атаки при выбранном персонаже
   * @param {*} index - индекс ячейки
   * @param {*} hero - объект с характеристиками персонажа
   */
  activeCursorSelectedHero(index, hero) {
    if (this.gameState.availableSteps.includes(index) && !hero) { //Проверяем если выбранная клетка игрового поля входит в область возможного хода игрока и на наличие сушности игрок или ИИ или пустое место в этой клетки. 
      this.gamePlay.setCursor(cursors.pointer); // меняем тип курсора на 'pointer'
      this.gamePlay.selectCell(index, 'green'); // Подсвечивает выбранную клетку зеленный цветом на которую может пойти игрок. (курсор ввиде зеленого круга вписаного в клетку игр. поля)
    } else if (hero && hero.character.player === side.COMP && this.gameState.availableAttack.includes(index)) {
      this.gamePlay.setCursor(cursors.crosshair);
      this.gamePlay.selectCell(index, 'red');
    } else if (hero && hero.character.player === side.USER) {
      this.gamePlay.setCursor(cursors.pointer);
    } else {
      this.gamePlay.setCursor(cursors.notallowed);
    }
  }

  /**
   * Сохранение игры
   */
  saveGame() {
    this.stateService.save(this.gameState);
    // GamePlay.showMessage('Игра сохранена');
    this.gamePlay.showPopup('Игра сохранена');
  }

  /**
   * Загрузка сохраненной игры, если такая есть
   */
  loadGame() {
    // Чтобы не добавлялись лишние события при загрузке во время игры
    if (this.gamePlay.cellClickListeners.length === 0) {
      this.checkCell();
    }

    // const load = {
      //   availableAttack: null,
      //   availableSteps: null,
      //   motion: "user",
      //   scores: 0,
      //   selectedHero: null,
      //   stage: 1,
      //   teams: [{
      //     character: {
      //       attack: 10,
      //       attackRadius: 4,
      //       defence: 40,
      //       health: 100,
      //       level: 1,
      //       player: "user",
      //       stepsRadius: 1,
      //       type: "magician"
      //     },
      //     position: 49
      //   }, {
      //     character: {
      //       attack: 25,
      //       attackRadius: 2,
      //       defence: 25,
      //       health: 100,
      //       level: 1,
      //       player: "user",
      //       stepsRadius: 2,
      //       type: "bowman"
      //     },
      //     position: 0
      //   }, {
      //     character: {
      //       attack: 25,
      //       attackRadius: 2,
      //       defence: 25,
      //       health: 100,
      //       level: 1,
      //       player: "computer",
      //       stepsRadius: 2,
      //       type: "vampire"
      //     },
      //     position: 46
      //   }, {
      //     character: {
      //       attack: 25,
      //       attackRadius: 2,
      //       defence: 25,
      //       health: 100,
      //       level: 1,
      //       player: "computer",
      //       stepsRadius: 2,
      //       type: "vampire"
      //     },
      //     position: 7
      //   }]
      // }
    try {
      const load = this.stateService.load(); //Возвращаем Obj извлеченного из локального хранилища сохраненой туда данных с игрой  
      if (load) {
        this.gameState = GameState.from(load); //Перезаписываем load и возрашаем актуальное состояние игры и возрашаем this.gameState(Obj)
        this.gamePlay.drawUi(Object.values(themes)[this.gameState.stage - 1]); //Получаем массив из 63 ячеек игрового поля записав их в GamePlay.this.cells и childNodes:(псевдо массив) GamePlay.this.boardEl
        this.gamePlay.redrawPositions(this.gameState.teams); //После этого метода появляется на экр. карта с игроками 
      } else {
        this.newGame();
      }
    } catch (error) {
      // localStorage.removeItem('state');
      this.constructor.clearLocalStorage('state');
      this.gamePlay.showPopup(`Ошибка загрузки: "${error.message}"`);
      this.newGame();
    }
  }

  /**
   * Новая игра сначала
   */
  newGame() {
    if (this.gamePlay.cellClickListeners.length === 0) {
      this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    }
    const totalScores = this.gameState ? this.gameState.scores : 0;
    this.gameState = new GameState(1, [], side.USER, totalScores);
    this.nextStage(this.gameState.stage);
  }

  /**
   * Переход хода
   */
  nextPlayer() {
    this.gameState.motion = (this.gameState.motion === side.USER) ? side.COMP : side.USER; // Определяет кто ходит человек или компьютер
    // console.log('Ход переходит к:', this.gameState.motion);
    if (this.gameState.motion === side.COMP) {
      this.computerLogic(); // Логика хода и атаки компьютера
    }
    this.gameState.clear();
  }

  /**
   * Проверка окончания уровня
   */
  checkLevel() {
    const userValue = this.gameState.teams.some((member) => member.character.player === side.USER);// Проверяем если это герой в списки пользователя  возрашаем логич знач.
    const computerValue = this.gameState.teams.some((member) => member.character.player === side.COMP);//  Проверяем если это герой в списки компьютера(ИИ) возрашаем логич знач.
    if (userValue && computerValue) {
      this.nextPlayer(); //  Передача хода. Если ходит компьютер(ИИ) то генерируем логику дейсвий компьютер(ИИ). После передачи хода игроку удаляем значения область атаки, область хода героя.  
      return;
    }
    if (!computerValue) {
      this.gameState.clear(); // Очищает значение доступных шагов и атаки
      this.gameState.addScores(); // Считает и добавляет очки за раунд
      this.nextStage(this.gameState.stage += 1); 
    }
    if (!userValue) {
      // GamePlay.showMessage('Враг оказался хитрее и сильнее(((');
      this.gamePlay.showPopup('Вы проиграли! Попробуйте еще раз!');
    }
  }

  /**
   * Переход на следующий уровень
   * @param {number} stage - Номер уровня
   */
  nextStage(stage) {
    if (stage === 1) {
      this.constructor.teamGeneration.call(this, userTypes, side.USER, 1, 2);
      this.constructor.teamGeneration.call(this, computerTypes, side.COMP, 1, 2);
    }

    if (stage > 1 && stage < 5) {
      this.constructor.levelUp.call(this);// Повышаем уровень оставшимся героям USER
      const count = (stage === 2) ? 1 : 2;// + новый герой к команде user
      this.constructor.teamGeneration.call(this, userTypes, side.USER, stage - 1, count);
      const userCount = this.gameState.teams.filter((member) => member.character.player === side.USER).length; // Определяем колличесво героев у USER.
      this.constructor.teamGeneration.call(this, computerTypes, side.COMP, stage, userCount); // Генерируем новую команду героев COMP, она будет такой же по количеству героев что у команды USER.
      this.gamePlay.showPopup(`Уровень ${stage} Счет: ${this.gameState.scores}`);
    }

    if (stage >= 5) {
      // Блокировка поля
      this.gamePlay.cellClickListeners.length = 0;
      // GamePlay.showMessage(`Победа! Игра окончена. Счет: ${this.gameState.scores}`);
      this.gamePlay.showPopup(`Победа! Игра окончена. Счет: ${this.gameState.scores}`);
    } else {
      this.gamePlay.drawUi(Object.values(themes)[this.gameState.stage - 1]);
      this.gamePlay.redrawPositions(this.gameState.teams);
      // this.gamePlay.showPopup(`Уровень ${stage} Счет: ${this.gameState.scores}`);
    }
  }

  /**
   * Атака, расчет, выделение, удаление погибшего героя
   */
  async attack(attacked, attacker, indexAttacked) {
    // Значение атаки атакующего персонажа
    const { attack } = attacker.character;
    // Значение защиты атакуемого
    const { defense } = attacked.character;
    // Атакуемый персонаж
    const attackedUnit = attacked.character;
    // Урон от атаки
    const damage = 2 * Math.round(Math.max((attack - defense, attack * 0.1)));
    attackedUnit.health -= damage;
    // Проверка убит ли герой
    if (attacked.character.health <= 0) {
      this.gameState.removeHero(indexAttacked);
    }
    // Выделяем атакующего и атакуемого героя
    this.gamePlay.selectCell(attacker.position);
    this.gamePlay.selectCell(attacked.position, 'red');
    // Обновляем поле
    this.gamePlay.redrawPositions(this.gameState.teams);
    // Чтобы не было выделения ячеек при анимации
    this.gameState.selectedHero = null;
    // Отображаем уровень урона анимацией
    await this.gamePlay.showDamage(indexAttacked, damage);
    // Снимаем выделение с атакующего и атакуемого героя
    this.gamePlay.deselectCell(attacker.position);
    this.gamePlay.deselectCell(attacked.position);
    this.checkLevel();
  }

  /**
   * Логика хода и атаки компьютера
   */
  computerLogic() {
    const { teams } = this.gameState;
    const computerTeams = teams.filter((member) => member.character.player === side.COMP); // отсоритруем героев компьютера(ИИ)
    const userTeams = teams.filter((member) => member.character.player === side.USER);// отсоритруем героев игрока
    const arr2 = teams.map((el) => el.position);
    // Проверяем возможность атаки
    const attack = computerTeams.some((compUnit) => {
      this.gameState.availableAttack = getAvailableAttack(compUnit.position, compUnit.character.attackRadius); // Определяем зону атаки компьютеров(ИИ) 
      const attacked = userTeams.find((userUnit) => this.gameState.availableAttack.includes(userUnit.position)); // Определяем находится ли игрок в зоне поражения атаки компьютера(ИИ) 
      if (attacked) {
        this.attack(attacked, compUnit, attacked.position); // 
        return true; // Если игрок находится в зоне поражения атаки компьютера(ИИ) возвращаем true
      }
      return false; // Если нет то возвращаем false
    });
    // Ход computer
    if (!attack && computerTeams.length && userTeams.length) { // Условие если компьютер(ИИ) не может атаковать и если живые герои компьютер(ИИ) и живые герои Игрока
      const unit = Math.floor(Math.random() * computerTeams.length); // Кто будет ходить из героев компьютера(ИИ) (Случайно генерируется номер героя компьютера(ИИ) который будет ходить)
      const steps = getAvailableDistance(computerTeams[unit].position, computerTeams[unit].character.stepsRadius).filter((x) => teams.map((el) => el.position).indexOf(x) < 0); // Определим зону доступного для шага компьютера(ИИ) по игр. карте 
      const step = Math.floor(Math.random() * steps.length); // Рэндомного получаем индекс из массива для выбора его в качесве компьютера(ИИ)
      computerTeams[unit].position = steps[step]; // Определяем на какую клетку будет ходить компьютер. Выбор осуществляется из массива доступных для компьютера(ИИ) ячеек перемещения. Возращаем индекс для массива steps
      this.checkLevel(); // Проверка окончания уровня и стирает массив с зоной доступного для шага компьютера(ИИ) и зоной атаки компьютеров(ИИ)
      this.gamePlay.redrawPositions(this.gameState.teams); // Отрисовка героев на игр. карте героев.
    }
  }

  /**
   * Повышает уровень членов команды
   */
  static levelUp() {
    let arr = [];
    for (const member of this.gameState.teams) {
      const parameter = member.character;
      member.position = startFieldGenerator(side.USER, arr); // Раставляем случайно героев в стартовые ячеки игрового поля  
      parameter.level += 1;
      parameter.health = parameter.health + 80 >= 100 ? 100 : parameter.health + 80; // Прибавляем здоровь зависимости от того на сколько мы его потеряли в прошлой игре
      parameter.attack = Math.floor(Math.max(parameter.attack, parameter.attack * (0.8 + parameter.health / 100)));
    }
    arr = [];
  }

  /**
   *  Генератор стартовых команд (два не могут быть на одном поле)
   * @param {*} teamType - Массив допустимых классов игрока
   * @param {*} prayer - Тип игрока 'user' или 'computer'
   * @returns - Массив объектов типа PositionedCharacter
   */
  static teamGeneration(teamType, prayer, maxLevel, count) {
    // Генерируем новую команду
    let newTeam = generateTeam(teamType, maxLevel, count);
    // Список занятых на поле позиций
    const positionList = [];
    if (this.gameState.teams.length) {
      this.gameState.teams.forEach((elem) => positionList.push(elem.position));
    }
    // Добавляем позиции новым персонажам
    let arr = []
    newTeam = newTeam.toArray.reduce((acc, member) => {
      // Случайная позиция персонажа из списка доступных
      let randomNumber = startFieldGenerator(prayer, arr);
      positionList.push(randomNumber);
      acc.push(new PositionedCharacter(member, randomNumber));
      return acc;
    }, []);
    arr = []
    this.gameState.teams.push(...newTeam);
  }

  /**
 * Очищает локальное хранилище
 * @param {string} key - значение по которому очистить localStorage;
 */
  static clearLocalStorage(key) {
    localStorage.removeItem(key);
  }
}
