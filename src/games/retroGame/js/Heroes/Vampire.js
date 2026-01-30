import Character from '../Character';
import heroesConfig from '../heroesCharacteristic';
import side from '../side';

export default class Vampire extends Character {
  constructor(level) {
    // const targetClassName = new.target.name;
    let {
      attack,
      defence,
      stepsRadius,
      attackRadius,
    } = heroesConfig[side.COMP]["Vampire"];
    let player = side.COMP;
    super(level, attack, defence, player, stepsRadius, attackRadius);
    // super.type = targetClassName.toLowerCase();
    super.type = "vampire"
  }
}
