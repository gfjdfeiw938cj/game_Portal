import Character from '../Character';
import heroesConfig from '../heroesCharacteristic';
import side from '../side';

export default class Bowman extends Character {
  constructor(level) {
    // const targetClassName = new.target.name;
    let {
      attack,
      defence,
      stepsRadius,
      attackRadius,
    } = heroesConfig[side.USER]["Bowman"];
    let player = side.USER;
    super(level, attack, defence, player, stepsRadius, attackRadius);
    // super.type = targetClassName.toLowerCase();
    super.type = "bowman" 
  }
}
