export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem('state', JSON.stringify(state));
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem('state')); //Извлекаем из локального хранилища данные с сохраненной игрой и преобразуем из строки в obj
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
