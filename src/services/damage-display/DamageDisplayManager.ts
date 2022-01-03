import { Timer } from "w3ts/index";
import { DamageEvent } from "../../systems/damage/DamageEvent";

export class DamageDisplayManager {

    DisplayDamageEvent(e: DamageEvent) {

        let damage = e.damage;
        const source = e.source;
        const target = e.targetUnit.handle;
        const owner = source.owner.handle;
        
        let size = (damage / 60) * 3 + 8;

        let rgb = [ 100, 70, 70];
        if (e.isCrit) {
            rgb = [100, 0, 100];
        } else if (damage == 0) {
            rgb = [40, 40, 100];
        }
        
        let ang = math.random(45, 135) * bj_DEGTORAD;
        let dx = 0.086203125 * math.cos(ang);
        let dy = 0.086203125 * math.sin(ang);

        let dmgString = damage.toString();
        let tim = new Timer();
        if (owner == GetLocalPlayer()) {
            let tt = CreateTextTagUnitBJ(dmgString, target, 35, size, rgb[0], rgb[1], rgb[2], 0);

            SetTextTagPermanent(tt, false);
            SetTextTagFadepoint(tt, 0.4);
            if (e.isCrit) {
                let tim = new Timer();
                let count = 12;
                tim.start(0.015, true, () => {
                    if (count-- > 0) SetTextTagTextBJ(tt, dmgString, size++);
                    else tim.destroy();
                });
                SetTextTagVelocity(tt, dx * 0.3, dy * 0.3)
                SetTextTagLifespan(tt, 0.5);
            } else {
                SetTextTagVelocity(tt, dx, dy);
                SetTextTagLifespan(tt, 0.6);
            }
        } else {
            tim.destroy();
        }
    }
}