import Character from '../Character';
import heroesConfig from '../heroesCharacteristic';
import side from '../side';

export default class Daemon extends Character {
  constructor(level) {
    // const targetClassName = new.target.name;
    let {
      attack,
      defence,
      stepsRadius,
      attackRadius,
    } = heroesConfig[side.COMP]["Daemon"];
    let player = side.COMP;
    super(level, attack, defence, player, stepsRadius, attackRadius);
    // super.type = targetClassName.toLowerCase();
    super.type = "daemon" 
  }
}